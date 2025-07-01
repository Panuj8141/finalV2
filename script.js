import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set , get , remove , update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword , onAuthStateChanged , signOut} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { renderProductsCard, searchInput } from "./subpages/utils.js";
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
  const db = getDatabase(app);
  const auth = getAuth(app);

  function logoutAdmin(){
        signOut(auth).
        then(()=>{
            console.log("User logged out");
            window.location.replace("finalV2/login");
        }).
        catch((error)=>{
            console.log("Signout error: " , error);
        })
  }

function checkForLogin(){
    onAuthStateChanged(auth , (user)=>{
        if(user){
            document.body.style.display="block";
            document.querySelector('#userDashboard > p').textContent=`Welcome ${user.email}`;
        }else{
            
            window.location.replace("login/index.html");
        }
      });
}

document.onload = checkForLogin();
  
  

const headers =[
    {
        "image":"caterer-essentail.png",
        "header":"🍽 Caterer's Essentials",
        "description":"Bulk-use items and hygiene products designed to power smooth, large-scale food service."
    },
    {
        "image":"party-and-event-decoration.png",
        "header":"🎉 Party & Event Decoration",
        "description":"Everything you need to light up birthdays, weddings, and festive moments with fun and color."
    },
    {
        "image":"carry-and-waste-solution.png",
        "header":"♻ Carry & Waste Solutions",
        "description":"Eco and utility bags, garbage liners, and wraps — for smart storage and clean disposal."
    },
    {
        "image":"disposable-home-and-function.png",
        "header":"🏠 Disposable Home & Function Use",
        "description":"Plates, bowls, and cutlery for poojas, haldi, family feasts, and everyday convenience."
    },
    {
        "image":"retial-and-takewaay.png",
        "header":"🛍 Retail & Takeaway Supplies",
        "description":"Serving and packing essentials for tea stalls, snack vendors, and food-on-the-go businesses."
    }
];

const productSection = document.querySelector(".product-section");

const userIcon = document.querySelector('.user-icon');
const dashboard = document.getElementById('userDashboard');

// Toggle dashboard on icon click
userIcon.addEventListener('click', (e) => {
e.stopPropagation(); // prevent bubbling to document
dashboard.classList.toggle('show');
});

document.querySelector(".logout").addEventListener('click' , logoutAdmin);

// Close dashboard when clicking outside
document.addEventListener('click', (e) => {
if (!dashboard.contains(e.target) && !userIcon.contains(e.target)) {
    dashboard.classList.remove('show');
}
});

function homePopulator(){
    productSection.innerHTML="";
    headers.forEach(head =>{
    const imageName = head.image;
    const imagesrc = imageName.replace("png", "html");
    const productCard = document.createElement("div");
    productCard.className="product-card";
    productCard.innerHTML=`
        <img src="images/${head.image}" alt="image of product" class="product-image">
        <h3>${head.header} </h3>
        <p>${head.description}</p>
        `;
        productCard.addEventListener('click' , ()=>{
            window.location.href=`subpages/${imagesrc}`;
        });
    productSection.append(productCard);
});
}
homePopulator();



async function searchFunction(query){
    const lowerQuery = query.trim().toLowerCase();
    let searchSampleSpace = {};
    let resultObj={};
    let matched =[];
    const dataRef = ref(db , 'products');
    const snapshot = await get(dataRef);
    try{
        if(snapshot.exists()){
            searchSampleSpace=snapshot.val();
            // console.log(searchSampleSpace);
        }
    }catch(error){
        console.log(error);
    }

    if(!query){
        homePopulator();
        return
    }
    for(const key in searchSampleSpace){
        const  productId = key;
        const productObject = searchSampleSpace[key];
        const searchName = productObject.name.trim().toLowerCase();
        
        if(searchName.includes(lowerQuery)){
            matched.push(productObject);
            resultObj[key]=productObject;
        }
    }
    if(matched.length ===0){
        const notFoundCard = document.createElement("div");
        notFoundCard.classList.add("not-found-card");
        const message = document.createElement("h3");
        message.classList.add("not-found-message");
        message.textContent="Sorry , no products found";
        const img = document.createElement("img");
        img.classList.add("product-not-found-image");
        img.src="https://panuj8141.github.io/finalV2/images/proc404.png";
        img.alt="product-not-found-image";
        notFoundCard.appendChild(img);
        notFoundCard.appendChild(message);
        productSection.innerHTML="";
        productSection.append(notFoundCard);
    }else{
        console.log(matched)
        console.log(resultObj);
        renderProductsCard(resultObj);
    }
    console.log(resultObj);
}

const search = document.getElementById("searchInput");
search.addEventListener("input", (e) => {
    const query = e.target.value;
    searchFunction(query);
  });

  search.addEventListener("keydown" , (e)=>{
    if(e.key === "Enter"){
        e.preventDefault();
        search.blur();
    }
  })

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('Service Worker Registered'))
      .catch((error) => console.error('Service Worker registration failed:', error));
  }