"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.Comment.belongsTo(models.User, {
                foreignKey: "user_id",
                targetKey: "id",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
            models.Comment.belongsTo(models.Post, {
                foreignKey: "post_id",
                targetKey: "id",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
        }
    }
    Comment.init(
        {
            comment: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Comment",
        }
    );
    return Comment;
};
