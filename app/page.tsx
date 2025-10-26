'use client';

import { useEffect, useMemo, useState } from 'react';
import pokemonApiClient from '@/lib/pokemon-api';
import type { PokemonListResponse } from '@/types/pokemon';
import PokemonSwipeDeck, { type PokemonCard } from '@/components/PokemonSwipeDeck';

function getIdFromUrl(url: string): number {
  const m = url.match(/\/pokemon\/(\d+)\/?$/);
  return m ? Number(m[1]) : 0;
}

function toDisplayName(value: string): string {
  return value
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function toCardList(list: PokemonListResponse | null): Promise<PokemonCard[]> {
  if (!list) return [];

  const cards = await Promise.all(
    list.results.map(async (r) => {
      const id = getIdFromUrl(r.url);
      const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

      try {
        const [pokemon, species] = await Promise.all([
          pokemonApiClient.getPokemon(id),
          pokemonApiClient.getPokemonSpecies(id).catch(() => null),
        ]);

        const statsMap = pokemon.stats.reduce<Record<string, number>>((acc, stat) => {
          acc[stat.stat.name] = stat.base_stat;
          return acc;
        }, {});

        const englishFlavor = species?.flavor_text_entries.find((entry) => entry.language.name === 'en');
        const cleanedFlavor = englishFlavor?.flavor_text
          ? englishFlavor.flavor_text.replace(/\f|\n/g, ' ').replace(/\s+/g, ' ').trim()
          : null;

        const genus = species?.genera.find((entry) => entry.language.name === 'en')?.genus ?? null;

        return {
          id,
          name: r.name,
          image,
          types: pokemon.types.map((t) => t.type.name),
          height: pokemon.height ? pokemon.height / 10 : null,
          weight: pokemon.weight ? pokemon.weight / 10 : null,
          abilities: pokemon.abilities
            .sort((a, b) => a.slot - b.slot)
            .slice(0, 3)
            .map((ability) => toDisplayName(ability.ability.name)),
          category: genus,
          flavorText: cleanedFlavor,
          stats: {
            hp: statsMap.hp ?? null,
            attack: statsMap.attack ?? null,
            defense: statsMap.defense ?? null,
            specialAttack: statsMap['special-attack'] ?? null,
            specialDefense: statsMap['special-defense'] ?? null,
            speed: statsMap.speed ?? null,
          },
        } satisfies PokemonCard;
      } catch (error) {
        console.error(`Failed to hydrate Pokémon card ${id}`, error);
        return {
          id,
          name: r.name,
          image,
          types: [],
          height: null,
          weight: null,
          abilities: [],
          category: null,
          flavorText: null,
          stats: {
            hp: null,
            attack: null,
            defense: null,
            specialAttack: null,
            specialDefense: null,
            speed: null,
          },
        } satisfies PokemonCard;
      }
    })
  );

  return cards;
}

export default function Home() {
  const [offset, setOffset] = useState(0);
  const [list, setList] = useState<PokemonListResponse | null>(null);
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const LIMIT = 20;
  const hasMore = useMemo(() => (list ? cards.length < list.count : true), [cards.length, list]);

  useEffect(() => {
    // initial
    void loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = async () => {
    if (!hasMore && offset !== 0) return;
    try {
      setLoading(true);
      const data = await pokemonApiClient.getPokemonList(LIMIT, offset);
      setList((prev) => (prev ? { ...data, results: [...prev.results, ...data.results] } : data));
      const newCards = await toCardList(data);
      setCards((prev) => [...prev, ...newCards]);
      setOffset((prev) => prev + LIMIT);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch Pokémon list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            PokéDeck
          </h1>
          <p className="text-gray-600 mt-2">Swipe through all Pokémon — powered by @learningpad/api-client</p>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center">
          {loading && cards.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-b-transparent border-indigo-600"></div>
              <p className="mt-3 text-gray-600">Loading PokéDeck…</p>
            </div>
          ) : (
            <PokemonSwipeDeck
              items={cards}
              onDepleted={() => {
                if (hasMore) loadMore();
              }}
            />
          )}

          {!loading && !hasMore && (
            <p className="mt-8 text-gray-500">You’ve reached the end of the Pokédex.</p>
          )}
        </div>
      </div>
    </div>
  );
}
