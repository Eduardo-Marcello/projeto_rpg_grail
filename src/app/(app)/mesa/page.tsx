export default function MesaPage() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-semibold">Mesa de Dados</h1>
      <p className="text-sm text-foreground/70">
        Aqui vão os comandos <code className="rounded bg-background px-1 py-0.5">/teste [tipo]</code>{" "}
        e <code className="rounded bg-background px-1 py-0.5">/atacar</code>,
        calculando Domínio/Disciplina + Via + 1D10 contra o Limiar de
        Dificuldade (p.247-257 do corebook) — chega na Fase 4, puxando os
        atributos reais da sua ficha salva.
      </p>
    </div>
  );
}
