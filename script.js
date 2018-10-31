
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


const storage = firebase.storage()
const submitButton = document.getElementById('fileupload');
submitButton.addEventListener('change', (e)=>{
  let file = e.target.files[0];
  let locationRef = storage.ref('testv7/' + file.name)
  let task = locationRef.put(file)
  task.on('state_changed', 
  function progress(snapshot){ //progress
    let per = (snapshot.bytesTransferred / snapshot.totalBytes) *100;
    uploader.value = per;
  },
  function error(error){ },
  function complete(){
   storageRef.getMetadata().then(metadata=>{
         ref.push({
          url: metadata.downloadURLs[0]
       //   console.log('COMPLETED');
        })
        })
  }
)
})