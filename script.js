let recipes = {}; // This will hold all 50 countries
let currentFoods = [];
let rotation = 0;
const colors = ["#00d2d3", "#54a0ff", "#5f27cd", "#ff6b6b", "#ff9f43", "#1dd1a1"];

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');

// 1. LOAD THE DATA
async function initApp() {
    try {
        // Fetching the JSON file from your GitHub folder
        const res = await fetch('recipes.json');
        recipes = await res.json();
        
        console.log("Recipes loaded successfully:", Object.keys(recipes).length);
        
        // Build the initial dropdown list
        populateDropdown(Object.keys(recipes).sort());
        
        // Set the first country as default
        changeCountry();
    } catch (err) {
        console.error("Critical Error: Could not load recipes.json. Check your file name!", err);
    }
}

// 2. SEARCH / FILTER LOGIC
function filterCountries() {
    const searchTerm = document.getElementById('countrySearch').value.toLowerCase();
    const allCountries = Object.keys(recipes).sort();
    
    // Filter the list of countries based on what you typed
    const filtered = allCountries.filter(country => 
        country.toLowerCase().includes(searchTerm)
    );

    // Re-fill the dropdown with only the matches
    populateDropdown(filtered);

    // If there's a match, update the wheel to the first one found
    if (filtered.length > 0) {
        document.getElementById('countrySelect').value = filtered[0];
        changeCountry();
    }
}

// 3. FILL THE DROPDOWN
function populateDropdown(list) {
    const select = document.getElementById('countrySelect');
    select.innerHTML = ""; // Clear old options
    
    list.forEach(country => {
        let opt = document.createElement('option');
        opt.value = country;
        opt.innerText = country;
        select.appendChild(opt);
    });
}

// 4. UPDATE THE WHEEL WHEN COUNTRY CHANGES
function changeCountry() {
    const country = document.getElementById('countrySelect').value;
    if (recipes[country]) {
        currentFoods = Object.keys(recipes[country]);
        drawWheel();
    }
}

// 5. DRAW THE WHEEL
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
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "right";
        ctx.fillText(food, 230, 8);
        ctx.restore();
    });
}

// 6. SPIN LOGIC
function spinWheel() {
    const btn = document.getElementById('spinBtn');
    btn.disabled = true;
    
    // Add a spinning effect class if you have it in CSS
    canvas.style.filter = "drop-shadow(0 0 15px #00d2d3)";
    
    const spin = 1800 + Math.floor(Math.random() * 360);
    rotation += spin;
    canvas.style.transform = `rotate(${rotation}deg)`;

    setTimeout(() => {
        btn.disabled = false;
        canvas.style.filter = "none";
        
        // Confetti effect
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        
        const deg = rotation % 360;
        const sliceSize = 360 / currentFoods.length;
        const index = Math.floor(((360 - deg) % 360) / sliceSize);
        
        displayRecipe(currentFoods[index]);
    }, 4000);
}

// 7. SHOW THE RECIPE
function displayRecipe(foodName) {
    const country = document.getElementById('countrySelect').value;
    const data = recipes[country][foodName];
    
    document.getElementById('recipe-card').style.display = "block";
    document.getElementById('recipe-title').innerText = foodName;
    document.getElementById('ingredients-list').innerHTML = data.ing.map(i => `<li>${i}</li>`).join('');
    document.getElementById('steps-list').innerHTML = data.step.map(s => `<li>${s}</li>`).join('');
    
    // Smooth scroll to recipe
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// Start everything
initApp();
