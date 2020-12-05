const express = require('express');
const { Op } = require('sequelize');
const db = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET /api/posts
  try {
    let where = {};
    if (parseInt(req.query.lastId, 10)) {//lastId가 있는 경우 lastId가 0이면 처음부터 가져오는 것
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10)};
    }
    const posts = await db.Post.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [db.Comment, 'createdAt', 'DESC'],
      ],
      include: [{
        model: db.Comment
      } , {
       model: db.Image,
      },{
        model: db.User,
        attributes: ['id', 'nickname'],
      }, {
        model: db.User, // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id'],
      }],
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.get('/hot', async (req, res, next) => { // GET /api/posts
  try {
    let where = {};
    if (parseInt(req.query.lastId, 10)) {//lastId가 있는 경우 lastId가 0이면 처음부터 가져오는 것
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10)};
    }
    const posts = await db.Post.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [db.Comment, 'createdAt', 'DESC'],
      ],
      include: [{
        model: db.Comment
      } , {
       model: db.Image,
      },{
        model: db.User,
        attributes: ['id', 'nickname'],
      }, {
        model: db.User, // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id'],
      }],
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
