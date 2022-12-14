const express = require('express');
const router = express.Router();
const passport = require('passport');

const dbConfig = require('../config/database');
const conn = dbConfig.init();

const { isLoggedIn, isNotLoggedIn } = require('./middleware');

dbConfig.connect(conn);

router.get('/', async (req, res, next) => {
  return res.json(req.user);
});

router.post('/', async (req, res, next) => {
  try{
    const data = req.body;

    const sameEmailChkSql = `
      SELECT 
        COUNT(*) AS cnt
      FROM
        member_list
      WHERE
        mb_email = '${data.email}'
    `;

    const [sameEmailCnt] = await conn.execute(sameEmailChkSql);

    if(sameEmailCnt[0].cnt > 0){
      return res.send({ result: false, msg: '이미 사용중인 이메일입니다.' });
    }

    const userInsertSql = `
      INSERT 
        member_list
      SET
        mb_email = '${data.email}',
        mb_password = password('${data.password}'),
        mb_nickname = '${data.nickname}'
    `;

    await conn.execute(userInsertSql);

    await passport.authenticate('local', (err, user, info) => {
      if(err){
        console.log(err);
        return res.json({ result: false, msg: '로그인실패', errorMsg: err });
      }
  
      if(info){
        return res.json(info);
      }
  
      return req.login(user, async(err) => { // 세션에다 사용자 정보저장
        try{
          if(err){
            console.error(err);
            return res.json({ result: false, msg: '자동 로그인실패(Session)', errorMsg: err });
          }
  
          return res.json({ result: true, msg: '회원가입 성공', userInfo : user });
        }catch(err){
          console.error(err);
          return res.json({ result: false, msg: '자동 로그인실패(Session Catch)', errorMsg: err });
        }
      });
    })(req, res, next);
  }catch(err){
    return res.json({result: false, msg: '회원가입 도중 문제가 발생하였습니다.', errorMsg: err});
  }
});

router.post('/login', async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if(err){
      console.log(err);
      return res.json({ result: false, msg: '로그인실패', errorMsg: err });
    }

    if(info){
      return res.json(info);
    }

    return req.login(user, async(err) => { // 세션에다 사용자 정보저장
      try{
        if(err){
          console.error(err);
          return res.json({ result: false, msg: '로그인실패(Session)', errorMsg: err });
        }

        return res.json({ result: true, msg: '로그인성공', userInfo : user });
      }catch(err){
        console.error(err);
        return res.json({ result: false, msg: '로그인실패(Session Catch)', errorMsg: err });
      }
    });
  })(req, res, next);
});

router.post('/logout', (req, res, next) => {

  req.logout();
  req.session.destroy();

  return res.json({result: true, msg: '로그아웃 되었습니다.'});
});

module.exports = router;