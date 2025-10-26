'use client';

import { useEffect, useMemo, useState } from 'react';
import pokemonApiClient from '@/lib/pokemon-api';
import type { PokemonListResponse } from '@/types/pokemon';
import PokemonSwipeDeck, { type PokemonCard } from '@/components/PokemonSwipeDeck';

function getIdFromUrl(url: string): number {
  const m = url.match(/\/pokemon\/(\d+)\/?$/);
  return m ? Number(m[1]) : 0;
}

function toCardList(list: PokemonListResponse | null): PokemonCard[] {
  if (!list) return [];
  return list.results.map((r) => {
    const id = getIdFromUrl(r.url);
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    return { id, name: r.name, image };
  });
}

export default function Home() {
  const [offset, setOffset] = useState(0);
  const [list, setList] = useState<PokemonListResponse | null>(null);
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const LIMIT = 50;
  const hasMore = useMemo(() => (list ? cards.length < list.count : true), [cards.length, list]);

  useEffect(() => {
    // initial
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = async () => {
    if (!hasMore && offset !== 0) return;
    try {
      setLoading(true);
      const data = await pokemonApiClient.getPokemonList(LIMIT, offset);
      setList((prev) => (prev ? { ...data, results: [...prev.results, ...data.results] } : data));
      const newCards = toCardList(data);
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
