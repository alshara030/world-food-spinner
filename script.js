let recipes = {}; 
let currentFoods = [];
let rotation = 0;
const colors = ["#00d2d3", "#54a0ff", "#5f27cd", "#ff6b6b", "#ff9f43", "#1dd1a1"];

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');

// LOAD DATA
async function initApp() {
    try {
        const res = await fetch('recipes.json');
        recipes = await res.json();
        
        // This line checks if all countries loaded
        console.log("Total countries loaded:", Object.keys(recipes).length);
        
        // Fill the dropdown with EVERYTHING in the JSON
        populateDropdown(Object.keys(recipes).sort());
        
        changeCountry();
    } catch (err) {
        console.error("Error: Could not load recipes.json", err);
    }
}

// SEARCH LOGIC (FIXED)
function filterCountries() {
    const searchTerm = document.getElementById('countrySearch').value.toLowerCase();
    const allCountries = Object.keys(recipes).sort();
    
    // Create a new list of countries that match the search
    const filtered = allCountries.filter(c => c.toLowerCase().includes(searchTerm));

    // Update the dropdown menu with ONLY filtered results
    populateDropdown(filtered);

    // If matches exist, auto-select the first one and update the wheel
    if (filtered.length > 0) {
        document.getElementById('countrySelect').value = filtered[0];
        changeCountry();
    }
}

function populateDropdown(list) {
    const select = document.getElementById('countrySelect');
    select.innerHTML = ""; 
    
    list.forEach(country => {
        let opt = document.createElement('option');
        opt.value = country;
        opt.innerText = country;
        select.appendChild(opt);
    });
}

function changeCountry() {
    const country = document.getElementById('countrySelect').value;
    if (recipes[country]) {
        currentFoods = Object.keys(recipes[country]);
        drawWheel();
    }
}

function drawWheel() {
    const slice = (Math.PI * 2) / currentFoods.length;
    ctx.clearRect(0,0,500,500);
    currentFoods.forEach((food, i) => {
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, i*slice, (i+1)*slice);
        ctx.fill();
        
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(i*slice + slice/2);
        ctx.fillStyle = "white";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "right";
        ctx.fillText(food, 230, 5);
        ctx.restore();
    });
}

function spinWheel() {
    const btn = document.getElementById('spinBtn');
    btn.disabled = true;
    
    const spin = 1800 + Math.floor(Math.random() * 360);
    rotation += spin;
    canvas.style.transform = `rotate(${rotation}deg)`;

    setTimeout(() => {
        btn.disabled = false;
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        
        const deg = rotation % 360;
        const sliceSize = 360 / currentFoods.length;
        const index = Math.floor(((360 - deg) % 360) / sliceSize);
        
        displayRecipe(currentFoods[index]);
    }, 4000);
}

function displayRecipe(foodName) {
    const country = document.getElementById('countrySelect').value;
    const data = recipes[country][foodName];
    
    document.getElementById('recipe-card').style.display = "block";
    document.getElementById('recipe-title').innerText = foodName;
    document.getElementById('ingredients-list').innerHTML = data.ing.map(i => `<li>${i}</li>`).join('');
    document.getElementById('steps-list').innerHTML = data.step.map(s => `<li>${s}</li>`).join('');
}

initApp();
