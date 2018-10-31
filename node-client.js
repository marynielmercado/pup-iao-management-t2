var firebase = require(‘firebase’);

firebase.initializeApp({
 “appName”: “PUP-IAO”,
 “serviceAccount”: “./serviceAccount.json”,
  authDomain: "iao-fra.firebaseapp.com",
    databaseURL: "https://iao-fra.firebaseio.com",
    projectId: "iao-fra",
    storageBucket: "iao-fra.appspot.com",
    messagingSenderId: "954236925014"
});
var ref = firebase.app().database().ref();
ref.once(‘value’)
 .then(function (snap) {
 console.log(‘snap.val()’, snap.val());
 });