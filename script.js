let recipes = {};
let currentFoods = [];
let rotation = 0;
const colors = ["#00d2d3", "#54a0ff", "#5f27cd", "#ff6b6b", "#ff9f43", "#1dd1a1"];

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');

async function initApp() {
    const res = await fetch('recipes.json');
    recipes = await res.json();
    
    const select = document.getElementById('countrySelect');
    Object.keys(recipes).sort().forEach(country => {
        let opt = document.createElement('option');
        opt.value = country;
        opt.innerText = country;
        select.appendChild(opt);
    });
    changeCountry();
}

function filterCountries() {
    const term = document.getElementById('countrySearch').value.toLowerCase();
    const select = document.getElementById('countrySelect');
    for (let opt of select.options) {
        opt.style.display = opt.text.toLowerCase().includes(term) ? "" : "none";
    }
}

function changeCountry() {
    const country = document.getElementById('countrySelect').value;
    currentFoods = Object.keys(recipes[country]);
    drawWheel();
}

function drawWheel() {
    const slice = (Math.PI * 2) / currentFoods.length;
    ctx.clearRect(0,0,500,500);
    currentFoods.forEach((food, i) => {
        ctx.beginPath(); ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(250, 250); ctx.arc(250, 250, 250, i*slice, (i+1)*slice); ctx.fill();
        ctx.save(); ctx.translate(250, 250); ctx.rotate(i*slice + slice/2);
        ctx.fillStyle = "white"; ctx.font = "bold 20px Poppins"; ctx.textAlign = "right";
        ctx.fillText(food, 230, 8); ctx.restore();
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
    window.scrollTo({ top: document.getElementById('recipe-card').offsetTop - 20, behavior: 'smooth' });
}

initApp();
