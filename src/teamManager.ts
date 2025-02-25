import { Pokemon } from "./types.ts";

// State
export let team: Pokemon[] = [];

// Add Pokemon to Team
export function addToTeam(pokemon: Pokemon, showErrorFn: (message: string) => void): void {
    if (team.length >= 6) {
        showErrorFn("Team is full! Remove a Pokemon first.");
        return;
    }

    if (team.some((p) => p.id === pokemon.id)) {
        showErrorFn("This Pokemon is already on your team!");
        return;
    }

    team.push(pokemon);
    showErrorFn("");
}

// Remove Pokemon from Team
export function removeFromTeam(pokemonId: number): void {
    team = team.filter((pokemon) => pokemon.id !== pokemonId);
}