const express = require('express');
const db = require('../models');
const sequelize = require("sequelize");
const Op = sequelize.Op;
const router = express.Router();

router.get('/:keyword', async (req, res, next) => {
  try {
    let where = {};
    let keyword = req.params.keyword
    if (parseInt(req.query.lastId, 10)) { //lastId가 있는경우와 없는경우로 나눔
      where = {
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10), //sequelize operator less than이라는 뜻 lastId보다 작은 id를 불러온다
        },
        [Op.or]: [
          {
              title: {
                  [Op.like]: "%" + keyword + "%"
              }
          },
          {
              content: {
                  [Op.like]: "%" + keyword + "%"
              }
          }
      ]
      };
    }else {
      where = {
        [Op.or]: [
            {
                title: {
                    [Op.like]: "%" + keyword + "%"
                }
            },
            {
                content: {
                    [Op.like]: "%" + keyword + "%"
                }
            }
        ]
      };
    }
     
    
    //lastId가 0일경우 조건없이 처음부터 가져오면 됨
    const posts = await db.Post.findAll({
      where,
      include: [ {
        model: db.User,
        attributes: ['id', 'nickname'],
      }],
      order: [['id', 'DESC']],//desc는 내림차순 최신순이라는 뜻
      limit: parseInt(req.query.limit, 10),
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/', async (req, res, next) => {
  try {
    let where = {};
   
    if (parseInt(req.query.lastId, 10)) { //lastId가 있는경우와 없는경우로 나눔
      where = {
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10), //sequelize operator less than이라는 뜻 lastId보다 작은 id를 불러온다
        }
      };
    }
     
    
    //lastId가 0일경우 조건없이 처음부터 가져오면 됨
    const posts = await db.Post.findAll({
      where,
      include: [ {
        model: db.User,
        attributes: ['id', 'nickname'],
      }],
      order: [['id', 'DESC']],//desc는 내림차순 최신순이라는 뜻
      limit: parseInt(req.query.limit, 10),
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
