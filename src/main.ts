import './style.css'

// DOM Elements
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const errorMessage = document.getElementById("errorMessage");
const loadingSpinner = document.getElementById("loadingSpinner");
const searchResults = document.getElementById("searchResults");
const teamContainer = document.getElementById("teamContainer");
const teamCount = document.getElementById("teamCount");

// Templates
const searchResultTemplate = document.getElementById("searchResultTemplate");
const teamPokemonTemplate = document.getElementById("teamPokemonTemplate");

// State
let team = [];

// Event Listeners
searchButton.addEventListener("click", handleSearch);
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
});

// Search Pokemon
async function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (!searchTerm) return;

    showLoading(true);
    showError("");

    try {
        const pokemon = await fetchPokemon(searchTerm);
        displaySearchResult(pokemon);
    } catch (error) {
        showError("Pokemon not found. Please try another name.");
    } finally {
        showLoading(false);
    }
}

// Fetch Pokemon from API
async function fetchPokemon(name) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) throw new Error("Pokemon not found");

    const data = await response.json();
    return {
        id: data.id,
        name: data.name,
        image: data.sprites.front_default,
        types: data.types.map((type) => type.type.name),
    };
}

// Display Search Result
function displaySearchResult(pokemon) {
    searchResults.innerHTML = "";

    const clone = searchResultTemplate.content.cloneNode(true);

    const img = clone.querySelector(".pokemon-image");
    img.src = pokemon.image;
    img.alt = pokemon.name;

    clone.querySelector(".pokemon-name").textContent = pokemon.name;

    const typesContainer = clone.querySelector(".pokemon-types");
    pokemon.types.forEach((type) => {
        const badge = document.createElement("span");
        badge.className = `type-badge type-${type}`;
        badge.textContent = type;
        typesContainer.appendChild(badge);
    });

    const addButton = clone.querySelector(".add-button");
    addButton.addEventListener("click", () => addToTeam(pokemon));

    searchResults.appendChild(clone);
}

// Add Pokemon to Team
function addToTeam(pokemon) {
    if (team.length >= 6) {
        showError("Team is full! Remove a Pokemon first.");
        return;
    }

    if (team.some((p) => p.id === pokemon.id)) {
        showError("This Pokemon is already on your team!");
        return;
    }

    team.push(pokemon);
    updateTeamDisplay();
    showError("");
}

// Remove Pokemon from Team
function removeFromTeam(pokemonId) {
    team = team.filter((pokemon) => pokemon.id !== pokemonId);
    updateTeamDisplay();
}

// Update Team Display
function updateTeamDisplay() {
    teamContainer.innerHTML = "";
    teamCount.textContent = team.length;

    team.forEach((pokemon) => {
        const clone = teamPokemonTemplate.content.cloneNode(true);

        const img = clone.querySelector(".pokemon-image");
        img.src = pokemon.image;
        img.alt = pokemon.name;

        clone.querySelector(".pokemon-name").textContent = pokemon.name;

        const typesContainer = clone.querySelector(".pokemon-types");
        pokemon.types.forEach((type) => {
            const badge = document.createElement("span");
            badge.className = `type-badge type-${type}`;
            badge.textContent = type;
            typesContainer.appendChild(badge);
        });

        const removeButton = clone.querySelector(".remove-button");
        removeButton.addEventListener("click", () => removeFromTeam(pokemon.id));

        teamContainer.appendChild(clone);
    });
}

// UI Helpers
function showLoading(show) {
    loadingSpinner.classList.toggle("d-none", !show);
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.toggle("d-none", !message);
}
