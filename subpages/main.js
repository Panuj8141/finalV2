import { getDataFromDatabase , logoutAdmin , searchInput } from "./utils.js";

const page = document.body.dataset.page;

const dataByPage ={
    "carry-and-waste-solution":[
        'Green Garbage Bag',
        'Silver Pouch(3sizes)',
        'Eco Panni jhabla bag',
        'Eco Panni Milk Bags',
        'Black garbage bag',
        'Chamki small bag',
        'Cloth bags',
        'Envolope',
        'Flower bags',
        'Goni hand bag',
        'Goni large bag',
        'Paper bags',
        'Zip lock plastic bag'
    ],
    "caterer-essentail":[
        'Paper glass',
        'Paper nashta plates',
        'Silver nashta plate',
        'Ganna plane plate',
        'Ganna Khacha',
        'Ganna dona',
        'Single silver dona',
        'T-shirt Chindi',
        'Towel Chindi',
        'Stirrers',
        'Plastic Spoon',
        'Plastic Fork',
        'Ice Cream Spoon',
        'Ice Cream Cup',
        'Ice cream plastic spoon',
        'Ice cream plastic bowl',
        'Packet Wooden Toothpick',
        'Dabbi Wooden Toothpick',
        'Table Roll',
        'Tissue Paper',
        'Green Garbage Bag',
        'Black garbage bag',
        'Caterers Menu Card',
        'Butter Paper',
        'Chemical',
        'Aluminum foil',
        'Cling big box (for Caterers)',
        'Rubber hand gloves',
        'Zip lock plastic bag',
    ],
    "disposable-home-and-function":[
        'Refill glass',
        'Paper glass',
        'Ganna plane plate',
        'Ganna Khacha',
        'Ganna Square 2 Khacha',
        'Makka Square',
        'Makka Circle',
        'LightGreen Plane Leaves Plate',
        '14 Inch Plane Green Plate',
        '14 Inch lightGreen Khacha Plate',
        '14 Inch Dark Green khacha Plate',
        'DarkGreen Plane Leaves Plate',
        '13 Inch Plane Silver Plate',
        'Ganna Nashta Plate',
        'Wooden Spoon',
        'Wooden Fork',
        'Plastic Spoon',
        'Plastic Fork',
        'Makka Bowl/Dona',
        'Ice Cream Spoon',
        'Ice Cream Cup',
        'Dabbi Wooden Toothpick',
        '0 Number Silver Plate (110)',
        '0 Number Silver Plate (80)',
        '0 Number Silver Plate (60)',
        'Stirrers',
        'Cling (for Home use)',
        'Tissue Paper',
        'Toilet Roll',
        'Butter Paper',
        'Aluminum foil',
        'Black garbage bag',
        'Butter paper dona',
        'Chamki small bag',
        'Double silver dona',
        'Envolope',
        'Cloth bags',
        'Flower bags',
        'Ganna dona',
        'Goni hand bag',
        'Goni large bag',
        'Paper nashta plates',
        'Rubber band',
        'Silver container',
        'Silver khacha plate 50',
        'Silver khacha plate 60',
        'Silver khacha plate 90',
        'Silver nashta plate',
        'Shallow ganna bowl/dona',
        'Single silver dona',
        'Ice cream plastic bowl',
        'Ice cream plastic spoon'
    ],
    "party-and-event-decoration":[
        'Chrome balloon',
        'Metallic Balloons',
        'Double Side Tape',
        'Balloon Pump',
        'Balloon Electric Machine (rental)',
        'Snow Spray',
        'Gift Paper',
        'Paper Latkan(Paper Strimmer Multicolour)',
        'Crown',
        'Decoration Ribbon',
        'Pataka',
        'Annapras banner',
        'Annapras combo',
        'Anniversary foil balloon Banner',
        'Baby shower banner',
        'Baby cartoon foil ballon',
        'Baby shower letter banner',
        'Baby shower multicolour foil balloon banner',
        'Balloon Glue',
        'Bell latkan',
        'Birthday Caps',
        'Birthday Curtains',
        'Birthday foil Balloon Banner',
        'Birthday party popper',
        'Bride to be letter banner',
        'Cartoon foil balloon packet',
        'Circle tokri',
        'Colourful tape',
        'Flower haldi banner',
        'Green grass',
        'Haldi big banner',
        'Haldi combo',
        'Haldi foil balloon banner',
        'Haldi kite',
        'Happy aniversary banner',
        'Happy anniversary combo',
        'Happy anniversary letter banner',
        'Happy birthday banner',
        'Happy birthday big balloon',
        'Happy birthday combo',
        'Happy birthday letter banner',
        'Happy birthday light',
        'Lamba pink balloon',
        'Letter foil balloon',
        'Light tiara',
        'Number cake topper',
        'Number foil balloons',
        'Red ball latkan',
        'Shub Labh',
        'Slashes',
        'Square tokri',
        'Star foil balloon',
        'Box birthday curtain',
        'Transparent balloon',
        'Transparent tape',
        'Welcome foil balloon banner',
        'Without knife Balloon Pack',
    ],
    "retial-and-takewaay":[
        'Paper bags',
        'Silver container',
        'Silver Pouch(3sizes)',
        'Paper nashta plates',
        'Eco Panni Milk Bags',
        'Eco Panni jhabla bag',
        'Paper glass'
      ]
};

const array = dataByPage[page];
const searchInputEl = document.querySelector("#searchInput");

async function getStarted(){
    await getDataFromDatabase(array);
    searchInputEl.addEventListener('input' , (e)=>{
        const query = e.target.value;
        searchInput(array , query);
    });
}
searchInputEl.addEventListener('keydown' , (e)=>{
    if(e.key === "Enter"){
        e.preventDefault();
        search.blur();
    }
})

if(array){
    // getDataFromDatabase(array);
    getStarted();

    
}

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

