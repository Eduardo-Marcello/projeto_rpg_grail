import Link from "next/link";
import { Section, SubHeading, Example, RuleTable } from "@/components/howto/Section";

// Resumos e exemplos em paráfrase própria do corebook (nunca parágrafos
// copiados — ver a regra de direitos autorais no CLAUDE.md). Cada seção
// cita as páginas de origem para conferência rápida. Os exemplos usam
// personagens inventados aqui, não os do livro.

const TOC = [
  { id: "resolucao", label: "Sistema de Resolução" },
  { id: "combate", label: "Combate" },
  { id: "saude", label: "Saúde" },
  { id: "sanidade", label: "Sanidade" },
  { id: "magia", label: "Magia" },
];

export default function ComoJogarPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-xl font-semibold">Como Jogar</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Resumo das regras principais do corebook, com exemplos — não substitui o livro, só
          ajuda a lembrar rápido na mesa. Em caso de dúvida, o livro sempre vale mais que este
          resumo.
        </p>
        <nav className="mt-3 flex flex-wrap gap-2 text-xs">
          {TOC.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              className="rounded-md border border-border px-2 py-1 hover:border-accent"
            >
              {t.label}
            </a>
          ))}
        </nav>
      </div>

      <Section id="resolucao" title="Sistema de Resolução" pages="p.244-257">
        <p>
          Sempre que o resultado de uma ação for incerto e importante para a aventura, faça uma
          <strong> Rolagem de Resolução</strong>: some o Domínio (ou Disciplina, se tiver uma
          aplicável) usado, mais a Via associada a esse Domínio, mais 1D10. O mestre define um
          Limiar de Dificuldade antes da rolagem; se o total igualar ou passar o limiar, a ação
          dá certo.
        </p>
        <p className="font-mono text-xs text-foreground/70">Domínio (ou Disciplina) + Via + 1D10 ≥ Limiar de Dificuldade</p>
        <p>
          Se o personagem não tiver pontos no Domínio, ainda pode tentar — só usa a Via e o dado,
          sem o bônus do Domínio.
        </p>

        <SubHeading>Limiar de Dificuldade</SubHeading>
        <RuleTable
          headers={["Dificuldade", "Limiar"]}
          rows={[
            ["Fácil", 8],
            ["Padrão", 11],
            ["Complicada", 14],
            ["Difícil", 17],
            ["Muito Difícil", 20],
            ["Excepcional", 25],
            ["Heroica", 30],
            ["Sobre-humana", 35],
          ]}
        />
        <p>
          O mestre escolhe a dificuldade base da ação e pode subir ou descer níveis conforme as
          circunstâncias (equipamento, clima, ambiente perigoso etc.) — os ajustes se somam.
        </p>

        <SubHeading>Sucesso e falha crítica</SubHeading>
        <p>
          Um <strong>10 natural</strong> no dado exige uma segunda rolagem de confirmação: se sair
          outro 10, é um <strong>sucesso crítico</strong> (o resultado do dado vira 15 para fins de
          cálculo, e ações de combate/magia podem ter efeitos extras). Um <strong>1 natural</strong>{" "}
          funciona do mesmo jeito para <strong>falha crítica</strong> — confirmada com outro 1,
          normalmente dá -5 ou um efeito dramático negativo à escolha do mestre. Se a soma de
          Domínio + Via já superar o limiar sem precisar rolar o dado, o sucesso é automático; se
          for impossível de qualquer forma, a falha é automática.
        </p>

        <SubHeading>Trabalho em equipe e ações contestadas</SubHeading>
        <p>
          Quando vários personagens ajudam na mesma ação, um deles faz a rolagem normalmente e
          soma um 1D10 extra para cada ajudante, ficando com o melhor resultado entre os dados
          rolados. Quando dois personagens disputam algo diretamente (uma queda de braço, uma
          mentira, uma perseguição), os dois rolam e quem tirar o maior resultado vence — empate é
          empate mesmo.
        </p>

        <SubHeading>Teste de Falha</SubHeading>
        <p>
          Quando uma cena ameaça atingir em cheio a Falha de um personagem (ligada à Via com
          pontuação alta — ver Etapa 3 da criação), o mestre pode pedir um Teste: role 1D10 e
          compare com a Via correspondente. Se o resultado <em>superar</em> a Via, o personagem
          resiste à Falha; se não, cede a ela por 1D10 minutos, com -2 em todas as rolagens
          nesse período.
        </p>

        <Example>
          <p>
            Beatriz tenta escalar um paredão coberto de musgo para escapar de um bando de lobos
            da Wyrdness. O mestre define isso como uma ação Complicada (14). Beatriz tem 3 em
            Proezas e 2 em Combatividade (a Via ligada a Proezas), então rola 1D10 e soma 5,
            precisando de 9 ou mais no dado. Ela tira 8 — total 13, abaixo do limiar: falha.
            Como a situação não muda muito entre uma tentativa e outra, o mestre decide que ela
            não pode simplesmente tentar de novo até acertar.
          </p>
        </Example>
      </Section>

      <Section id="combate" title="Combate" pages="p.258-271">
        <p>
          O combate acontece em <strong>Rounds</strong>. Cada Round tem três fases, sempre nessa
          ordem: define-se a ordem de ação, cada um anuncia sua Postura de Combate, e então as
          ações são resolvidas.
        </p>

        <SubHeading>Ordem de ação</SubHeading>
        <p>
          Cada combatente rola <strong>Velocidade + 1D10</strong>; quem tira o maior total age
          primeiro. Em caso de empate, vence quem tiver a Velocidade mais alta; persistindo o
          empate, rola-se o dado de novo.
        </p>

        <SubHeading>Posturas de Combate</SubHeading>
        <p>
          Do último para o primeiro na ordem de ação, cada um anuncia sua postura (isso deixa os
          mais rápidos decidirem sabendo o que os outros vão fazer):
        </p>
        <RuleTable
          headers={["Postura", "Efeito"]}
          rows={[
            ["Padrão", "Ataque e Defesa normais."],
            ["Ofensiva", "Potencial de Combate soma no Ataque e é subtraído da Defesa."],
            ["Defensiva", "Potencial de Combate soma na Defesa e é subtraído do Ataque."],
            [
              "Movimento",
              "Move o dobro do normal, não ataca; Potencial soma na Defesa. Boa para fugir.",
            ],
          ]}
        />

        <SubHeading>Atacar e causar dano</SubHeading>
        <p className="font-mono text-xs text-foreground/70">
          Ataque = Combatividade + Domínio/Disciplina de combate + modificador de Postura + 1D10
        </p>
        <p>
          Se o Ataque superar a Defesa do alvo, o golpe acerta. O dano é:{" "}
          <span className="font-mono text-xs">
            Ataque + Dano da arma − Defesa do alvo − Proteção do alvo
          </span>
          . Cada ponto de dano marca uma caixa na Condição de Saúde (ver seção Saúde). Um único
          golpe de 20+ de dano mata na hora.
        </p>

        <SubHeading>Aparar, Liderar e outras ações</SubHeading>
        <p>
          Em vez de atacar, um personagem em Postura Padrão ou Defensiva pode tentar{" "}
          <strong>Aparar</strong>: gasta a própria ação para rolar Combatividade + Combate Corpo a
          Corpo + Postura + 1D10 contra o Ataque do agressor; vencendo, não sofre dano nesse
          Round. Um personagem com o Domínio Liderança pode gastar a ação para fazer uma rolagem
          de Liderança (Padrão, 11); com sucesso, todos os aliados num raio de 9m ganham um bônus
          (+1 a +4 conforme o resultado) nas rolagens pelos próximos 2 Rounds — só uma Liderança
          pode estar ativa por vez.
        </p>

        <SubHeading>Situações especiais</SubHeading>
        <p>
          <strong>Combate à distância</strong> soma/subtrai modificadores (mirar +2 acumulativo,
          alvo em movimento -2, alvo em disparada -5, fora de alcance -5, obstáculo no caminho -1
          cada). <strong>Combate montado</strong> dá +2 no Ataque contra alvos a pé, permite
          investida (+3 de dano no primeiro Round, +4 com lança) e só derruba o cavaleiro com 5+
          de dano seguido de uma rolagem Difícil (17) de Combate Montado.{" "}
          <strong>Contra monstros</strong>, pode-se usar o Domínio Monstros no lugar do Domínio de
          combate normal (com Consciência no lugar de Combatividade). Lutar <strong>às cegas</strong>{" "}
          dá -4 em ações que dependem de visão. Um <strong>ataque surpresa</strong> bem-sucedido
          concede um Round grátis sem chance de revide; um <strong>ataque pelas costas</strong>{" "}
          dá +2 na rolagem. Para <strong>fugir</strong>, escolha a Postura de Movimento e role
          Proezas contra o Ataque do oponente.
        </p>

        <Example>
          <p>
            Talan enfrenta um saqueador. Talan tem Velocidade 6 e rola 4 (total 10); o saqueador
            tem Velocidade 5 e rola 8 (total 13) — o saqueador age primeiro. Ele escolhe Postura
            Ofensiva (Potencial 2): Ataque base 9 vira 11. Rola 1D10 e tira 6, total 17. A Defesa
            de Talan é 12 (ele está em Postura Padrão): é atingido. O dano é 17 (Ataque) + 3 (arma)
            − 12 (Defesa) − 0 (sem armadura) = 8 pontos — Talan marca 8 caixas na Condição de
            Saúde.
          </p>
        </Example>
      </Section>

      <Section id="saude" title="Saúde" pages="p.272-279">
        <p>
          A Condição de Saúde tem 5 faixas — Bem, Razoável, Ruim, Crítico e Agonia — totalizando
          19 caixas na ficha oficial (5/5/4/4/1). A cada ponto de dano sofrido, marca-se uma
          caixa a partir da esquerda. A partir de &ldquo;Razoável&rdquo; o personagem sofre -1 em
          todas as rolagens; -2 em &ldquo;Ruim&rdquo;; -3 em &ldquo;Crítico&rdquo; — as
          penalidades não se acumulam entre si, vale só a da faixa atual.
        </p>
        <p className="text-xs text-foreground/60">
          O texto corrido deste capítulo (p.272) fala em &ldquo;17 caixas por padrão&rdquo;,
          divergindo do total de 19 caixas da ficha impressa (p.390). Este app segue a ficha
          impressa — ver o campo de Saúde na sua ficha.
        </p>

        <SubHeading>Agonia e morte</SubHeading>
        <p>
          Quando a última caixa (Agonia) é marcada, o personagem desmaia e não pode agir. Outro
          personagem precisa de uma rolagem Difícil (17) de Cura para estabilizá-lo em até 10
          minutos — com sucesso, ele acorda em 1D10 horas já em condição Crítica; sem
          intervenção, ou se a rolagem falhar, o personagem morre. Passar um dia inteiro em
          condição Crítica sem cuidados médicos exige uma rolagem Complicada (14) de Vigor, sob
          pena de piorar e morrer.
        </p>

        <SubHeading>Doenças e venenos</SubHeading>
        <RuleTable
          headers={["Virulência", "Dano/dia", "Recuperação natural", "Limiar para curar"]}
          rows={[
            ["Fraca", "1 ponto", "5 dias", "Padrão (11)"],
            ["Branda", "2 pontos", "10 dias", "Complicada (14)"],
            ["Maligna", "3 pontos", "15 dias", "Difícil (17)"],
            ["Mortal", "4 pontos", "20 dias", "Muito Difícil (20)"],
          ]}
        />
        <p>
          Ao se expor a uma doença ou veneno, faz-se uma rolagem de Vigor contra o Limiar da
          Virulência; sucesso evita o contágio.
        </p>

        <SubHeading>Curar</SubHeading>
        <p>
          Uma rolagem Padrão (11) de Cura, feita logo após o ferimento, remove 1 caixa de dano (2
          com a Disciplina certa, como Cirurgia) — só uma vez por dia por personagem, exceto cura
          mágica. Descansar também ajuda: com uma rolagem Padrão (11) de Vigor, recupera-se 1
          ponto por ficar de repouso e mais 1 por uma noite inteira de sono em boas condições.
        </p>
      </Section>

      <Section id="sanidade" title="Sanidade" pages="p.280-291">
        <p>
          Regra opcional — a mesa decide se quer usá-la. Representa o desgaste psicológico de
          viver em Avalon. Quando algo ameaça o equilíbrio mental de um personagem, o mestre pode
          pedir uma <strong>rolagem de Resistência Mental</strong> (Padrão, 11, ajustada conforme a
          situação: testemunhar a Wyrdness +1, encarar um Fore-dweller +3, estar perto de um
          líder inspirador -1 a -3, etc.). Falhar causa um <strong>Torment</strong> (fora de
          combate) ou um <strong>Rout</strong> (em combate) — sorteado num d10 na tabela
          correspondente. Cada personagem só pode sofrer 1 Torment e 1 Rout por vez.
        </p>

        <SubHeading>Torments (fora de combate)</SubHeading>
        <p>
          Efeitos como Angústia, Pesadelos ou Fuga — a maioria dura um tempo fixo (minutos, horas
          ou semanas) e pode ser tratada com uma nova rolagem de Resistência Mental, com magia,
          descansando com apoio de um aliado (rolagem de Compaixão), ou gastando 2 Pontos de
          Sobrevivência para encerrar na hora.
        </p>

        <SubHeading>Routs (em combate)</SubHeading>
        <p>
          Efeitos como ficar Enfurecido, Desarmado ou Paralisado, que duram enquanto a batalha
          continuar. Podem ser encerrados com uma rolagem de Resistência Mental (com -3 de
          penalidade), com o apoio de Inspiração de um aliado, com magia, ou gastando 2 Pontos de
          Sobrevivência.
        </p>
        <p className="text-xs text-foreground/60">
          A lista completa de Torments e Routs (com o efeito de cada resultado do d10) está
          disponível direto na sua ficha, na seção de Sanidade.
        </p>
      </Section>

      <Section id="magia" title="Magia" pages="p.310-337">
        <p>
          Qualquer personagem pode tentar entender um efeito ou objeto mágico com uma rolagem de{" "}
          <span className="font-mono text-xs">Razão + Magia + 1D10</span>, mesmo sem ser um mago.
          Mas ninguém desperta para a magia sozinho — o primeiro nível na Disciplina de Magia só
          pode vir de ajuda externa (um mestre, um livro, um encontro com algo maior), nunca só
          gastando Experiência por conta própria.
        </p>

        <SubHeading>As quatro formas de magia</SubHeading>
        <p>
          Ao despertar, o jogador escolhe uma entre quatro Disciplinas — a escolha é permanente e
          não dá pra combinar duas formas de magia num mesmo personagem. Cada forma tem uma Via
          associada (usada no lugar de Razão a partir daí) e um bônus (&ldquo;dádiva&rdquo;)
          único:
        </p>
        <RuleTable
          headers={["Forma", "Via", "Dádiva (resumo)"]}
          rows={[
            [
              "Baixa Magia (ferais)",
              "Consciência",
              "Sucesso crítico já a partir de 8 no dado.",
            ],
            [
              "Druidismo",
              "Convicção",
              "+2 para conjurar perto de mortes recentes (campo de batalha, cemitério).",
            ],
            [
              "Feitiçaria (magos)",
              "Razão",
              "Pode gastar 1 PM extra para rolar 2D10 e ficar com o melhor.",
            ],
            [
              "Magia da Wyrdness (arcanistas)",
              "Criatividade",
              "Rola 2D10: no 2º, 1-3 consome Vida (de si ou de uma criatura próxima) em vez de Magia.",
            ],
          ]}
        />
        <p className="font-mono text-xs text-foreground/70">
          Rolagem de Magia (já desperto) = Disciplina + Via associada + 1D10
        </p>

        <SubHeading>Pontos de Magia</SubHeading>
        <p>
          Ao adquirir a primeira Disciplina de Magia, o personagem ganha uma reserva de Pontos de
          Magia — o máximo depende do nível da Disciplina:
        </p>
        <RuleTable
          headers={["Nível da Disciplina", "PM máximos"]}
          rows={[
            ["6-7", 6],
            ["8-9", 7],
            ["10-11", 8],
            ["12-13", 9],
            ["14-15", 10],
          ]}
        />

        <SubHeading>Conjurar um feitiço</SubHeading>
        <p>
          Cada feitiço custa PM e exige uma rolagem de Magia contra Dificuldade Padrão (11) por
          padrão — ajustada pelo ambiente (até +6 em combate), número de alvos, alcance e tempo de
          conjuração desejados (a tabela completa está no livro, p.324). Gastando 1 PM extra
          (&ldquo;Sobrecarga&rdquo;), a Dificuldade cai 3 pontos. Sucesso crítico permite dobrar
          um efeito do feitiço, cancelar seu custo, torná-lo imune a dissipação, ou inspirar os
          aliados (+2 na próxima ação). Falha crítica causa um entre: custo dobrado, alvo errado,
          o mago fica atordoado por 2 Rounds, ou a energia é roubada por outra pessoa.
        </p>
        <p>
          Qualquer mago desperto pode tentar <strong>dissipar</strong> um feitiço alheio (gastando
          os mesmos PM e rolando contra a mesma Dificuldade), e qualquer criatura pode tentar{" "}
          <strong>resistir</strong> a um feitiço com uma rolagem de Vigor (reduz o dano à metade)
          ou Resistência Mental (anula efeitos mentais), também contra a Dificuldade do feitiço.
        </p>

        <SubHeading>Recuperar Pontos de Magia</SubHeading>
        <p>
          Descansar uma noite inteira recupera 2 PM automaticamente. Meditar por 1h ou mais e
          rolar Magia (a Dificuldade varia por local e forma de magia, p.337) recupera 1 PM por
          hora de meditação bem-sucedida (dobrado com um 10 natural). Um local de poder recupera 1
          PM por hora sem precisar rolar nada. Drenar uma criatura mágica recém-abatida recupera 1
          a 3 PM, uma vez por criatura.
        </p>

        <Example>
          <p>
            Talan (arcanista de Magia da Wyrdness, Disciplina 6, então 6 PM no máximo) quer lançar
            um feitiço de 2 PM contra um inimigo, em plena luta (+6 na Dificuldade, que vai de 11
            para 17). Ele gasta 1 PM extra de Sobrecarga para baixar a Dificuldade para 14. Rola
            Criatividade + Magia da Wyrdness + 1D10 e tira 15 no total: sucesso. No segundo dado
            (o da Magia da Wyrdness, que decide a fonte do custo), sai um 2 — em vez de gastar
            Pontos de Magia, o feitiço drena Vida de uma criatura próxima.
          </p>
        </Example>
      </Section>

      <p className="text-xs text-foreground/50">
        Faltam aqui, por ora: Posturas de Combate calculadas automaticamente na ficha, lista
        completa de feitiços por forma de magia, e o sistema de Ascensão/Desgraça (Character
        Advancement, p.210-231) — para essas regras, consulte o corebook diretamente. Voltar para{" "}
        <Link href="/ficha" className="text-accent underline">
          suas fichas
        </Link>
        .
      </p>
    </div>
  );
}
