module.exports = (sequelize, DataTypes) => { //강의에서 그냥 패턴처럼 만들어서 따라하라함
    const Comment = sequelize.define('Comment', {
      content: {
        type: DataTypes.TEXT, // 긴 글
        allowNull: false,// 필수
      },
    }, {
      timestamps: false,
      charset: 'utf8mb4', //charset, collate 이렇게 적어야 한글 저장
      collate: 'utf8mb4_general_ci',
    });
    Comment.associate = (db) => {
      db.Comment.belongsTo(db.User, { foreignKey:'userId', targetKey:'id' });
      db.Comment.belongsTo(db.Post, { foreignKey:'postId', targetKey:'id' });
    };
    return Comment;
  };
  