"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.User.hasMany(models.Comment, {
                foreignKey: "user_id",
                sourceKey: "id",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
            models.User.hasMany(models.Post, {
                foreignKey: "user_id",
                sourceKey: "id",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
            models.User.belongsToMany(models.Post, {
                through: models.Like,
                as: "Likers",
            });
        }
    }
    User.init(
        {
            nickname: DataTypes.STRING,
            password: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "User",
        }
    );
    return User;
};
