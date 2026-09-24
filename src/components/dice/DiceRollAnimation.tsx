"use client";

import { useEffect, useState } from "react";

// Animação exibida enquanto a Server Action da rolagem está em andamento
// (isPending do useTransition) — o resultado real vem sempre do servidor
// (ver src/lib/dice.ts), isso aqui é só feedback visual de um d10 "caindo"
// e girando entre números até o resultado de verdade chegar e a tela
// atualizar com a rolagem real no Histórico.
export function DiceRollAnimation({ active }: { active: boolean }) {
  const [face, setFace] = useState(1);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setFace(Math.floor(Math.random() * 10) + 1);
    }, 90);
    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-foreground/70">
      <span
        className="dice-fall flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 border-accent bg-surface text-base font-bold text-accent"
        aria-hidden="true"
      >
        {face === 10 ? "0" : face}
      </span>
      <span>rolando 1D10...</span>
    </div>
  );
}
