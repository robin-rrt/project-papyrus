
const firebaseConfig = {
  apiKey: "AIzaSyCa3_LBdFJKPRvsPoQjcfJgwUDa6nrkaQ4",
  authDomain: "project-papyrus.firebaseapp.com",
  projectId: "project-papyrus",
  storageBucket: "project-papyrus.appspot.com",
  messagingSenderId: "874912258826",
  appId: "1:874912258826:web:dad7dbe0137042956638f3",
  measurementId: "G-Z5NMZ94M94"
};


const db = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth()
const firestore = firebase.firestore();


async function register() {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const full_name = document.getElementById('full_name').value
  const admission_no = document.getElementById('admission_no').value
  const phone_number = document.getElementById('phone_number').value
  const branch = document.getElementById('branch').value
  const semester = document.getElementById('semester').value
  console.log(email);
  console.log(password);
  console.log(full_name);

  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Please check your data')
    return
  }
  if (validate_field(full_name) == false) {
    alert('Please check your data')
    return
  }


  auth.createUserWithEmailAndPassword(email, password)
    .then(function () {
      var user = auth.currentUser
      const userRef = firestore.collection("users");
      var user_data = {
        user_id: user.uid,
        email: email,
        full_name: full_name,
        admission_no: admission_no,
        phone_number: phone_number,
        branch: branch,
        semester: semester,
        balance: 0,
        emailVerified: false,
        last_login: Date.now(),
        staff: false
      }
      userRef.doc(user.uid).set(user_data)
      alert('User Created')
      console.log('User Created');

      //send verificaiton email
      
      const verify = auth.currentUser.sendEmailVerification()
  .then(() => {
    console.log("Email verification sent!");  
  });
  console.log(verify);
    })
    .catch(function (error) {
      var error_code = error.code
      var error_message = error.message

      alert(error_message)
    })
    
  
}

function login() {
  email = document.getElementById('email').value
  password = document.getElementById('password').value

  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Invalid Email or Password')
    return
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(function () {
      var user = auth.currentUser
      const userRef = firestore.collection("users");
      var user_data = {
        last_login: Date.now()
      }
      userRef.doc(user.uid).update(user_data)

      alert('User Logged In')
      window.location.href = `/user-dashboard/${user.uid}`;

    })
    .catch(function (error) {
      var error_code = error.code
      var error_message = error.message
      alert(error_message)
    })
}

function logout(){
  auth.signOut().then(() => {
    // Sign-out successful.
    alert('User Logged Out')
      window.location.href = `/login`;
  }).catch((error) => {
    // An error happened.
    var error_code = error.code
      var error_message = error.message
      alert(error_message)
  });
}

function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    return true
  } else {
    return false
  }
}

function validate_password(password) {
  if (password < 6) {
    return false
  } else {
    return true
  }
}

function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}

function staffLogin() {
  email = document.getElementById('email').value
  password = document.getElementById('password').value

  if (validate_staff_email(email) == false || validate_password(password) == false) {
    alert('Invalid Email or Password')
    return
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(function () {
      var user = auth.currentUser
      const userRef = firestore.collection("users");
      var user_data = {
        last_login: Date.now()
      }
      userRef.doc(user.uid).update(user_data)

      alert('User Logged In')
      window.location.href = `/staff-dashboard`;

    })
    .catch(function (error) {
      var error_code = error.code
      var error_message = error.message
      alert(error_message)
    })
}

function validate_staff_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true && email == 'staff@saintgits.org') {
    return true
  } else {
    return false
  }
}