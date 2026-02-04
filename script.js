let recipes = {};

// 1. Initialize: Load the data from your JSON file
async function loadRecipes() {
    try {
        const response = await fetch('recipes.json');
        if (!response.ok) throw new Error("Could not find recipes.json");
        recipes = await response.json();
        
        // Populate the dropdown menu with country names
        const select = document.getElementById('countrySelect');
        const countries = Object.keys(recipes).sort();
        select.innerHTML = countries.map(c => `<option value="${c}">${c}</option>`).join('');
        
        console.log("Recipes loaded successfully!");
    } catch (e) {
        console.error("Setup Error:", e);
        document.getElementById('recipe-title').innerText = "JSON Loading Error";
    }
}

// 2. The Shuffle Function: Picks a random country and a random recipe
function shuffleRecipe() {
    const card = document.getElementById('cardInner');
    
    // Always flip the card back to the front before changing content
    card.classList.remove('is-flipped'); 
    
    // Small delay to allow the flip-back animation to look smooth
    setTimeout(() => {
        const countries = Object.keys(recipes);
        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
        
        const foods = Object.keys(recipes[randomCountry]);
        const randomFood = foods[Math.floor(Math.random() * foods.length)];
        
        updateCardContent(randomCountry, randomFood);
    }, 200);
}

// 3. Update UI: Put the text and ingredients onto the card
function updateCardContent(country, foodName) {
    const data = recipes[country][foodName];
    
    // Set Country and Title
    document.getElementById('country-badge').innerText = country;
    document.getElementById('recipe-title').innerText = foodName;
    
    // Clear and fill Ingredients list
    const ingList = document.getElementById('ingredients-list');
    ingList.innerHTML = data.ing.map(item => `<li>${item}</li>`).join('');
    
    // Clear and fill Steps list
    const stepList = document.getElementById('steps-list');
    stepList.innerHTML = data.step.map(step => `<li>${step}</li>`).join('');
}

// 4. Flip Control: Toggles the 3D rotation
function flipCard() {
    const card = document.getElementById('cardInner');
    card.classList.toggle('is-flipped');
}

// 5. Dropdown Selection: If the user picks a specific country manually
function updateSelection() {
    const country = document.getElementById('countrySelect').value;
    const foods = Object.keys(recipes[country]);
    const firstFood = foods[0]; // Show the first recipe of that country
    
    const card = document.getElementById('cardInner');
    card.classList.remove('is-flipped');
    
    setTimeout(() => {
        updateCardContent(country, firstFood);
    }, 200);
}

// 6. Search Filter: Finds countries as you type
function filterCountries() {
    const searchTerm = document.getElementById('countrySearch').value.toLowerCase();
    const select = document.getElementById('countrySelect');
    const allCountries = Object.keys(recipes);
    
    const filtered = allCountries.filter(c => c.toLowerCase().includes(searchTerm));
    
    if (filtered.length > 0) {
        select.innerHTML = filtered.map(c => `<option value="${c}">${c}</option>`).join('');
        updateSelection();
    }
}

// Start the app!
loadRecipes();
