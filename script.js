let recipes = {}; 
let currentFoods = [];
let rotation = 0;
const colors = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#FF33A8", "#33FFF3"];

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');

// LOAD DATA
async function loadRecipes() {
    try {
        const response = await fetch('recipes.json');
        if (!response.ok) throw new Error("File not found");
        recipes = await response.json();
        
        const countries = Object.keys(recipes).sort();
        const select = document.getElementById('countrySelect');
        
        // Fill dropdown
        select.innerHTML = countries.map(c => `<option value="${c}">${c}</option>`).join('');
        
        // Set initial country
        updateSelection();
    } catch (error) {
        console.error("Error loading JSON:", error);
        document.getElementById('recipe-title').innerText = "Error: recipes.json not found!";
    }
}

function updateSelection() {
    const country = document.getElementById('countrySelect').value;
    if (recipes[country]) {
        currentFoods = Object.keys(recipes[country]);
        drawWheel();
    }
}

// DRAW THE WHEEL
function drawWheel() {
    const size = canvas.width;
    const center = size / 2;
    const sliceAngle = (2 * Math.PI) / currentFoods.length;

    ctx.clearRect(0, 0, size, size);

    currentFoods.forEach((food, i) => {
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(center, center);
        ctx.arc(center, center, center, i * sliceAngle, (i + 1) * sliceAngle);
        ctx.fill();
        ctx.stroke();

        // Add Text
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(i * sliceAngle + sliceAngle / 2);
        ctx.fillStyle = "white";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "right";
        ctx.fillText(food, center - 20, 10);
        ctx.restore();
    });
}

// SPIN LOGIC
function spinWheel() {
    const btn = document.getElementById('spinBtn');
    btn.disabled = true;

    const extraSpin = 1080 + Math.floor(Math.random() * 360); 
    rotation += extraSpin;
    
    canvas.style.transition = "transform 4s cubic-bezier(0.15, 0, 0.15, 1)";
    canvas.style.transform = `rotate(${rotation}deg)`;

    setTimeout(() => {
        btn.disabled = false;
        const actualRotation = rotation % 360;
        const sliceSize = 360 / currentFoods.length;
        // Calculate which slice stopped at the pointer (top/right)
        const winningIndex = Math.floor(((360 - actualRotation) % 360) / sliceSize);
        showRecipe(currentFoods[winningIndex]);
    }, 4000);
}

function showRecipe(foodName) {
    const country = document.getElementById('countrySelect').value;
    const data = recipes[country][foodName];

    document.getElementById('recipe-title').innerText = foodName;
    document.getElementById('country-badge').innerText = country;
    
    const ingList = document.getElementById('ingredients-list');
    const stepList = document.getElementById('steps-list');

    ingList.innerHTML = data.ing.map(i => `<li>${i}</li>`).join('');
    stepList.innerHTML = data.step.map(s => `<li>${s}</li>`).join('');
    
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
}

// Search Function
function filterCountries() {
    const input = document.getElementById('countrySearch').value.toLowerCase();
    const select = document.getElementById('countrySelect');
    const options = Object.keys(recipes);
    
    const filtered = options.filter(o => o.toLowerCase().includes(input));
    if (filtered.length > 0) {
        select.innerHTML = filtered.map(c => `<option value="${c}">${c}</option>`).join('');
        updateSelection();
    }
}

loadRecipes();
