// Pokemon type definition
export type pokemonType = string

export interface Pokemon {
    id: number;
    name: string;
    image: string;
    types: pokemonType[];
}