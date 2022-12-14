const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const dbConfig = require('../config/database');
const conn = dbConfig.init();

dbConfig.connect(conn);

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email', // req.body.email
    passwordField: 'password', // req.body.password
  }, async(email, password, done) => {
      try{
        const sameEmailChkSql = `
          SELECT 
            COUNT(*) AS cnt
          FROM
            member_list
          WHERE
            mb_email = '${email}'
        `;

        const [sameEmailCnt] = await conn.execute(sameEmailChkSql);

        if(!sameEmailCnt[0].cnt){
          return done(null, false, { result: false, msg: '존재하지 않는 사용자입니다.' });
        }
        
        const loginSql = `
          SELECT 
            id,
            mb_email AS email,
            mb_nickname AS nickname
          FROM
            member_list
          WHERE
            mb_email = '${email}' AND
            mb_password = password('${password}') AND
            is_use = '1';
        `;
        
        const [loginInfo] = await conn.execute(loginSql);

        if(!loginInfo[0]){
          return done(null, false, { result: false, msg: '비밀번호가 일치하지않습니다.' });
        }else{
          return done(null, loginInfo[0]);
        }
      }catch(err){
        console.error(err);
        return done(err);
      }
  }));
};