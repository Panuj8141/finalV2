import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set , get , remove , update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword , onAuthStateChanged , signOut} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCzjYdi1BgNqfOZyGOpH1al1cMgEyFPZmY",
    authDomain: "intro-1404a.firebaseapp.com",
    databaseURL: "https://intro-1404a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "intro-1404a",
    storageBucket: "intro-1404a.firebasestorage.app",
    messagingSenderId: "1037606623223",
    appId: "1:1037606623223:web:6789d47c578d55e33d80f2"
  };

  const app  = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const auth  = getAuth(app);

  export function logoutAdmin(){
    signOut(auth).
    then(()=>{
        console.log("User logged out");
        window.location.replace("/login");
    }).
    catch((error)=>{
        console.log("Signout error: " , error);
    })
}


  const productGrid = document.querySelector(".product-grid");
  const editBtn = document.querySelector(".edit-btn-span");
  const saveBtn = document.querySelector(".save-btn-span");

  let data ={}
  const matchedProducts = {};
export async function getDataFromDatabase(selectedArray){
  const dataRef = ref(db , 'products');
  const snapshot = await get(dataRef);
  try{
    if(snapshot.exists()){
      data = snapshot.val();
      
      for( const [key , value ] of Object.entries(data)){
        if(selectedArray.includes(value.name)){
          matchedProducts[key]=value;
          renderProductsCard(matchedProducts)

        }
      }
      console.log(matchedProducts); 
    }
  }catch(error){
    console.log(error);
  }
  console.log("database" , matchedProducts);
}

export function searchInput(array, query) {
  const lowerQuery = query.trim().toLowerCase();
  
  const productSearchSpace =  matchedProducts;
  if (!lowerQuery) {
    // Query is empty, show all products again
    renderProductsCard(matchedProducts); // Show full list
    return;
  }

  const matched = [];

  for (const id in productSearchSpace) {
    const searchObject = productSearchSpace[id];
    const searchName = searchObject.name.toLowerCase();

    // Normalize both sides for reliable comparison
    const pageProductNames = array.map(name => name.toLowerCase());

    if (
      pageProductNames.includes(searchName) &&
      searchName.includes(lowerQuery)
    ) {
      matched.push(searchObject);
    }
  }

  if (matched.length === 0) {
    const notFoundCard = document.createElement("div");
    notFoundCard.classList.add("not-found-card");
    const message = document.createElement("h3");
    message.classList.add("not-found-message");
    message.textContent="Sorry , no products found";
    const img = document.createElement("img");
    img.classList.add("product-not-found-image");
    img.src="./images/proc404.png";
    img.alt="product-not-found-image";
    notFoundCard.appendChild(img);
    notFoundCard.appendChild(message);
    productGrid.innerHTML="";
    productGrid.appendChild(notFoundCard);
  } else {
    renderProductsCard(matched);
  }
}

// export async function searchForHome(query){
//   const lowerQuery = query.trim().toLowerCase();
//   const dataRef = ref(db , 'products');
//   const snapshot = await get(dataRef);

//     if(snapshot.exists()){
//       data = snapshot.val();
//     }

//   const productsSource = data;
  
//   if(!lowerQuery){
//     console.log("no search query");
//     return;
//   }
//   const matched =[];
//   for(const id in productsSource){
//     const searchObject = productsSource[id];
//     const searchName = searchObject.name.toLowerCase();
//     console.log(searchName);

//     if(searchName.includes(lowerQuery)){
//       matched.push(searchObject);
//     } 
//   }
//   if(matched.length === 0){
//     const notFoundCard = document.createElement("div");
//     notFoundCard.classList.add("not-found-card");

//     const message = document.createElement("h3");
//     message.classList.add("not-found-message");
//     message.textContent = "Sorry, no products found";

//     const img = document.createElement("img");
//     img.classList.add("product-not-found-image");
//     img.src = "/images/proc404.png";
//     img.alt = "product-not-found-image";

//     notFoundCard.appendChild(img);
//     notFoundCard.appendChild(message);

//     document.querySelector(".product-section").appendChild(notFoundCard);
//   }else{
//     console.log(matched);
//   }
// }



//for geting the original data from the database to compare for tracking the changes

async function getOrigianlProductData(table){
  
  const procId = table.getAttribute("data-product-id");
  const dataRef = ref(db , `products/${procId}`);
  
  try{
    const snapshot = await get(dataRef);
    if(snapshot.exists()){
      const retrievedObject = snapshot.val()
      return retrievedObject;
    }else{
      return {"error":"No Data Found"};
    }
  }catch(error){
    return {"error":error.message};
  }
}

async function updateProduct(product , productId , updatedObject){
  try{
    const dataRef = ref(db , `products/${productId}`);
    await update(dataRef , updatedObject);
    modalBody.innerHTML="";
    modalBody.appendChild(makeTable(updatedObject , productId , false));
    document.querySelector('.message').textContent="Saved Successfully";
    document.getElementById('editAlert').classList.add('show');
    setTimeout(() => {
      document.getElementById('editAlert').classList.remove('show');
    }, 2000);

  }catch(error){
    modalBody.innerHTML="";
    modalBody.appendChild(makeTable(product , productId , false));
    document.getElementById('editAlert').textContent="An error occured while saving. Try again later.";
    document.getElementById('editAlert').classList.add('show');
    setTimeout(() => {
      document.getElementById('editAlert').classList.remove('show');
    }, 2000);
  }

} 
// for tracking the changes and making the updated object for easy updataion

function getUpdatedProductObject(table, originalProduct) {
  // Step 1: Deep clone the original product
  const updatedProduct = JSON.parse(JSON.stringify(originalProduct));
  const description = updatedProduct.description;
  const headers = description.table_headers;

  const inputs = table.querySelectorAll("input");

  inputs.forEach(input => {
    const field = input.getAttribute("data-field");
    const rowIndex = parseInt(input.getAttribute("data-row-index"), 10);
    const newValue = input.value.trim();

    if (rowIndex === -1) {
      // Handle 'location' or 'extra'
      if (field === "location" && newValue !== (originalProduct.description.location || "")) {
        updatedProduct.description.location = newValue;
      }

      if (field === "extra" && newValue !== (originalProduct.description.extra || "")) {
        updatedProduct.description.extra = newValue;
      }
    } else {
      const originalValue = originalProduct.description.table_data[rowIndex]?.[field] || "";
      if (newValue !== originalValue) {
        updatedProduct.description.table_data[rowIndex][field] = newValue;
      }
    }
  });

  return updatedProduct;
}

// for generating teh input field for editable table 

function createInput(value, rowIndex, field, productId) {
  const input = document.createElement("input");
  input.className = "input-cell";
  input.type = "text";
  input.value = value || "";
  input.setAttribute("data-field", field);
  input.setAttribute("data-row-index", rowIndex);
  input.setAttribute("data-product-id", productId);
  return input;
}

// 🧱 Main function to create the table
function makeTable(product, productId, editable = false) {
  const { description } = product;
  const { table_headers: headers, table_data: data, location, extra } = description;

  const table = document.createElement("table");
  table.setAttribute("data-product-id", productId);
  table.setAttribute("data-editable", editable);

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  const tbody = document.createElement("tbody");

  data.forEach((rowData, rowIndex) => {
    const row = document.createElement("tr");
    headers.forEach(field => {
      const td = document.createElement("td");
      if (editable) {
        const input = createInput(rowData[field], rowIndex, field, productId);
        td.appendChild(input);
      } else {
        td.textContent = rowData[field] || "";
      }
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });

  // 📍 Location row
  if (location !== undefined) {
    const locRow = document.createElement("tr");
    const locCell = document.createElement("td");
    locCell.colSpan = headers.length;
    if (editable) {
      const input = createInput(location, -1, "location", productId);
      locCell.innerHTML = `<strong>Location: </strong>`;
      locCell.appendChild(input);
    } else {
      locCell.innerHTML = `<strong>Location: </strong>${location}`;
    }
    locRow.appendChild(locCell);
    tbody.appendChild(locRow);
  }

  // ➕ Extra row
  if (extra !== undefined) {
    const extraRow = document.createElement("tr");
    const extraCell = document.createElement("td");
    extraCell.colSpan = headers.length;
    if (editable) {
      const input = createInput(extra, -1, "extra", productId);
      extraCell.innerHTML = `<strong>Extra: </strong>`;
      extraCell.appendChild(input);
    } else {
      extraCell.innerHTML = `<strong>Extra: </strong>${extra}`;
    }
    extraRow.appendChild(extraCell);
    tbody.appendChild(extraRow);
  }

  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
}

function closeModal(){
  document.querySelector('.modal').style.display="none";
  document.body.classList.remove('model-open');
  document.documentElement.classList.remove('modal-open');
  saveBtn.style.display="none";
  editBtn.style.display="block";
  document.querySelector(".edit-status").style.display="none";
}



// displaying the products in the page
  export function renderProductsCard(filteredProducts){
    const productGrid = document.querySelector(".product-grid");
    const isHomePage = document.body.getAttribute("data-page") === 'home' ;
    if(isHomePage){
        const productSection = document.querySelector(".product-section");
        if(productSection){
          productSection.innerHTML="";
        }
      }
    if(!isHomePage){
      productGrid.innerHTML="";
    }

    
    for(const productId in filteredProducts){
      // console.log(filteredProducts[productId]);
      const product = filteredProducts[productId];
      const card = document.createElement("div")
      card.classList.add("card")
      card.classList.add(productId);
      
      
      const img = document.createElement("img");
      const src = `../${product.image}`;
      img.src=src;
      img.alt=productId;
      img.classList.add("product-image");

      const imageWrapper = document.createElement("div");
      imageWrapper.classList.add("image-wrapper");
      imageWrapper.appendChild(img);

      const h3 = document.createElement("h3")
      h3.textContent=product.name;

      card.addEventListener('click' , ()=>{
        const modal  = document.querySelector("#modal");
        const modalBody = document.querySelector("#modalBody")
        const modalTitle = document.querySelector("#modalTitle");
        modalTitle.textContent=product.name;

        saveBtn.addEventListener('click' , async (event)=>{
          document.querySelector(".edit-status").style.display="none"; 
          saveBtn.style.display="none";
          editBtn.style.display="block";

          const editableTable  = modalBody.querySelector("table");
          const originalObject = await getOrigianlProductData(editableTable);
          const updatedObject = getUpdatedProductObject(editableTable , originalObject);
          updateProduct(product , productId , updatedObject);


          // modalBody.innerHTML="";
          // modalBody.appendChild(makeTable(updatedObject , productId , false));
          
          
          

        })
        document.querySelector(".edit-btn-span").addEventListener('click' , ()=>{
          document.querySelector('.message').textContent = "✏️ You are now in Edit Mode. Changes won’t be saved until you click ‘Save’.";
          document.getElementById('editAlert').classList.add('show');
          document.querySelector(".edit-status").style.display="block";
          saveBtn.style.display="block";
          editBtn.style.display="none"
          modalBody.innerHTML="";
          modalBody.appendChild(makeTable(product , productId, true));
        })


        document.querySelector(".close-btn").addEventListener('click' , closeModal);

        modal.style.display="block";
        modalBody.innerHTML=""
        modalBody.appendChild(makeTable(product , productId , false));
        document.body.classList.add("modal-open");

        
      });

      card.append(imageWrapper);
      card.append(h3)

      
      if(isHomePage){
        const productSection = document.querySelector(".product-section");
        if(productSection){
          productSection.append(card);
        }
      }
      
      if(!isHomePage){
        productGrid.append(card);

      }
    }
    
  }
  
    