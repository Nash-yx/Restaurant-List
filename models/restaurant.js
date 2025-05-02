'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Restaurant.belongsTo(models.User);
    }
  }
  Restaurant.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name_en: DataTypes.STRING,
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: DataTypes.STRING,
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      google_map: DataTypes.TEXT,
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Restaurant',
    }
  );
  return Restaurant;
};
