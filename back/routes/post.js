const express = require('express');
const multer = require('multer');
const path = require('path');

const db = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();
const upload = multer({
  storage: multer.diskStorage({//컴퓨터의 디스크에 저장한다는 뜻인데 나중에 클라우드로 바뀜
    destination(req, file, done) {//destination은 어떤 폴더 경로에 저장할지 //done은 콜백함수
      done(null, 'uploads');// null은 서버에러 uploads는 성공했을 때
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);//path모듈로 확장자 추출
      const basename = path.basename(file.originalname, ext); // 제로초.png, ext===.png, basename===제로초
      done(null, basename + new Date().valueOf() + ext);//이름 겹칠경우 시간정보를 끼워 넣는다
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, //limit라는 옵션으로 filesize를 20메가바이트로 제한했음
});

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => { // POST /api/post
console.log(req.body.postTitle)
console.log(req.body.postContent)
  try {//upload.none()은 이미지를 하나도 안올렸을 경우
    const newPost = await db.Post.create({
      title : req.body.postTitle,
      content : req.body.postContent, //ex) '제로초 파이팅 #구독 #좋아요 눌러주세요'
      userId: req.user.id,
    });

    const fullPost = await db.Post.findOne({
      where: { id: newPost.id },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
        }],
    });
    res.json(fullPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
