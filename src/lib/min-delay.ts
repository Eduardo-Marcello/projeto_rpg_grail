// Garante que uma Promise (ex: uma Server Action) só resolve depois de um
// tempo mínimo — usado na Mesa de Dados para a animação do d10 ficar
// visível mesmo quando o servidor responde rápido demais (dev local, ou
// uma rolagem simples), em vez de piscar e sumir.
export async function withMinDelay<T>(promise: Promise<T>, minMs: number): Promise<T> {
  const [result] = await Promise.all([
    promise,
    new Promise((resolve) => setTimeout(resolve, minMs)),
  ]);
  return result;
}
