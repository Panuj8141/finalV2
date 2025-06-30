import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set , get , remove , update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword ,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCzjYdi1BgNqfOZyGOpH1al1cMgEyFPZmY",
    authDomain: "intro-1404a.firebaseapp.com",
    databaseURL: "https://intro-1404a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "intro-1404a",
    storageBucket: "intro-1404a.firebasestorage.app",
    messagingSenderId: "1037606623223",
    appId: "1:1037606623223:web:6789d47c578d55e33d80f2"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);



  const emailEl = document.querySelector("#email");
  const passwordEl = document.querySelector("#password");
  const formEl  = document.querySelector(".login-form");
  const submitBtn = formEl.querySelector("button");
  
  function showLoginAlert() {
    const alertBox = document.getElementById('loginAlert');
    alertBox.classList.add('show');

    // Auto-dismiss after 3 seconds (3000ms)
    setTimeout(() => {
      alertBox.classList.remove('show');
    }, 3000);
  }
  function checkForLogin(){
    onAuthStateChanged(auth , (user)=>{
      if(user){
        window.location.replace("/");
      }
    })
  }
window.onload=checkForLogin();

  async function loginAdmin(){
    const email = emailEl.value;
    const password= passwordEl.value;
    if(email && password){
        signInWithEmailAndPassword(auth , email , password).
            then((userCredentials)=>{
                window.location.replace("/index.html");
                
            }).
            catch((error)=>{                
                showLoginAlert();
            });
    }else{
        document.querySelector(".login-alert").textContent="Fill all the required Fields";
        showLoginAlert();
    }

    
  }

  submitBtn.addEventListener('click' , (e)=>{
    e.preventDefault();
    loginAdmin();
  })