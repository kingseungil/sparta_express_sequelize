"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models) {
            models.Post.hasMany(models.Comment, {
                foreignKey: "post_id",
                sourceKey: "id",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
            models.Post.belongsTo(models.User, {
                foreignKey: "user_id",
                targetKey: "id",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
            models.Post.belongsToMany(models.User, {
                through: models.Like,
                as: "Likers",
            });
            models.Post.hasMany(models.Like);
        }
    }
    Post.init(
        {
            title: DataTypes.STRING,
            content: DataTypes.STRING,
            likes: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Post",
        }
    );
    return Post;
};
