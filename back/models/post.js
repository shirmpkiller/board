module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', { // 테이블명은 posts
     title:{
        type:DataTypes.STRING(100),
        allowNull : false
     },
      content: {
        type: DataTypes.TEXT, // 매우 긴 글
        allowNull: false,
      },
    }, {
      charset: 'utf8mb4', //  한글+이모티콘 charset, collate 설정해야함
      collate: 'utf8mb4_general_ci',
      timestamps : true
    });
    Post.associate = (db) => {
      db.Post.hasMany(db.Comment,  { foreignKey:'postId', sourceKey:'id' });
      db.Post.belongsTo(db.User, { foreignKey:'userId', targetKey:'id' }); // 테이블에 UserId 컬럼이 생겨요
    };
    return Post;
  };
  