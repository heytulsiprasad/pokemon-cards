"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

export type PokemonCard = {
  id: number;
  name: string;
  image: string;
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
        <p className="text-gray-500 mt-1">Swipe left or right</p>
      </div>
    </motion.div>
  );
}

