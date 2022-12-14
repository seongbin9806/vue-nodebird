const passport = require('passport');
const local = require('./local');
const dbConfig = require('../config/database');
const conn = dbConfig.init();

dbConfig.connect(conn);

module.exports = () => {
  passport.serializeUser( (user, done) => {
    return done(null, user.email);
  });

  passport.deserializeUser(async (email, done) => {
    const userSql = `
        SELECT 
          id,
          mb_email AS email,
          mb_nickname AS nickname
        FROM
          member_list
        WHERE
          mb_email = '${email}'
      `;
      
    const [loginInfo] = await conn.execute(userSql);

    if(!loginInfo[0]){
      return done(null, { result: false, msg: '사용자 정보를 찾을 수 없습니다.' });
    }else{
      return done(null, loginInfo[0]);
    }
  });
  local();
};