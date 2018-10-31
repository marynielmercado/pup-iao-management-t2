

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


// app.get('/home', function (req, res) {
//   res.render('send', {
//     title: 'INTERNAL AUDIT OFFICE'
//   });
//  });
// var admin = require('firebase-admin');
// var serviceAccount = require('./serviceAccountKey.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://iao-fra.firebaseio.com"
// });

// const firebase = require('firebase-storage');

// const storage = admin.storage();

//   // Initialize Firebase
//   var config = {
//     apiKey: "AIzaSyCubNahS4iwVb4UuE6IiuxGEA0myfdde8E",
//     authDomain: "iao-fra.firebaseapp.com",
//     databaseURL: "https://iao-fra.firebaseio.com",
//     projectId: "iao-fra",
//     storageBucket: "iao-fra.appspot.com",
//     messagingSenderId: "954236925014"
//   };

//   firebase.initializeApp(config);
// const storageRef = storage.ref();
// const fileRef = storageRef.child('test1');


// // const submitButton = document.getElementById('submitButton');
// submitButton.addEventListener('change', (e)=>{
//   let file = e.target.files[0];
//   let locationRef = storage.ref('testv6/' + file.name)
//   let task = locationRef.put(file)
//   task.on('state_changed', 
//     function progress(snapshot){ //progress
//       let per = (snapshot.bytesTransferred / snapshot.totalBytes) *100;
//       uploader.value = per;
//     },
//     function complete_push(){
//        storageRef.getMetadata().then(metadata=>{
//          ref.push({
//           url: metadata.downloadURLs[0]
//         })
//     })

//   }
// )
// })


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





app.post('/send', function (req, res) {
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
    text: 'Request Details: \n Name:' + req.body.requestor_name + '\n Email:' + req.body.email + '\n Tracking Number:' + req.body.tracking_number + '\n Event Name:' + req.body.event_name + '\n Event Start Date:' + req.body.event_start_date + '\n Event End Date:' + req.body.event_end_date + '\n Status: Incomplete' 

  };

  console.log(mailOptions);

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, response) {
    if (error) {
      res.redirect('/fail');
    }


 var values = [];
  values = [req.body.tracking_number, req.body.requestor_name, req.body.email, req.body.phone, req.body.designation, req.body.campus, req.body.sector, req.body.event_name, req.body.event_start_date, req.body.event_end_date, req.body.notes,'incomplete'];
  console.log(req.body);
  console.log(values);

  client.query("INSERT INTO requests1 (tracking_number,requestor,email, phone, designation, branch, sector, event_name, event_start, event_end, notes,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)",values,(err,res)=>{
    if (err){
      console.log(err.stack)
    }
    else{
      console.log('successfully added');

    }
  });
  res.redirect('/');
  });
 });


app.get('/admin', function (req, res) {
   
  client.query('SELECT id, tracking_number,requestor,event_name,event_start,notes,request_date,status FROM requests1 ORDER BY id DESC', (req, data) => {
   var list = [];
    for (var i = 1; i < data.rows.length + 1; i++) {
      list.push(data.rows[i - 1]);
    }
    res.render('admin', {
      requests1: list
    });
  });
});

var id1; 

app.get('/requests/:idNew', function (req, res) {
  const idNew = req.params.idNew;
  var list1 = [];
  var list = [];
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
});


app.post('/update_status', function (req, res) {

// var receivers = ['team2.dbms1819@gmail.com', req.body.email];

//   let mailOptions, transporter;
//   transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//       user: 'team2.dbms1819@gmail.com',
//       pass: 'database1819'
//     }
//   });
//   console.log(req.body);

//   mailOptions = {
//     // from: req.body.FN+'  &lt; '+ req.body.LN +'   &lt;' + req.body.email +' &gt;', // sender address
//     from: 'team2.dbms1819@gmail.com', // list of receivers
//     to: receivers,
//     subject: 'REQUEST STATUS CHANGED', // Subject line
//     text: 'Request Details: \n Name:' + req.body.requestor_name + '\n Email:' + req.body.email + '\n Tracking Number:' + req.body.tracking_number + '\n Event Name:' + req.body.event_name + '\n Event Start Date:' + req.body.event_start_date + '\n Event End Date:' + req.body.event_end_date + '\n Status: Incomplete' 

//   };

//   console.log(mailOptions);

//   // send mail with defined transport object
//   transporter.sendMail(mailOptions, function (error, response) {
//     if (error) {
//       res.redirect('/fail');
//     }

//   var stat = 'complete';
  client.query("UPDATE requests1 SET status = 'complete' , update_date = NOW() WHERE id = "+ id1 + "", (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log('success!');
    }
  });
    res.redirect('/admin');
});


// app.get('/products', function (req, res) {
//   client.query('SELECT * FROM products', (req, data) => {
//     var list = [];
//     for (var i = 1; i < data.rows.length + 1; i++) {
//       list.push(data.rows[i - 1]);
//     }

//     res.render('products', {
//       title: 'THENEWUSED_products',
//       products: list
//     });
//   });
// });



app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/trialv1.html'));
});


app.listen(process.env.PORT || 3000, function () {
  console.log('Server started at port 3000');
});

