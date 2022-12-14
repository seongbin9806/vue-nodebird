const express = require('express');
const dbConfig = require('../config/database');
const { isLoggedIn } = require('./middleware');

const router = express.Router();
const conn = dbConfig.init();
dbConfig.connect(conn);

/* image */
const multer = require('multer');
const path = require('path');

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done){ // 어디 저장할지
      done(null, 'uploads');
    },
    filename(req, file, done){
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8'); //한글로

      const ext = path.extname(file.originalname); // 확장자 가져오기
      const basename = path.basename(file.originalname, ext); // 파일 이름만 가져오기
      done(null, basename + Date.now() + ext);
    }
  }),
  limit: { fileSize: 20 * 1024 * 1024 }
});

router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => {
  console.log(req.files);
  return res.json({
    result: true,
    msg: '이미지업로드 성공',
    files: req.files.map(v => v.filename)
  });
});

router.post('/', isLoggedIn, async(req, res, next) => {
  try{
    const data = req.body;

    const postInsertSql = `
      INSERT 
        post_list
      SET
        mb_email = '${req.user.email}',
        content = '${data.content}'
    `;

    const [insertRes] = await conn.execute(postInsertSql);
    const postId = insertRes.insertId;

    /* 해시태그 */
    const hashtags = data.content.match(/#[^\s#]+/g);

    if(hashtags){
      
      await Promise.all(hashtags.map(async tag => {
        tag = tag.slice(1).toLowerCase();

        const tagInsertSql = `
          INSERT 
            hashtag_list
          SET
            post_id = '${postId}',
            name = '${tag}'
        `;

        await conn.execute(tagInsertSql);
      }));
    }

    /* 이미지 */
    const imageFormatArr = [];

    if(data.imagePaths){
      await Promise.all(data.imagePaths.map(async (imagePath) => {

        const imageInsertSql = `
          INSERT 
            image_list
          SET
            post_id = '${postId}',
            src = '${imagePath}'
        `;
        
        await conn.execute(imageInsertSql);

        imageFormatArr.push({
          'src' : imagePath
        });
      }));
    }

    /* 유저 정보 */
    const postInfo = {
      id : postId,
      nickname : req.user.nickname,
      content : data.content,
      Comments : [],
      Images: imageFormatArr,
      is_like: '0'
    };

    return res.json({result: true, msg: '게시글이 등록되었습니다.', postInfo: postInfo});
  }catch(err){
    console.log(err);
    return res.json({result: false, msg: '게시글 등록에 실패하였습니다.'});
  }
});

router.get('/:postId/getComments', async(req, res, next) => {
  try{
    const postId = req.params.postId;
    const getCommentsSql = `
      SELECT
        *
      FROM
        comment_list
      WHERE
        post_id = '${postId}' AND
        is_use = '1'
      ORDER BY
        id DESC;
    `;

    const [comments] = await conn.execute(getCommentsSql);

    return res.json(comments);
  }catch(err){
    console.error(err);
  }
});
 
router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  try{
    const postId = req.params.postId;
    const data = req.body;

    const postInsertSql = `
      INSERT 
        comment_list
      SET
        post_id = '${postId}',
        mb_email = '${req.user.email}',
        content = '${data.content}'
    `;

    const [insertRes] = await conn.execute(postInsertSql);

    const commentId = insertRes.insertId;
    const commentInfo = {
      id: commentId,
      postId: parseInt(postId),
      content: data.content,
      nickname: req.user.nickname
    };

    return res.json({result : true, msg : '댓글등록 성공', commentInfo : commentInfo});
  }catch(err){
    console.error(err);
    return res.json({result : false, msg : '댓글등록에 실패하였습니다.'});
  }
});

router.post('/remove', isLoggedIn, async (req, res, next) => {
  try{
    const data = req.body;

    const postRemoveSql = `
      UPDATE
        post_list
      SET
        is_use = '0'
      WHERE
        id = '${data.postId}';
    `;

    await conn.execute(postRemoveSql);

    return res.json({result : true, msg : '게시글 삭제 성공'});
  }catch(err){
    console.error(err);
    return res.json({result : false, msg : '게시글 삭제에 실패하였습니다.'});
  }
});

router.post('/like', isLoggedIn, async(req, res, next) => {
  try{
    const data = req.body;
    const getLikeLogSql = `
      SELECT
        COUNT(*) count
      FROM
        like_list
      WHERE
        post_id = '${data.postId}' AND
        mb_email = '${req.user.email}'
    `;

    const [isLikeLog] = await conn.execute(getLikeLogSql);

    if(!isLikeLog[0].count){
      const addLikeLogSql = `
        INSERT INTO
          like_list
        SET
          post_id = '${data.postId}',
          mb_email = '${req.user.email}'
      `;

      await conn.execute(addLikeLogSql);
    }else{
      const updateLikeLogSql = `
        UPDATE
          like_list
        SET
          is_use = '${data.is_like}'
        WHERE
          post_id = '${data.postId}' AND
          mb_email = '${req.user.email}'
      `;

      await conn.execute(updateLikeLogSql);
    }

    return res.json({result: true, msg: '좋아요 이벤트 성공'});
  }catch(err){
    console.error(err);
    return res.json({result : false, msg : '좋아요 이벤트 실패'});
  }
});

module.exports = router;