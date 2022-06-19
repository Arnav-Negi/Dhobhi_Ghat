const JSONdb = require('simple-json-db');
const db = new JSONdb('./storage.json');
const dbslot = new JSONdb('./slot.json');
const nodemailer = require('nodemailer');
var LocalStrategy = require('passport-local');
var passport = require('passport');
var session = require('express-session');
const { ensureAuthenticated } = require('connect-ensure-authenticated');
cookieParser = require('cookie-parser'),

passport.use(new LocalStrategy(
    function(username, password, done) {
    const givenUsername=username;
    const givenPassword=password;
    const actualPassword=db.get(givenUsername);
    const user={username:username,password:password};
    if(givenPassword==actualPassword)
    {
        return done(null, user);   
    }
    else
    {
        return done(null,false);
    }
  }
));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const express = require("express");
const app = express();
app.set('trust proxy', 1) // trust first proxy

app.use(express.urlencoded({ extended: true}));
app.use(session({ secret: 'olhosvermelhoseasenhaclassica',resave: false, saveUninitialized: true,
})); //session secret
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

db.set('hello', 'zaid');
db.set('hi','lol');
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/login.html');
});

app.get('/slots',(req,res)=>
{
  console.log(req.sessionID);
  res.sendFile(__dirname+ '/static/timing.html');
});

app.get('/show',(req,res)=>
{
  console.log(req.sessionID);
  res.sendFile(__dirname+ '/Slot_booking/index.html');
});

app.get('/static/style.css',(req,res)=>
{
 // console.log(req.sessionID);
  res.sendFile(__dirname+ '/static/style.css');
});
app.get('/Slot_booking/css/bootstrap.min.css',(req,res)=>
{
 // console.log(req.sessionID);
  res.sendFile(__dirname+ '/Slot_booking/css/bootstrap.min.css');
});
app.get('/Slot_booking/css/style.css',(req,res)=>
{
 // console.log(req.sessionID);
  res.sendFile(__dirname+ '/Slot_booking/css/style.css');
});

app.get('/Slot_booking/img/background.jpg',(req,res)=>
{
 // console.log(req.sessionID);
  res.sendFile(__dirname+ '/Slot_booking/img/background.jpg');
});
app.get('/Slot_booking/img/site-back.jpg',(req,res)=>
{
 // console.log(req.sessionID);
  res.sendFile(__dirname+ '/Slot_booking/img/site-back.jpg');
});


app.post('/book',(req,res)=>
{
  console.log(req.body.username);
  console.log(req.body.password);
  console.log(req);
  const givenUsername=req.body.username;
  const givenPassword=req.body.password;
  const actualPassword=db.get(givenUsername);
  if(givenPassword==actualPassword)
  {
    var firstKey = req.body.myTime;
    console.log(firstKey);
    dbslot.set(firstKey,givenUsername);
    res.send("booked");
  }
  else
  {
    res.send("not booked");
  }
});
app.get('/lmao',function(req,res){
  var data = dbslot.JSON();
  console.log(data);
  let rest="";
  for (var key in data){
    if(data[key]=="-1")
    rest+="0";
    else
    rest+="1";
  }
  res.send(rest);
});

app.get('/api/me',
  passport.authenticate('token', { session: false }),
  function(req, res) {
    res.json(req.user);
});

app.post("/check",passport.authenticate('local', { failureRedirect: '/', failureMessage: true }),
function (req, res) {
  console.log(req.user);
  console.log(req.user.username);
  console.log(req.user.password);
  console.log(req.sessionID);
});

app.post("/register",function (req, res){
  const givenUsername=req.body.username;
  const givenPassword=req.body.password;
  //const actualPassword=db.get(givenUsername);
  console.log(givenUsername);
  console.log(givenPassword);
  db.set(givenUsername,givenPassword);
  res.sendFile(__dirname + '/static/login.html');
});

app.listen(3000, function () {
    console.log("Server is running on localhost:3000");
});

