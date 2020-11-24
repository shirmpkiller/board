const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET /api/posts
  try {
    let where = {};
    if (parseInt(req.query.lastId, 10)) {//lastId가 있는 경우 lastId가 0이면 처음부터 가져오는 것
      where = {
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10), // Op는 operator, operator less than//id가 뭐보다 작다를 시퀄라이즈로 표현
        },//자세한 것 sequelize operator 찾아보면 있음
      };
    }
    const posts = await db.Post.findAll({
      where,
      include: [{
       model: db.Image,
      },{
        model: db.User,
        attributes: ['id', 'nickname'],
      }],
      order: [['createdAt', 'DESC']], // DESC는 내림차순, ASC는 오름차순
      limit: parseInt(req.query.limit, 10),//?offset 대신 한거?//limit과 order은 미리있는 옵션
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
