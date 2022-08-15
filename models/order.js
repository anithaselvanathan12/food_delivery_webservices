module.exports = (sequelize, DataTypes) => {
    const order = sequelize.define(
      'order',
      {   
        userId:DataTypes.INTEGER,
        totalCost:DataTypes.TEXT,
        items:DataTypes.TEXT,
        restaurantId: DataTypes.INTEGER,
        orderedDate:DataTypes.DATE,
        mobileNumber:DataTypes.STRING,
      },
      {},
    );
    order.getAll = async (attr) => {
      const order = await order.findAll({
        order: [['id', 'DESC']],
      });
      return order;
    };
    order.createInstance = async (paramData) => {
      const order = await order.create(paramData);
      return order;
    };
    return order;
  };