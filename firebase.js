  // Initialize Firebase
  //var urlpass = [];

// var url;
// var urlpass;
  var config = {
    apiKey: "AIzaSyCubNahS4iwVb4UuE6IiuxGEA0myfdde8E",
    authDomain: "iao-fra.firebaseapp.com",
    databaseURL: "https://iao-fra.firebaseio.com",
    projectId: "iao-fra",
    storageBucket: "iao-fra.appspot.com",
    messagingSenderId: "954236925014"
  };
  firebase.initializeApp(config);
 var storage = firebase.storage()
document.getElementById('loadFile').addEventListener('change', upload);

    function upload() {
        //  const formData = new FormData();

        var file = document.getElementById('loadFile').files[0];
        console.log('/images/' + file.name);
        var storageRef = storage.ref('/trial1/' + file.name);

        storageRef.put(file).then(function (snapshot) {
            console.log('Uploaded a blob or file!');
        });
//    storageRef = storage.ref('');
        storageRef.getDownloadURL().then(function (url) {

        var xhr = new XMLHttpRequest();
     document.getElementById("url").value = url;
  

// xhr.onreadystatechange = function(event) {
//     //typical action to be performed when the document is ready:
//        if (this.readyState == 4 && this.status == 200) {
//        // Typical action to be performed when the document is ready:
//     
//     }
// };

        xhr.open('POST', url, true);
 
        xhr.send();
      

        //console.log(urlpass);
    }).catch(function (error) {
        // Handle any errors
    });
    }
