const express = require('express');
const dbConfig = require('../config/database');
const { isLoggedIn } = require('./middleware');

const router = express.Router();
const conn = dbConfig.init();
dbConfig.connect(conn);

router.get('/', async(req, res, next) => {
  try{
    const data = req.query;
    const offSet = (parseInt(data.page) - 1) * parseInt(data.limit);

    const getPostsSql = `
      SELECT
        P.id,
        P.content,
        M.mb_nickname AS nickname,
        IFNULL(L.is_use, '0') AS is_like
      FROM
        post_list AS P JOIN
        member_list AS M ON M.mb_email = P.mb_email AND M.is_use = '1' LEFT JOIN
        like_list AS L ON P.id = L.post_id
      WHERE
        P.is_use = '1'
      ORDER BY
        P.id DESC
      LIMIT
        ${offSet}, ${data.limit};
    `;

    const [posts] = await conn.execute(getPostsSql);
    
    await Promise.all(posts.map(async(val, index) => {
      const postId = val.id;
      
      //comments
      const getCommentsSql = `
        SELECT
          C.id,
          C.post_id AS postId,
          C.content,
          M.mb_nickname AS nickname
        FROM
          comment_list AS C JOIN
          member_list AS M ON M.mb_email = C.mb_email AND M.is_use = '1'
        WHERE
          C.post_id = '${postId}' AND
          C.is_use = '1';
      `;
      
      const [Comments] = await conn.execute(getCommentsSql);
      posts[index].Comments = Comments;
      
      //images
      const getImagesSql = `
        SELECT
          id,
          src
        FROM
          image_list
        WHERE
          post_id = '${postId}';
      `;

      const [Images] = await conn.execute(getImagesSql);
      posts[index].Images = Images;
    }));

    return res.json({result: true, msg: '게시글 조회 성공', posts : posts });
  }catch(err){
    console.log(err);
    return res.json({result: false, msg: '게시글 조회에 실패하였습니다.'});
  }
});


module.exports = router;