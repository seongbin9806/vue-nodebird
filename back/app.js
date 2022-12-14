/* init setup */
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

app.use('/', express.static('uploads')); // 이미지 폴더 접근 허용
app.use(morgan('dev')); // 서버요청 자동 로그
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* db */
const dbConfig = require('./config/database');
const conn = dbConfig.init();

dbConfig.connect(conn);

/* passport/cookie */
const passport = require('passport');
const passportConfig = require('./passport');
const session = require('express-session');
const cookie = require('cookie-parser');

passportConfig();
app.use(cookie('cookiesecret'));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'cookiesecret',
  cookie: {
    httpOnly: true,
    secure: false
  }
}));

app.use(passport.initialize());
app.use(passport.session());

/* router */
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');

app.use('/user', userRouter); /* 회원관련 router */
app.use('/post', postRouter); /* 게시글관련 router */
app.use('/posts', postsRouter); /* 게시글들 router */


app.get('/', (req, res) => {
  res.send('여기는 어쩐 일이신지요?! ><');
});

app.listen(8081, () => {
  console.log(`백엔드 서버 ${8081}번 포트에서 작동중`);
})