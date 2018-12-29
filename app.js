var express = require('express');
var app = express();
var path = require('path');
const { Client } = require('pg');
// const bootstrap = require('bootstrap');
const exphbs = require('express-handlebars');
var bodyParser = require('body-parser');

const firebase = require('firebase');
//const firebase = require('firebase-storage');

var nodemailer = require('nodemailer');
var flash = require('flash');
var passport = require('passport');
var request = require('request');
var session = require('express-session');
//

// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

app.engine('handlebars',exphbs ({defaultlayout:'main'}));
app.set('view engine','handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static('public'));
const client = new Client({
  database: 'd1i985t7kj75kt',
  user: 'oaevfyyxzrcqth',
  password: 'bde32e3f8e8449b3986d959632429283ff4118b3f622d82afa20ce00998e831a',
  host: 'ec2-54-243-61-194.compute-1.amazonaws.com',
  port: 5432,
  ssl: true

});

// connect to database
client.connect()
  .then(function () {
    console.log('connected to database!');
  })
  .catch(function () {
    console.log('cannot connect to database!');
  });

 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCubNahS4iwVb4UuE6IiuxGEA0myfdde8E",
    authDomain: "iao-fra.firebaseapp.com",
    databaseURL: "https://iao-fra.firebaseio.com",
    projectId: "iao-fra",
    storageBucket: "iao-fra.appspot.com",
    messagingSenderId: "954236925014"
  };
  firebase.initializeApp(config);


 // var storage = firebase.storage();

const Admin = require('./models/admin');

// Authentication
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var session = require('express-session');


// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(session({
  secret: 'INTERNALAUDITOFFICE',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Authentication and Session--------------------------------------------
passport.use(new Strategy({
  usernameField: 'email',
  passwordField: 'password',
  roleField: 'role'
},
  function(email, password, cb) {
   Admin.getByEmail(client, email, function(user) {
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
}));

passport.serializeUser(function(user, cb) {
  console.log('serializeUser', user)
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
 Admin.getById(client, id, function (user) {
    console.log('deserializeUser', user)
    cb(null, user);
  });
});

// function isAdmin(req, res, next) {
//   if (req.isAuthenticated()) {
//    Admin.getAdminData(client, {id: req.user.id}, function(user){
//     console.log(req.user);
//     role = user[0].user_type;
//     // req.session.user = user.user_type;
//     // console.log(req.session.user)
//     console.log('role:', role);
//     if (role == 'admin') {
//         return next();
//     }
//     else{
//       res.redirect('/');
//     }
//   });
//   }
//   else{
//     console.log('error', req.user);
//     res.redirect('/login');
//   }
// }



app.get('/adminlogin', function (req, res) {
  // res.render('adminlogin');
     res.sendFile(path.join(__dirname + '/views/login.html'));
    });


app.get('/main', function (req, res) {
  // res.render('adminlogin');
     res.sendFile(path.join(__dirname + '/views/mainview.html'));
    });


app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/adminlogin' }),
  function(req, res) {
        if(req.user.role == 'admin')
        {
          res.redirect('/adminpass');
        }
        else
        {
          res.redirect('/');
        }
        
  });



app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


//upload request
app.post('/send_request', function (req, res) {

console.log(req.body);
  //console.log(url);

var receivers = ['team2.dbms1819@gmail.com', req.body.email];

  let mailOptions, transporter;
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'team2.dbms1819@gmail.com',
      pass: 'database1819'
    }
  });
  console.log(req.body);

  mailOptions = {
    // from: req.body.FN+'  &lt; '+ req.body.LN +'   &lt;' + req.body.email +' &gt;', // sender address
    from: 'team2.dbms1819@gmail.com', // list of receivers
    to: receivers,
    subject: 'REQUEST DETAILS', // Subject line
    text: 'Request Details: \n Name:' + req.body.requestor_name + '\n Email:' + req.body.email + '\n Tracking Number:' + req.body.tracking_number + '\n Event Name:' + req.body.event_name + '\n Event Start Date:' + req.body.start_date + '\n Event End Date:' + req.body.end_date + '\n Status: Incomplete' 

  };

  console.log(mailOptions);

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, response) {
    if (error) {
      res.redirect('/fail');
    }
    
 var values = [];
  values = [req.body.tracking_number, req.body.requestor_name, req.body.email, req.body.phone, req.body.designation, req.body.campus, req.body.sector, req.body.event_name, req.body.event_start_date, req.body.event_end_date, req.body.notes, req.body.url, 'incomplete'];
  console.log(req.body);
  console.log(values);

  client.query('INSERT INTO requests1 (tracking_number,requestor,email, phone, designation, branch, sector, event_name, event_start, event_end, notes, url, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) ',values,(err,res)=>{
    if (err){
      console.log(err.stack);
    }
    else{
      console.log('successfully added');

    }
  });
  res.redirect('/');
  });
 });



// app.post('/login',
//   passport.authenticate('local'),
//   function(req, res) {


//     res.redirect('/users/' + req.user.username);
//   });


app.get('/adminpass', function (req, res) {
   if(req.isAuthenticated()){
  client.query('SELECT id, tracking_number,requestor,event_name,event_start,notes,request_date,status, url FROM requests1 ORDER BY id DESC', (req, data) => {
   var list = [];
    for (var i = 1; i < data.rows.length + 1; i++) {
      list.push(data.rows[i - 1]);
    }
    res.render('admin', {
      requests1: list
    });
  });
}

else{
    res.redirect('/adminlogin');
  }
});

var id1; 

app.get('/requests/:idNew', function (req, res) {
  const idNew = req.params.idNew;
  var list1 = [];
  var list = [];
  if(req.isAuthenticated()){
    client.query('SELECT * FROM requests1 where id ='+ idNew + '', (req, data2) => {
    for (var i = 0; i < data2.rowCount; i++) {
      list1[i] = data2.rows[i];
    } list = list1;
    id1 = idNew;
    res.render('admin-update', {
      title: 'INTERNAL AUDIT OFFICE',
      requests1: list[0]
    });
  });
}
else{
    res.redirect('/adminlogin');
  }
});

//admin update status
app.post('/update_status', function (req, res) {

var receivers = ['team2.dbms1819@gmail.com', req.body.email];

  let mailOptions, transporter;
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'team2.dbms1819@gmail.com',
      pass: 'database1819'
    }
  });
  console.log(req.body);

  mailOptions = {
    // from: req.body.FN+'  &lt; '+ req.body.LN +'   &lt;' + req.body.email +' &gt;', // sender address
    from: 'team2.dbms1819@gmail.com', // list of receivers
    to: receivers,
    subject: 'REQUEST STATUS CHANGED', // Subject line
    text: 'Good day! \n We would like to inform you that the status of your request with the tracking Number of ' + req.body.tracking_number + ' has been changed. \n \n \n Internal Audit Office' 

  };

  console.log(mailOptions);

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, response) {
    if (error) {
      res.redirect('/fail');
    }

  client.query("UPDATE requests1 SET status = 'complete' , update_date = NOW() WHERE id = "+ id1 + "", (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log('success!');
    }
  });
    res.redirect('/admin');
});

});


app.get('/', function(req, res) {
 client.query('SELECT * FROM branch', (req, data) => {
    var list = [];
    for (var i = 1; i < data.rows.length + 1; i++) {
      list.push(data.rows[i - 1]);
    }

 client.query('SELECT * FROM sector', (req, data2) => {
    var list1 = [];
    for (var i1 = 1; i1 < data2.rows.length + 1; i1++) {
      list1.push(data2.rows[i1 - 1]);
    }

    client.query('SELECT * FROM designation', (req, data3) => {
    var list2 = [];
    for (var i2 = 1; i2 < data3.rows.length + 1; i2++) {
      list2.push(data3.rows[i2 - 1]);
    }
    // res.sendFile(path.join(__dirname + '/trialv1.html'));
     res.render('mainview', {
branch: list,
sector: list1,
designation : list2
   }); 
  });
});
});
});

//update request
app.post('/update_request', function(req, res) {
client.query("UPDATE requests1 SET event_name = '"+ req.body.event_name +"', event_start = '"+ req.body.start_date +"', event_end = '"+ req.body.end_date +"', notes = '"+ req.body.notes +"', url = '"+ req.body.url1 +"' WHERE tracking_number = '"+ req.body.tracking_number +"' ", (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log('success!');
    }
});
    res.redirect('/');
});


//inquiry
app.post('/inquiry', function (req, res) {
 var values = [];
  values = [req.body.email, req.body.name, req.body.campus, req.body.sector,req.body.notes, 'NOW()'];
  console.log(req.body);
  console.log(values);

  client.query('INSERT INTO inquiry (email, name, branch, sector, notes, inquiry_date) VALUES ($1,$2,$3,$4,$5,$6) ',values,(err,res)=>{
    if (err){
      console.log(err.stack)
    }
    else{
      console.log('successfully added');

    }
  });
  res.redirect('/');
  });

app.get('/multiple', function (req, res) {
  res.render('multiple',{

  });
  // body...
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Server started at port 3000');
});

