let database = {};
let currentFoods = [];
let rotation = 0;
const colors = ["#00d2d3", "#54a0ff", "#5f27cd", "#ff6b6b", "#ff9f43", "#1dd1a1"];

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');

async function init() {
    try {
        const response = await fetch('recipes.json');
        database = await response.json();
        
        const select = document.getElementById('countrySelect');
        Object.keys(database).sort().forEach(country => {
            const opt = document.createElement('option');
            opt.value = country;
            opt.innerText = country;
            select.appendChild(opt);
        });
        changeCountry();
    } catch (err) {
        console.error("Database failed to load:", err);
    }
}

function filterCountries() {
    const input = document.getElementById('countrySearch').value.toLowerCase();
    const select = document.getElementById('countrySelect');
    const options = select.options;
    let firstMatch = -1;

    for (let i = 0; i < options.length; i++) {
        const country = options[i].text.toLowerCase();
        if (country.includes(input)) {
            options[i].style.display = "";
            if (firstMatch === -1) firstMatch = i;
        } else {
            options[i].style.display = "none";
        }
    }
    if (firstMatch !== -1 && input !== "") {
        select.selectedIndex = firstMatch;
        changeCountry();
    }
}

function changeCountry() {
    const country = document.getElementById('countrySelect').value;
    if(database[country]) {
        currentFoods = Object.keys(database[country]);
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
        ctx.font = "bold 22px Arial";
        ctx.textAlign = "right";
        ctx.fillText(food, 230, 10);
        ctx.restore();
    });
}

function spinWheel() {
    const btn = document.getElementById('spinBtn');
    btn.disabled = true;
    document.getElementById('status-text').innerText = "Spinning...";
    
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
        document.getElementById('status-text').innerText = "Winner Chosen!";
    }, 4000);
}

function displayRecipe(name) {
    const country = document.getElementById('countrySelect').value;
    const recipe = database[country][name];
    
    document.getElementById('recipe-card').style.display = 'block';
    document.getElementById('recipe-title').innerText = name;
    document.getElementById('ingredients-list').innerHTML = recipe.ing.map(i => `<li>${i}</li>`).join('');
    document.getElementById('steps-list').innerHTML = recipe.step.map(s => `<li>${s}</li>`).join('');
}

init();
