"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Like extends Model {
        static associate(models) {
            models.Like.belongsTo(models.Post);
        }
    }
    Like.init(
        {
            test: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Like",
        }
    );
    return Like;
};
