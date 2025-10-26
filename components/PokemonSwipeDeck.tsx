"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

const TYPE_STYLES: Record<string, string> = {
  bug: "bg-lime-500/15 text-lime-700 border-lime-400/40",
  dark: "bg-neutral-800/20 text-neutral-100 border-neutral-500/60",
  dragon: "bg-indigo-500/20 text-indigo-200 border-indigo-400/60",
  electric: "bg-yellow-300/25 text-yellow-800 border-yellow-400/60",
  fairy: "bg-pink-300/25 text-pink-800 border-pink-400/60",
  fighting: "bg-orange-600/20 text-orange-100 border-orange-500/60",
  fire: "bg-orange-500/20 text-orange-900 border-orange-500/60",
  flying: "bg-sky-400/20 text-sky-900 border-sky-400/60",
  ghost: "bg-purple-700/25 text-purple-100 border-purple-500/60",
  grass: "bg-emerald-400/20 text-emerald-900 border-emerald-400/60",
  ground: "bg-amber-700/25 text-amber-100 border-amber-500/60",
  ice: "bg-cyan-300/25 text-cyan-900 border-cyan-400/60",
  normal: "bg-slate-200/40 text-slate-700 border-slate-300/70",
  poison: "bg-purple-500/20 text-purple-900 border-purple-500/60",
  psychic: "bg-fuchsia-500/20 text-fuchsia-900 border-fuchsia-500/60",
  rock: "bg-yellow-800/25 text-yellow-100 border-yellow-700/60",
  steel: "bg-gray-400/20 text-gray-900 border-gray-400/60",
  water: "bg-blue-400/20 text-blue-900 border-blue-500/60",
};

function getTypeClass(type: string) {
  return TYPE_STYLES[type.toLowerCase()] ?? "bg-gray-100 text-gray-700 border-gray-200";
}

export type PokemonCard = {
  id: number;
  name: string;
  image: string;
  types: string[];
  height: number | null; // in meters
  weight: number | null; // in kilograms
  abilities: string[];
  category: string | null;
  flavorText: string | null;
  stats: {
    hp: number | null;
    attack: number | null;
    defense: number | null;
    specialAttack: number | null;
    specialDefense: number | null;
    speed: number | null;
  };
};

type Props = {
  items: PokemonCard[];
  onSwipe?: (item: PokemonCard, direction: "left" | "right") => void;
  onDepleted?: () => void;
};

export default function PokemonSwipeDeck({ items, onSwipe, onDepleted }: Props) {
  const [index, setIndex] = useState(items.length - 1);

  // Reset index when items change in size
  const topIndex = useMemo(() => items.length - 1, [items.length]);
  if (index > topIndex) {
    setIndex(topIndex);
  }

  const handleSwipe = useCallback(
    (dir: "left" | "right") => {
      if (index < 0) return;
      const current = items[index];
      onSwipe?.(current, dir);
      const next = index - 1;
      setIndex(next);
      if (next < 0) {
        onDepleted?.();
      }
    },
    [index, items, onSwipe, onDepleted]
  );

  const active = items[index];
  const next = items[index - 1];

  return (
    <div className="relative mx-auto w-full max-w-md h-[520px]">
      {/* Background gradient blob */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-100 via-white to-pink-100 rounded-3xl" />

      {/* Next card (peeking) */}
      {next ? (
        <motion.div
          key={`peek-${next.id}`}
          className="absolute inset-4 rounded-3xl shadow-lg bg-white/60 backdrop-blur-sm border border-white/50"
          initial={{ scale: 0.95, y: 10, opacity: 0.6 }}
          animate={{ scale: 0.98, y: 6, opacity: 0.85 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
        />
      ) : null}

      {/* Active card */}
      <AnimatePresence>
        {active ? (
          <SwipeCard key={`card-${active.id}`} item={active} onDecision={handleSwipe} />
        ) : (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-800">No more Pokémon</h3>
              <p className="text-gray-500 mt-2">Fetching more…</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute -bottom-14 left-0 right-0 flex items-center justify-center gap-5">
        <button
          onClick={() => handleSwipe("left")}
          className="h-12 w-12 rounded-full bg-white shadow-md border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 transition"
          aria-label="Nope"
        >
          ✕
        </button>
        <button
          onClick={() => handleSwipe("right")}
          className="h-14 w-14 rounded-full bg-pink-500 shadow-lg text-white font-semibold hover:bg-pink-600 active:scale-95 transition"
          aria-label="Like"
        >
          ❤
        </button>
      </div>
    </div>
  );
}

function SwipeCard({
  item,
  onDecision,
}: {
  item: PokemonCard;
  onDecision: (dir: "left" | "right") => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 0, 250], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [50, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-120, -50], [1, 0]);
  const statEntries = [
    { label: "HP", value: item.stats.hp },
    { label: "Attack", value: item.stats.attack },
    { label: "Defense", value: item.stats.defense },
    { label: "Sp. Atk", value: item.stats.specialAttack },
    { label: "Sp. Def", value: item.stats.specialDefense },
    { label: "Speed", value: item.stats.speed },
  ];
  const maxStatValue = 255;

  const formatDimension = (value: number | null, suffix: string) =>
    value != null ? `${value.toFixed(1)} ${suffix}` : "—";

  const flavorText = item.flavorText ?? "Swipe right to add this Pokémon to your party, or swipe left to pass.";

  return (
    <motion.div
      className="absolute inset-0 m-4 rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        const velocity = info.velocity.x;
        const offset = info.offset.x;
        const threshold = 160;
        if (offset > threshold || velocity > 800) onDecision("right");
        else if (offset < -threshold || velocity < -800) onDecision("left");
      }}
      initial={{ scale: 0.98, y: 10, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
    >
      <div className="relative h-64 bg-gradient-to-br from-indigo-50 to-pink-50">
        {/* Labels */}
        <motion.div
          className="absolute top-4 left-4 px-3 py-1 rounded-md border-2 border-green-500 text-green-600 font-bold"
          style={{ opacity: likeOpacity }}
        >
          LIKE
        </motion.div>
        <motion.div
          className="absolute top-4 right-4 px-3 py-1 rounded-md border-2 border-rose-500 text-rose-600 font-bold"
          style={{ opacity: nopeOpacity }}
        >
          NOPE
        </motion.div>

        <img
          src={item.image}
          alt={item.name}
          className="absolute inset-0 m-auto h-60 w-60 object-contain drop-shadow-xl"
          draggable={false}
        />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="capitalize text-2xl font-bold text-gray-900">{item.name}</h3>
          <span className="text-gray-500 font-semibold">#{item.id}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {item.types.length ? (
            item.types.map((type) => (
              <span
                key={`${item.id}-${type}`}
                className={`px-3 py-1 rounded-full text-sm font-semibold border capitalize ${getTypeClass(type)}`}
              >
                {type}
              </span>
            ))
          ) : (
            <span className="px-3 py-1 rounded-full text-sm font-semibold border bg-gray-100 text-gray-700 border-gray-200">
              Unknown type
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mt-4 italic leading-relaxed">{flavorText}</p>

        <div className="mt-5 grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="text-xs uppercase tracking-wide text-gray-400">Height</span>
            <p className="font-semibold text-gray-800">{formatDimension(item.height, "m")}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wide text-gray-400">Weight</span>
            <p className="font-semibold text-gray-800">{formatDimension(item.weight, "kg")}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wide text-gray-400">Category</span>
            <p className="font-semibold text-gray-800">{item.category ?? "—"}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wide text-gray-400">Abilities</span>
            <p className="font-semibold text-gray-800">
              {item.abilities.length ? item.abilities.join(", ") : "—"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <span className="text-xs uppercase tracking-wide text-gray-400">Battle Stats</span>
          <div className="mt-2 space-y-2">
            {statEntries.map(({ label, value }) => {
              const progress = value != null ? Math.min(value / maxStatValue, 1) * 100 : 0;
              return (
                <div key={`${item.id}-${label}`}>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="font-medium text-gray-700">{label}</span>
                    <span className="font-semibold text-gray-800">{value ?? "—"}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-pink-400 to-orange-400"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-gray-300">
          Swipe left to pass · Swipe right to collect
        </div>
      </div>
    </motion.div>
  );
}
