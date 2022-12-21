"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
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
            likes: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Post",
        }
    );
    return Post;
};
