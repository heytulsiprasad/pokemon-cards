import { ApiConfig, ApiService } from '@learningpad/api-client';
import { Pokemon, PokemonListResponse, PokemonSpecies } from '@/types/pokemon';

// Initialize the shared ApiConfig exactly once.
// Note: The library's isInitialized() returns true when instance is undefined,
// so rely on getInstance() throwing as the source of truth.
(() => {
  const g = globalThis as any;
  if (g.__POKEMON_API_CONFIG_INITIALIZED__) return;
  try {
    ApiConfig.getInstance();
    g.__POKEMON_API_CONFIG_INITIALIZED__ = true;
    return;
  } catch {
    // Not initialized yet – initialize now
  }
  ApiConfig.initialize({
    services: {
      pokemon: {
        name: 'pokemon',
        baseURL: 'https://pokeapi.co/api/v2',
        timeout: 15000,
      },
    },
    defaultTimeout: 30000,
    defaultHeaders: {
      'Content-Type': 'application/json',
    },
  });
  g.__POKEMON_API_CONFIG_INITIALIZED__ = true;
})();

const service = new ApiService('pokemon');

class PokemonAPIClient {
  async getPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
    return service.get<PokemonListResponse>('pokemon', {
      params: { limit, offset },
    });
  }

  async getPokemon(nameOrId: string | number): Promise<Pokemon> {
    return service.get<Pokemon>(`pokemon/${nameOrId}`);
  }

  async getPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies> {
    return service.get<PokemonSpecies>(`pokemon-species/${nameOrId}`);
  }
}

const pokemonApiClient = new PokemonAPIClient();

export default pokemonApiClient;
