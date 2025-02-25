import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Pokemon } from './types';
import { fetchPokemon } from "./api.ts";
import { team, addToTeam, removeFromTeam } from "./teamManager.ts"

// DOM Elements
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const searchButton = document.getElementById("searchButton") as HTMLButtonElement;
const errorMessage = document.getElementById("errorMessage") as HTMLDivElement;
const loadingSpinner = document.getElementById("loadingSpinner") as HTMLDivElement;
const searchResults = document.getElementById("searchResults") as HTMLDivElement;
const teamContainer = document.getElementById("teamContainer") as HTMLDivElement;
const teamCount = document.getElementById("teamCount") as HTMLSpanElement;

// Templates
const searchResultTemplate = document.getElementById("searchResultTemplate") as HTMLTemplateElement;
const teamPokemonTemplate = document.getElementById("teamPokemonTemplate") as HTMLTemplateElement;

// Event Listeners
searchButton.addEventListener("click", () => {
    void handleSearch(); // Using void operator to explicitly ignore the promise
});

searchInput.addEventListener("keypress", (e: KeyboardEvent) => {
    if (e.key === "Enter") void handleSearch(); // Same fix here
});

// Search Pokemon
async function handleSearch(): Promise<void> {
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

// Display Search Result
function displaySearchResult(pokemon: Pokemon): void {
    searchResults.innerHTML = "";

    const clone = searchResultTemplate.content.cloneNode(true) as DocumentFragment;

    // Type assertions that tell TypeScript these elements definitely exist
    const img = clone.querySelector(".pokemon-image") as HTMLImageElement;
    img.src = pokemon.image;
    img.alt = pokemon.name;

    const nameElement = clone.querySelector(".pokemon-name") as HTMLHeadingElement;
    nameElement.textContent = pokemon.name;

    const typesContainer = clone.querySelector(".pokemon-types") as HTMLDivElement;
    pokemon.types.forEach((type) => {
        const badge = document.createElement("span");
        badge.className = `type-badge type-${type}`;
        badge.textContent = type;
        typesContainer.appendChild(badge);
    });

    const addButton = clone.querySelector(".add-button") as HTMLButtonElement;
    addButton.addEventListener("click", () => {
        addToTeam(pokemon, showError);
        updateTeamDisplay();
    });

    searchResults.appendChild(clone);
}

// Update Team Display
function updateTeamDisplay(): void {
    teamContainer.innerHTML = "";
    teamCount.textContent = team.length.toString();

    team.forEach((pokemon) => {
        const clone = teamPokemonTemplate.content.cloneNode(true) as DocumentFragment;

        const img = clone.querySelector(".pokemon-image") as HTMLImageElement;
        img.src = pokemon.image;
        img.alt = pokemon.name;

        const nameElement = clone.querySelector(".pokemon-name") as HTMLHeadingElement;
        nameElement.textContent = pokemon.name;

        const typesContainer = clone.querySelector(".pokemon-types") as HTMLDivElement;
        pokemon.types.forEach((type) => {
            const badge = document.createElement("span");
            badge.className = `type-badge type-${type}`;
            badge.textContent = type;
            typesContainer.appendChild(badge);
        });

        const removeButton = clone.querySelector(".remove-button") as HTMLButtonElement;
        removeButton.addEventListener("click", () => {
            removeFromTeam(pokemon.id);
            updateTeamDisplay();
        });

        teamContainer.appendChild(clone);
    });
}

// UI Helpers
function showLoading(show: boolean): void {
    loadingSpinner.classList.toggle("d-none", !show);
}

function showError(message: string): void {
    errorMessage.textContent = message;
    errorMessage.classList.toggle("d-none", !message);
}
