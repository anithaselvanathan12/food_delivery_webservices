module.exports = (sequelize, DataTypes) => {
    const fooditem = sequelize.define(
      'fooditem',
      {   
        isVeg:DataTypes.BOOLEAN,
        price:DataTypes.STRING,
        isAvailable:DataTypes.BOOLEAN,
        itemName:DataTypes.STRING,
        isDeleted: DataTypes.BOOLEAN,
        restaurantId:DataTypes.INTEGER
      },
      {},
    );
    fooditem.getAll = async (attr) => {
      const fooditem = await fooditem.findAll({
        order: [['id', 'DESC']],
      });
      return fooditem;
    };
    fooditem.createInstance = async (paramData) => {
      const fooditem = await fooditem.create(paramData);
      return fooditem;
    };
    return fooditem;
  };