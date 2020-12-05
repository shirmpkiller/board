const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

try {
  fs.accessSync('uploads');
} catch (error) {
  console.log('uploads 폴더가 없으므로 생성합니다.');
  fs.mkdirSync('uploads');
}

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

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => { // POST /post
  try {//upload.none()은 이미지를 하나도 안올렸을 경우
    const newPost = await db.Post.create({
      title : req.body.postTitle,
      content : req.body.postContent, 
      anonymity : req.body.anonymity,
      UserId: req.user.id,
    });
    if (req.body.image) {
      if (Array.isArray(req.body.image)) { // 이미지를 여러 개 올리면 image: [제로초.png, 부기초.png]
        const images = await Promise.all(req.body.image.map((image) => db.Image.create({ src: image })));
        await newPost.addImages(images);
      } else { // 이미지를 하나만 올리면 image: 제로초.png
        const image = await db.Image.create({ src: req.body.image });
        await newPost.addImages(image);
      }}
    const fullPost = await db.Post.findOne({
      where: { id: newPost.id },
      include: [{
        model: db.Image,
      }, {
        model: db.Comment,
        include: [{
          model: db.User, // 댓글 작성자
          attributes: ['id', 'nickname'],
        }],
      } , {
        model: db.User,
        attributes: ['id', 'nickname'],
        }],
    });
    res.status(201).json(fullPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => { // POST /post/images
  console.log(req.files);
  res.json(req.files.map((v) => v.filename));
});

router.get('/:id', async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id },
      include: [{
        model: db.Image, 
      }, { //게시글 작성자랑 이미지 불러오기
        model: db.User, 
        attributes: ['id', 'nickname']
      },{
        model:db.Comment,
        attributes:['id','content','createdAt','userId','postId'],
        include: [{ //게시글 작성자랑 이미지 불러오기
          model: db.User, 
          attributes: ['id', 'nickname']
        }]
      }, {
        model: db.User, // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id'],
      }],
    });
    res.json(post);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete('/:id', isLoggedIn, async (req, res, next) => {
  try { //에러 처리 안하면 서버 죽을 수 도 있음
    const post = await db.Post.findOne({ where: { id: req.params.id } });//기본적으로 req.params.id에 parseInt안해줘도 됨
    if (!post) {//게시글이 있는지 검사
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    await db.Post.destroy({ where: { id: req.params.id } }); //지우는 건 destroy
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete('/comment/:id', isLoggedIn, async (req, res, next) => {
  try { //에러 처리 안하면 서버 죽을 수 도 있음
    const comment = await db.Comment.findOne({ where: { id: req.params.id } });//기본적으로 req.params.id에 parseInt안해줘도 됨
    if (!comment) {//게시글이 있는지 검사
      return res.status(404).send('해당 댓글이 존재하지 않습니다.');
    }
    await db.Comment.destroy({ where: { id: req.params.id } }); //지우는 건 destroy
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.post('/:id/comment', isLoggedIn, async (req, res, next) => { // POST /api/post/1000000/comment
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    console.log(post.id)
    const newComment = await db.Comment.create({
      PostId: post.id,
      UserId: req.user.id,
      content: req.body.content,
    });
    await post.addComment(newComment.id);//시퀄라이즈에서 add시리즈를 자동으로 추가해주기 때문에 가능
    const comment = await db.Comment.findOne({
      where: {
        id: newComment.id,
      },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }],
    });
    return res.json(comment);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});
router.patch('/:postId/like', isLoggedIn, async (req, res, next) => { // PATCH /post/1/like
  try {
    const post = await db.Post.findOne({ where: { id: req.params.postId }});
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId/like', isLoggedIn, async (req, res, next) => { // DELETE /post/1/like
  try {
    const post = await db.Post.findOne({ where: { id: req.params.postId }});
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
module.exports = router;
