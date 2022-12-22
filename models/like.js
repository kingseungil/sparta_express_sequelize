"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Like extends Model {
        static associate(models) {
            models.Like.belongsTo(models.Post, { foreignKey: "post_id" });
            models.Like.belongsTo(models.User, { foreignKey: "user_id" });
        }
    }
    Like.init(
        {
            post_id: DataTypes.INTEGER,
            user_id: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Like",
        }
    );
    return Like;
};
