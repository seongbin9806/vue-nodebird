exports.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
    return next();
  }
  return res.json({ return: false, msg: '로그인된 사용자가 아닙니다.'});
};

exports.isNotLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()){
    return next();
  }
  return res.json({ return: false, msg: '이미 로그인 중 입니다.'});
};

/* 
module.exports = {
  isLoggedIn: (req, res, next) => {},
  isNotLoggedIn: (req, res, next) => {},
}
*/