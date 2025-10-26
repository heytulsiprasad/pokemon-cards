export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  order: number;
  is_default: boolean;
  location_area_encounters: string;
  abilities: PokemonAbility[];
  forms: PokemonForm[];
  game_indices: PokemonGameIndex[];
  held_items: PokemonHeldItem[];
  moves: PokemonMove[];
  species: PokemonSpeciesReference;
  sprites: PokemonSprites;
  stats: PokemonStat[];
  types: PokemonType[];
}

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
}

export interface PokemonForm {
  name: string;
  url: string;
  form_name: string;
  form_order: number;
  id: number;
  is_battle_only: boolean;
  is_default: boolean;
  is_mega: boolean;
  order: number;
  pokemon: NamedAPIResource;
  sprites: any; // Simplified for now
  version_group: NamedAPIResource;
  names: Name[];
  form_names: Name[];
}

export interface PokemonGameIndex {
  game_index: number;
  version: NamedAPIResource;
}

export interface PokemonHeldItem {
  item: NamedAPIResource;
  version_details: PokemonHeldItemVersion[];
}

export interface PokemonHeldItemVersion {
  version: NamedAPIResource;
  rarity: number;
}

export interface PokemonMove {
  move: NamedAPIResource;
  version_group_details: PokemonMoveVersion[];
}

export interface PokemonMoveVersion {
  level_learned_at: number;
  move_learn_method: NamedAPIResource;
  order: number | null;
  version_group: NamedAPIResource;
}

export interface PokemonSpeciesReference {
  name: string;
  url: string;
}

export interface PokemonSprites {
  back_default: string | null;
  back_female: string | null;
  back_shiny: string | null;
  back_shiny_female: string | null;
  front_default: string | null;
  front_female: string | null;
  front_shiny: string | null;
  front_shiny_female: string | null;
  other: {
    dream_world: DreamWorldSprites;
    home: HomeSprites;
    'official-artwork': OfficialArtworkSprites;
  };
  versions: any; // Simplified for now
}

export interface DreamWorldSprites {
  front_default: string | null;
  front_female: string | null;
}

export interface HomeSprites {
  front_default: string | null;
  front_female: string | null;
  front_shiny: string | null;
  front_shiny_female: string | null;
}

export interface OfficialArtworkSprites {
  front_default: string | null;
  front_shiny: string | null;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface Name {
  name: string;
  language: NamedAPIResource;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

export interface PokemonSpecies {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: NamedAPIResource;
  pokedex_numbers: PokemonSpeciesDexEntry[];
  egg_groups: NamedAPIResource[];
  color: NamedAPIResource;
  shape: NamedAPIResource;
  evolves_from_species: NamedAPIResource | null;
  evolution_chain: NamedAPIResource;
  habitat: NamedAPIResource | null;
  generation: NamedAPIResource;
  names: Name[];
  pal_park_encounters: PalParkEncounterArea[];
  flavor_text_entries: FlavorText[];
  form_descriptions: Description[];
  genera: Genus[];
  varieties: PokemonSpeciesVariety[];
}

export interface PokemonSpeciesDexEntry {
  entry_number: number;
  pokedex: NamedAPIResource;
}

export interface PalParkEncounterArea {
  base_score: number;
  rate: number;
  area: NamedAPIResource;
}

export interface FlavorText {
  flavor_text: string;
  language: NamedAPIResource;
  version: NamedAPIResource;
}

export interface Description {
  description: string;
  language: NamedAPIResource;
}

export interface Genus {
  genus: string;
  language: NamedAPIResource;
}

export interface PokemonSpeciesVariety {
  is_default: boolean;
  pokemon: NamedAPIResource;
}