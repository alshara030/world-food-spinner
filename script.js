let recipes = {};

async function loadRecipes() {
    try {
        const response = await fetch('recipes.json');
        if (!response.ok) throw new Error("HTTP error " + response.status);
        recipes = await response.json();
        
        const select = document.getElementById('countrySelect');
        const countries = Object.keys(recipes).sort();
        select.innerHTML = countries.map(c => `<option value="${c}">${c}</option>`).join('');
        
        console.log("✈️ Passport Ready!");
    } catch (e) {
        console.error("Critical Error:", e);
        document.getElementById('recipe-title').innerText = "Data Connection Lost";
        document.getElementById('country-badge').innerText = "Check Console (F12)";
    }
}

function flipCard() {
    document.getElementById('cardInner').classList.toggle('is-flipped');
}

function shuffleRecipe() {
    const card = document.getElementById('cardInner');
    card.classList.remove('is-flipped');
    
    setTimeout(() => {
        const countries = Object.keys(recipes);
        const country = countries[Math.floor(Math.random() * countries.length)];
        const foods = Object.keys(recipes[country]);
        const food = foods[Math.floor(Math.random() * foods.length)];
        
        updateUI(country, food);
    }, 200);
}

function updateUI(country, food) {
    const data = recipes[country][food];
    document.getElementById('country-badge').innerText = country;
    document.getElementById('recipe-title').innerText = food;
    document.getElementById('ingredients-list').innerHTML = data.ing.map(i => `<li>${i}</li>`).join('');
    document.getElementById('steps-list').innerHTML = data.step.map(s => `<li>${s}</li>`).join('');
}

loadRecipes();
