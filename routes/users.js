var express = require('express');
var router = express.Router();

const status = require('http-status');
const { Sequelize } = require('../models');
let { user } = require('../models');
let { fooditem } = require('../models');
let { restaurant } = require('../models');
let { orderhistory } = require('../models');
let { order } = require('../models');
const stripe = require('stripe')('sk_test_51Kx8ZCSEZtaNkdOtEUs8FtHlNaomnGr0NmppFGn9ugydfxaNdW0RkqDeBlTG9VJc7N1sK2RNW3eHA4M267Ff8sHr0032m8eoO5');
const { Op } = Sequelize;
const accountSid = 'AC3d14f72945a049100faf8340758b53fa'; // Your Account SID from www.twilio.com/console
const authToken = 'c5d45756055f31708f0c131dbf58ef1e'; // Your Auth Token from www.twilio.com/console
const multer = require('multer');
const twilio = require('twilio');
const client = new twilio(accountSid, authToken);
const Vonage = require('@vonage/server-sdk')


const vonage = new Vonage({
  apiKey: "4b4c9cc5",
  apiSecret: "OGvs4ltJiHgLlAc7"
})
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'dfszo7wba',
  api_key: '333748552764884',
  api_secret: 'Yg1ziM93_HVyLbKwKtwJcGKpADI'
});


router.post('/send_otp', async function( req, res, next) {
  const isUserExists = await user.findOne({
    where : {
      isDeleted:false,
      isActive:true,
      mobileNumber:req.body.mobileNumber
    }
  })
  let Otp;
  if(isUserExists){
    Otp = Math.floor(1000 + Math.random() * 9000);
    console.log(Otp)
    await user.update({
      otp_code:Otp
    },{
      where : {
        isDeleted:0,
        isActive:1,
        mobileNumber:req.body.mobileNumber
      }
    })
  }
    const from = "Foodie"
    const to = `91${req.body.mobileNumber}`
    const text = Otp

vonage.message.sendSms(from, to, text, (err, responseData) => {
    // if (err) {
    //     console.log(err);
    // } else {
    //     if(responseData.messages[0]['status'] === "0") {
    //         console.log("Message sent successfully.");
    //         res.status(200).json({ message: 'otp verified successfully', status: 200 });
    //     } else {
    //         console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
    //     }
    // }
})
if(isUserExists){
  res.status(200).json({ message: 'otp verified successfully', status: 200 });
}else{
      res.status(404).json({ message: 'user not found', status: 404 });
  }
});

router.post('/register', async function( req, res, next) {
  const object = {
    mobileNumber:req.body.mobileNumber,
    email:req.body.email,
    isDeleted:false,
      isActive:true,
  }
  const isUserExists = await user.findOne({
    where : {
      isDeleted:false,
      isActive:true,
      mobileNumber:req.body.mobileNumber
    }
  })
  if(isUserExists){
    res.status(422).json({ message: 'user already exists', status: 422 });
  }else{
    const createUser = await user.create(object);
    res.status(200).json({ message: createUser, status: 200 });
  }
});

router.post('/verify_otp', async function(req, res, next) {
  const isUserExists = await user.findOne({
    where : {
      isDeleted:false,
      isActive:true,
      mobileNumber:req.body.mobileNumber,
    }
  })
  if(isUserExists){
    const verifyOtp = await user.findOne({
      where : {
        isDeleted:false,
        isActive:true,
        mobileNumber:req.body.mobileNumber,
        otp_code:req.body.otp_code,
      }
    })
    if(verifyOtp){
      res.status(200).json({ message: 'otp verified successfully', status: 200 });
    }else{
      res.status(422).json({ message: 'please enter valid otp', status: 422 });
    }
  }else{
      res.status(404).json({ message: 'user not found', status: 404 });

  }
});

router.post('/get_food_items', async function(req, res, next) {
  const data1 = await restaurant.findOne({
    where: {mobile_number:req.body.restaurantId}
  })
  const getFoodItems = await fooditem.findAll({
    where:{
      isDeleted:false,
      restaurantId:data1.id
    }
  })
  res.status(200).json({ message: 'food items listed successfully', status: 200 ,data:getFoodItems });
});

router.post('/add_food_items', async function(req, res, next) {
  const data1 = await restaurant.findOne({
    where: {mobile_number:req.body.restaurantId}
  })
  const object = {
    isVeg:req.body.isVeg,
    price:req.body.price,
    isAvailable:req.body.isAvailable,
    itemName:req.body.itemName,
    isDeleted:false,
    restaurantId:data1.id
  }
  const addFoodItems = await fooditem.create(object)
  res.status(200).json({ message: 'food items added successfully', status: 200 ,data:addFoodItems });
});

router.post('/get_a_food_item', async function(req, res, next) {
  const data1 = await fooditem.findOne({
    where: {id:req.body.id}
  })
  res.status(200).json({ message: 'food items viewed successfully', status: 200 ,data:data1 });
});

router.post('/edit_food_items', async function(req, res, next) {
  const addFoodItems = await fooditem.update({
    isVeg:req.body.isVeg,
    price:req.body.price,
    isAvailable:req.body.isAvailable,
    itemName:req.body.itemName,
    isDeleted:false
  },{
    where:{id:req.body.id}
  })
  res.status(200).json({ message: 'food items updated successfully', status: 200 ,data:addFoodItems });
});

router.post('/delete_food_items', async function(req, res, next) {
  await fooditem.update({
    isDeleted:true
  },{
    where:{id:req.body.id}
  })
  res.status(200).json({ message: 'food items deleted successfully', status: 200 });
});

router.post('/register_restaurant', async function( req, res, next) {
  cloudinary.v2.uploader.upload_large(req.body.restaurant_image, {
    chunk_size: 7000000
  },async (error, result) => {
    if(result) {
      const object = {
        mobile_number : req.body.mobileNumber,
          restaurant_name : req.body.restaurant_name,
          restaurant_address : req.body.restaurant_address,
          restaurant_number : req.body.restaurant_number,
          opening_hours : req.body.opening_hours,
          restaurant_owner_name : req.body.restaurant_owner_name,
          restaurant_owner_email : req.body.restaurant_owner_email,
          restaurant_image : result.secure_url,
          isActive : true
      }
      const isUserExists = await restaurant.findOne({
        where : {
          isActive:true,
          mobile_number:req.body.mobileNumber
        }
      })
      if(isUserExists){
        res.status(422).json({ message: 'mobile number already exists', status: 422 });
      }else{
        const createUser = await restaurant.create(object);
        res.status(200).json({ message: createUser, status: 200 });
      }
    }
  });
  
});

router.post('/send_otp_restaurant', async function( req, res, next) {
  const isUserExists = await restaurant.findOne({
    where : {
      isActive:true,
      mobile_number:req.body.mobileNumber
    }
  })
  if(isUserExists){
    const Otp = Math.floor(1000 + Math.random() * 9000);
    console.log(Otp)
    await restaurant.update({
      otp:Otp
    },{
      where : {
        isActive:1,
        mobile_number:req.body.mobileNumber
      }
    })
    const from = "Foodie"
    const to = `91${req.body.mobileNumber}`
    const text = Otp

vonage.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
        console.log(err);
    } else {
        if(responseData.messages[0]['status'] === "0") {
            console.log("Message sent successfully.");
            res.status(200).json({ message: 'otp verified successfully', status: 200 });
        } else {
            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
        }
    }
})
  }else{
      res.status(404).json({ message: 'user not found', status: 404 });

  }

});

router.post('/verify_otp_restaurant', async function(req, res, next) {
  const isUserExists = await restaurant.findOne({
    where : {
      isActive:true,
      mobile_number:req.body.mobileNumber,
    }
  })
  if(isUserExists){
    const verifyOtp = await restaurant.findOne({
      where : {
        isActive:true,
        mobile_number:req.body.mobileNumber,
        otp:req.body.otp_code,
      }
    })
    if(verifyOtp){
      res.status(200).json({ message: 'otp verified successfully', status: 200 });
    }else{
      res.status(422).json({ message: 'please enter valid otp', status: 422 });
    }
  }else{
      res.status(404).json({ message: 'user not found', status: 404 });

  }
});

router.post('/update_restaurant', async function(req, res, next) {
    if(req.body.restaurant_image){
        cloudinary.v2.uploader.upload_large(req.body.restaurant_image, {
          chunk_size: 7000000
        },async (error, result) => {
          if(result) {
            delete req.body.restaurant_image;
            req.body.restaurant_image = result.secure_url 
            await restaurant.update(
              req.body
            ,{
              where:{id:req.body.id}
            })
            res.status(200).json({ message: 'Updated successfully', status: 200 });
          }
        })
      }else{
        await restaurant.update(
          req.body
        ,{
          where:{id:req.body.id}
        })
        res.status(200).json({ message: 'Updated successfully', status: 200 });
      }
});

router.post('/get_restaurant', async function(req, res, next) {
  const data1 = await restaurant.findOne({
    where: {mobile_number:req.body.mobileNumber}
  })
  res.status(200).json({ message: 'food items viewed successfully', status: 200 ,data:data1 });
});

router.get('/get_restaurant_list', async function(req, res, next) {
  const restaurants = await restaurant.findAll({
    where:{
      isActive:true,
    }
  })
  res.status(200).json({ message: 'food items listed successfully', status: 200 ,data:restaurants });
});

router.post('/get_restaurants_order_histories', async function(req, res, next) {
  const restaurantDetail = await restaurant.findOne({
    where:{
      mobile_number:req.body.restaurantId,
    }
  })
  const orders = await order.findAll({
    where:{
      restaurantId:restaurantDetail.id,
    }
  })
  res.status(200).json({ message: 'orders listed successfully', status: 200 ,data:orders });
});

router.post('/get_restaurants_order_histories_detail_view', async function(req, res, next) {
  const order1 = await order.findOne({
    where:{
      id:req.body.id,
      restaurantId:req.body.restaurantId,
      userId:req.body.userId,
    }
  })
  const user1 = await user.findOne({
    where:{
      id:req.body.userId,
    }
  })
  
  res.status(200).json({ message: 'orders listed successfully', status: 200 ,data:{order1,user1} });
});

router.post('/get_menu_items', async function(req, res, next) {
  const menuItems = await fooditem.findAll({
    where:{
      isDeleted:false,
      restaurantId:req.body.id,
      isAvailable:1
    }
  })
  res.status(200).json({ message: 'food items listed successfully', status: 200 ,data:menuItems });
});

router.post('/make_payment', async function(req, res, next) {
  await stripe.paymentIntents.create({
    amount: req.body.totalCost,
    currency: 'inr',
    payment_method: 'pm_card_in',
  });
  const from = "Foodie"
  const to = `91${req.body.mobileNumber}`
  const text = 'Order Placed.!'

vonage.message.sendSms(from, to, text, (err, responseData) => {
  if (err) {
      console.log(err);
  } else {
      if(responseData.messages[0]['status'] === "0") {
          console.log("Message sent successfully.");
      } else {
          console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
      }
  }
})

  const findRestaurant = await restaurant.findOne({
    where : {
      id: +req.body.restaurantId
    }
  }) 
  const findUser = await user.findOne({
    where : {
      mobileNumber: req.body.mobileNumber
    }
  })
 
  const object = {
    userId:findUser.id,
    restaurant_name:findRestaurant.restaurant_name,
    totalCost:req.body.totalCost,
    items:JSON.stringify(req.body.items),
    recentOrderPercentage:'25',
    recentOrder:1
  }

  const object1 = {
    userId:findUser.id,
    restaurantId:+req.body.restaurantId,
    totalCost:req.body.totalCost,
    items:JSON.stringify(req.body.items),
    mobileNumber:findUser.mobileNumber,
    orderedDate:new Date()
  }

  const orders = await order.create(object1)
  const newOrder = await orderhistory.create(object)
  orderhistory.update({
    recentOrder:0
  },{
  where: {
    [Op.and]: [
      { userId:findUser.id },
      {
        id: {
        [Op.notIn]: [newOrder.id],
      }
    }
    ],
  }  
  })
  res.status(200).json({ message: 'Order Placed.!', status: 200  });
});

router.post('/get_my_orders', async function(req, res, next) {
  const findUser = await user.findOne({
    where : {
      mobileNumber: req.body.mobileNumber
    }
  })
  const getOrders = await orderhistory.findAll({
    where : {
      userId : findUser.id
    }
  })
  res.status(200).json({ message: 'Order Placed.!', status: 200, data: getOrders });
});


router.post('/get_recent_order_Status', async function(req, res, next) {
  const findUser = await order.findOne({
    where : {
      mobileNumber: req.body.mobileNumber
    }
  })
  const order1 = await orderhistory.findOne({
    where : {
      userId : findUser.id,
      recentOrder:1
    }
  })
  res.status(200).json({ message: 'Order Status.!', status: 200, data: order1 });
});


var CronJob = require('cron').CronJob;
var job = new CronJob(
    '*/1 * * * *',
	async function() {
    console.log('Cron Job.!')
    let getRecentOrder = await orderhistory.findOne({
      where : {
        recentOrder : 1
      }
    })
    if(getRecentOrder){
      if(Number(getRecentOrder.recentOrderPercentage) < 100){
        const updateVal = {
          recentOrderPercentage : (Number(getRecentOrder.recentOrderPercentage) + 25).toString()
        }
        await orderhistory.update(updateVal
        ,{
         where:{
          id:getRecentOrder.id
         } 
        })
      }
    }
	},
);

job.start()
module.exports = router;
