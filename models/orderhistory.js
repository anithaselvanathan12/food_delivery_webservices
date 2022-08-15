module.exports = (sequelize, DataTypes) => {
    const orderhistory = sequelize.define(
      'orderhistory',
      {   
        userId:DataTypes.INTEGER,
        totalCost:DataTypes.STRING,
        items:DataTypes.TEXT,
        restaurant_name: DataTypes.STRING,
        recentOrder:DataTypes.BOOLEAN,
        recentOrderPercentage:DataTypes.STRING
      },
      {},
    );
    orderhistory.getAll = async (attr) => {
      const orderhistory = await orderhistory.findAll({
        order: [['id', 'DESC']],
      });
      return orderhistory;
    };
    orderhistory.createInstance = async (paramData) => {
      const orderhistory = await orderhistory.create(paramData);
      return orderhistory;
    };
    return orderhistory;
  };