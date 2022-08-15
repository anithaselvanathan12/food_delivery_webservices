module.exports = (sequelize, DataTypes) => {
    const restaurant = sequelize.define(
      'restaurant',
      {   
        mobile_number:DataTypes.STRING,
        restaurant_name:DataTypes.STRING,
        restaurant_address:DataTypes.TEXT,
        restaurant_number:DataTypes.STRING,
        opening_hours: DataTypes.STRING,
        restaurant_owner_name: DataTypes.STRING,
        restaurant_owner_email: DataTypes.STRING,
        restaurant_image:DataTypes.TEXT,
        otp: DataTypes.STRING,
        isActive: DataTypes.BOOLEAN,
      },
      {},
    );
    restaurant.getAll = async (attr) => {
      const restaurant = await restaurant.findAll({
        order: [['id', 'DESC']],
      });
      return restaurant;
    };
    restaurant.createInstance = async (paramData) => {
      const restaurant = await restaurant.create(paramData);
      return restaurant;
    };
    return restaurant;
  };