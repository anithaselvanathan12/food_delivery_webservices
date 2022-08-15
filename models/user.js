module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define(
      'user',
      {
        mobileNumber: DataTypes.STRING,
        otp_code: DataTypes.STRING,
        email: DataTypes.STRING,
        isDeleted: DataTypes.BOOLEAN,
        isActive: DataTypes.BOOLEAN,
      },
      {},
    );
    user.getAll = async (attr) => {
      const user = await user.findAll({
        order: [['id', 'DESC']],
      });
      return user;
    };
    user.createInstance = async (paramData) => {
      const user = await user.create(paramData);
      return user;
    };
    return user;
  };