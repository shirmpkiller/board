
  const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Post extends Model {
  static init(sequelize) {
    return super.init({
      // id가 기본적으로 들어있다.
      title:{
        type:DataTypes.STRING(100),
        allowNull : false
     },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // RetweetId
    }, {
      modelName: 'Post',
      tableName: 'posts',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', // 이모티콘 저장
      sequelize,
    });
  }
  static associate(db) {
    db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser
    db.Post.hasMany(db.Comment); // post.addComments, post.getComments
  }
};
