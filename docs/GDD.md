# BASE KWANZA V2 — Treinador de Missão Lunar

**GDD curto — Fase 0**
Versão 0.1 · 12 de novembro de 2026 · Estado: **para validação**
NASA Space Apps Challenge 2026 · Desafio “Build a Junior Astronaut Mission Trainer”
Equipa angolana de 6 pessoas · 48 horas

---

## 0. Resumo executivo

**BASE KWANZA V2** é um jogo web 2D, em português, sobre uma base lunar no Polo Sul. O jogador comanda quatro astronautas, gere quatro recursos e toma decisões sob pressão. A ciência não é um questionário no fim: é a regra que faz o jogo funcionar.

O jogador só cumpre a missão se perceber, na prática, três ideias:

1. **Porque é que os painéis solares falham na sombra** — no Polo Sul o Sol é rasante e o relevo cria sombras longas.
2. **O que é uma tempestade solar** — partículas energéticas do Sol que chegam à Lua e obrigam a tripulação a abrigar-se.
3. **Porque é que o gelo lunar importa** — é água para beber, oxigénio, proteção contra radiação e, no futuro, combustível.

Cada decisão segue sempre o mesmo ciclo:

> **dado real da NASA → decisão do jogador → consequência no sistema → porquê (≤2 frases) → conceito no Diário do Astronauta**

O jogo não tem backend, login, 3D nem multijogador. É uma PWA mobile-first, testável, com o motor de jogo separado da interface.

---

## 1. Visão, pilares e regras de design

### 1.1 Pilares (por ordem de prioridade)

| Prioridade | Pilar | O que significa na prática |
|---|---|---|
| 1 | **Aprendizagem medida** | O jogador toma decisões, vê consequências e desbloqueia conceitos. O Índice de Conhecimento e o pós-teste opcional medem a aprendizagem. |
| 2 | **Ciência verificada** | Nenhum número inventado. Cada valor tem `{valor, tipo, fonte, estado}`. O que não estiver validado fica marcado **“a validar”**. |
| 3 | **Jogabilidade** | Recursos, mapa, construção, EVAs, tempestades e crises com escolhas difíceis. Sem a ciência, o jogo não funciona; sem jogo, a ciência não se aprende. |

### 1.2 Regras de design

- **Uma ideia nova por ecrã.** Frases curtas. Sem paredes de texto.
- **Nada de quiz no núcleo.** As decisões têm consequências simuladas; o único questionário é o pós-teste opcional.
- **Nenhuma opção é gratuita.** Cada escolha tem pelo menos uma vantagem e um custo.
- **A derrota ensina.** O ecrã final explica a causa científica, não apenas “perdeste”.
- **O jogador pode discordar da ciência — e ver o resultado.** O jogo mostra o modelo, não impõe uma resposta.
- **Mobile-first.** Desenhado para 360×640 px; o desktop é uma melhoria, não o alvo.
- **Sem dados inventados.** Em caso de dúvida, o valor é abstrado, marcado como simplificação e listado em `/docs/validacao-ciencia.md`.

### 1.3 O que fica fora do âmbito

Backend, contas, multijogador, 3D, realidade aumentada, física orbital real, ingestão de dados NASA em tempo real, tradução completa para inglês, vozes, anúncios e analytics externos. O jogo é uma simplificação educativa, não um simulador de engenharia.

---

## 2. Público, tom e acessibilidade

**Público:** jovens dos 14 aos 25 anos, em Angola e nos países de língua portuguesa. Sem conhecimento prévio de astronomia. Também deve funcionar para famílias e escolas.

**Tom:** esperançoso, rigoroso e direto. O jogador não é um super-herói; é um comandante que aprende a ouvir a ciência. Há humor seco nos relatórios da base, mas nunca se goza com a ciência ou com a tripulação.

**Exemplos locais:** a energia solar em Angola (muitas horas de Sol, mas também poeira e sombras) serve de ponte para a energia solar na Lua. A gestão de água em zonas secas de Angola liga-se à reciclagem de água da ECLSS. A ideia não é comparar ambientes, mas mostrar que os mesmos princípios — luz, sombra, água, radiação — aparecem nos dois sítios.

**Acessibilidade (alvo WCAG 2.2 AA):**

- contraste mínimo 4,5:1; nunca usar só cor para comunicar estado (ícone + texto);
- navegação por teclado e leitor de ecrã; mapa com alternativa textual (lista de tiles e pontos de interesse);
- alvos táteis ≥44×44 px;
- `prefers-reduced-motion` respeitado;
- decisões por turnos, sem cronómetros em tempo real;
- texto redimensionável; números com formato pt-AO (vírgula decimal, espaço nos milhares);
- áudio desligado por defeito, com botão de ligar/desligar.

---

## 3. Fantasia central e história

**Ano 2026.** Angola junta-se à geração Artemis. A primeira missão lunar angolana estabelece a **Base Kwanza** perto do Polo Sul. A base é pequena: um habitat, quatro astronautas e margem para poucos módulos. A missão é provar que é possível viver e trabalhar na Lua com o que existe no local — luz, gelo e regolito.

O jogador é o **comandante de missão em terra**, ligado à base por um canal de dados com atraso. Vê o mapa, os recursos e o estado da tripulação. Não controla cada passo; toma decisões e define prioridades. A base responde.

**A tripulação:**

| Nome | Papel | Especialidade | Bónus de jogo (provisório) |
|---|---|---|---|
| **Ngola** | Engenheira de sistemas | Energia, estruturas, reparações | Reparações custam −20% de Energia; painéis solares +10% de produção. |
| **Kiala** | Médico | Saúde, radiação, EVAs médicas | Tratamentos +20% eficazes; dose de radiação −10%. |
| **Zeca** | Botânico | Estufa, alimentos, ciclo da água | Estufa +20% de Alimentos; risco de falha de cultura −10%. |
| **Luzia** | Geóloga | Terreno, gelo, EVAs científicas | EVAs de gelo +1 amostra; penalização de inclinação −20%. |

Os bónus são **valores de design**, não dados científicos. Servem para dar identidade e função a cada astronauta. Todos os valores estão marcados **“a validar”** em `/docs/validacao-ciencia.md`.

**Estado individual de cada astronauta:**

- **Saúde** 0–100. A 0, o astronauta morre. “Astronauta vivo” = saúde > 0.
- **Dose de radiação** 0–100. Acumula em EVAs, tempestades e falhas de proteção.
- **Fadiga** 0–100. Aumenta com trabalho e EVAs; diminui com descanso.

A morte é permanente. Se um especialista morre, as tarefas da sua área ficam mais caras e mais arriscadas. Isto dá peso às decisões sem transformar o jogo numa contagem de vidas.

---

## 4. Loop de jogo

### 4.1 Estrutura da missão

| Cenário | Duração | Dias de decisão | Objetivo principal |
|---|---|---|---|
| **A — Borda de cratera** | 14 dias | 8–10 | Provar a sustentabilidade da base: 4 astronautas vivos, Vida ≥50, pelo menos 1 painel solar e 1 estufa operacionais no fim. |
| **B — Mons Mouton Plateau** | 21 dias | 10–12 | Estabelecer uma rota logística: completar 3 EVAs a pontos de interesse e manter pelo menos 2 astronautas vivos. |
| **C — Cratera Amundsen** | 30 dias | 12–15 | Extrair água: construir o extrator até ao dia 20 e acumular 30 unidades de água até ao dia 30, com pelo menos 2 astronautas vivos. |

**Simplificação assumida:** a missão C dura 30 dias, aproximadamente um dia solar lunar (29,53 dias terrestres). O jogo comprime o tempo: só os **dias de decisão** são jogados em detalhe; os **dias de rotina** são simulados automaticamente com um resumo. Isto mantém uma sessão de 10–15 minutos sem perder a escala de um mês lunar.

**Turno = 1 dia de missão.** O ciclo de luz/sombra avança ao longo dos dias. O jogador vê o ângulo do Sol e a previsão de luz para os próximos 3 dias.

### 4.2 Ecrãs

1. **Início** — história, “Começar treino”, “Como jogar”, “Real vs. Simplificação”, idioma.
2. **Escolha do local** — três cartões com dados reais simplificados (luz, gelo, terreno, radiação), missão, dificuldade e efeitos iniciais. Fonte visível em cada cartão.
3. **Preparação da base** — escolha de um kit de carga, colocação dos primeiros módulos, revisão da tripulação e lançamento.
4. **Jogo** — mapa em grelha, HUD com 4 indicadores, painel dos 4 astronautas, diário, alertas, ações e eventos.
5. **Resultado** — vitória/derrota, causa científica, decomposição da pontuação, estado da tripulação.
6. **NASA Debrief** — decisões vs. práticas NASA, fontes, diário completo, “Real vs. Simplificação” e pós-teste opcional.

### 4.3 Preparação da base

O jogador escolhe **um de três kits de carga** e coloca **dois módulos iniciais** no mapa.

| Kit | Efeito imediato | Trade-off |
|---|---|---|
| **Kit Energia** | +10 Energia, +1 carga de bateria | Menos margem de alimentos. |
| **Kit Proteção** | +10 Proteção, abrigo mais barato | Menos energia para a estufa. |
| **Kit Alimentos** | +10 Alimentos, estufa mais barata | Menos proteção contra radiação. |

O habitat inicial já está colocado e não pode ser removido. Os módulos iniciais disponíveis são painel solar, estufa, abrigo anti-radiação e extrator de água (este último só no cenário C ou com um sinal de gelo confirmado). Os custos e requisitos estão na secção 6.4 e são **provisórios**.

### 4.4 Dia de jogo (sequência)

1. **Briefing da manhã** — dia, luz, recursos, avisos, previsão. Se houver evento, o jogador decide.
2. **Fase de ação** — 2 pontos de ação para construir, reparar, fazer EVA, tratar um astronauta ou descansar. Também pode ligar/desligar módulos.
3. **Simulação do fim do dia** — geração solar, consumo, produção de alimentos/água, radiação, saúde, fadiga, penalizações por recursos a 0.
4. **Relatório da noite** — o que mudou, conceito desbloqueado, próximo dia.

Nos dias de rotina, os passos 1–4 são resumidos num único ecrã com o botão “Avançar”. O jogador pode parar em qualquer dia para inspecionar o mapa.

---

## 5. Cenários

Os efeitos iniciais são **provisórios** e estão marcados **“a validar”**. A lógica científica de cada cenário está documentada em `/docs/validacao-ciencia.md`.

### A — Borda de cratera (fácil)

- **Ambiente:** crista elevada, luz quase contínua, gelo longe, radiação como perigo principal.
- **Missão:** provar a sustentabilidade da base.
- **Efeitos iniciais:** **Energia +15, Alimentos +5.**
- **Porquê:** a luz abundante facilita a energia e a logística; a proximidade ao gelo é fraca. A radiação continua presente porque a Lua não tem atmosfera nem campo magnético global.
- **Crises típicas:** tempestade solar, poeira nos painéis, falha de bateria, radiação acumulada, estufa com pouca água.
- **Fonte principal:** LROC (iluminação), CRaTER (radiação).

### B — Mons Mouton Plateau (média)

- **Ambiente:** luz boa com sombras, relevo intermédio, perigo logístico e de terreno.
- **Missão:** estabelecer uma rota logística e completar 3 EVAs.
- **Efeitos iniciais:** **Energia +5, Alimentos −5.**
- **Porquê:** a luz é boa, mas o relevo encarece as deslocações e as sombras obrigam a gerir bateria. A logística é o gargalo.
- **Crises típicas:** EVA atrasada, inclinação acentuada, sombra inesperada, poeira, falha de comunicação, consumo de alimentos.
- **Fonte principal:** LOLA (relevo), LROC (iluminação), NASA Artemis III (região candidata).

### C — Cratera Amundsen (difícil)

- **Ambiente:** sombra quase total, gelo potencialmente próximo, frio e falta de energia.
- **Missão:** extrair água em 30 dias.
- **Efeitos iniciais:** **Energia −10, Proteção +10.**
- **Porquê:** a sombra reduz a energia solar; o relevo da cratera oferece proteção natural contra radiação. O gelo é uma **evidência** (hidrogénio detetado), não uma certeza.
- **Crises típicas:** frio extremo, bateria crítica, extração de água abaixo do esperado, tempestade solar, falha do extrator, saúde da tripulação.
- **Fonte principal:** LEND (hidrogénio/gelo), CRaTER (radiação), LOLA (terreno), NASA ISRU (extração de água).

**Nota importante:** o cenário C não representa a cratera inteira. A cratera Amundsen tem paredes sul iluminadas e uma região norte em sombra permanente. O jogo coloca a base na **região em sombra** para ensinar o problema energético. Isto é uma simplificação assumida.

---

## 6. Recursos e sistemas

### 6.1 Recursos da base

| Recurso | Escala | O que representa | Limite |
|---|---|---|---|
| **Vida** | 0–100 | Suporte vital: oxigénio, água, consumíveis. | 0 = fim da missão. |
| **Energia** | 0–100 | Carga da bateria e produção solar. | 0 = −20 pontos por dia; módulos desligam. |
| **Proteção** | 0–100 | Integridade do escudo da base (regolito/módulos). | 0 = −10 Vida por dia; dose de radiação sobe. |
| **Alimentos** | 0–100 | Reserva alimentar e produção da estufa. | 0 = −10 Vida por dia; saúde e fadiga pioram. |

**Valores iniciais (todos os cenários):** Vida 100, Energia 70, Proteção 60, Alimentos 70. Os efeitos do cenário aplicam-se depois. A escala 0–100 é uma simplificação; não representa unidades reais (kWh, kg, L ou mSv).

**Penalizações:** aplicam-se **uma vez por dia** em que o recurso está a 0, no fim do dia. Se o recurso continuar a 0 no dia seguinte, aplicam-se outra vez. Vários recursos a 0 acumulam. A pontuação final é limitada a 0–100.

### 6.2 Astronautas

Cada astronauta tem saúde, dose de radiação e fadiga (0–100). A saúde desce com:

- dose de radiação acima de 60 (aviso) e acima de 80 (grave);
- fadiga acima de 80;
- falta de alimentos ou água;
- eventos médicos.

O médico pode tratar um astronauta com 1 ponto de ação e um custo de Vida/Energia. O descanso reduz fadiga. A morte é permanente e reduz a pontuação de “astronautas vivos”.

### 6.3 Mapa e ciclo de luz/sombra

- Grelha **10×10** vista de cima, desenhada em Canvas 2D.
- Cada tile tem: elevação, inclinação, iluminação atual, tipo de terreno, sinal de gelo e ponto de interesse.
- O Sol move-se ao longo da missão. A iluminação de cada tile é calculada por uma travessia de raios simplificada: uma elevação mais alta pode projetar sombra sobre um tile mais baixo. É uma aproximação didática, não um modelo LOLA.
- Tiles de **sombra permanente** (PSR) têm iluminação 0. Tiles de crista têm iluminação alta.
- O mapa mostra a previsão de luz para os próximos 3 dias.
- Módulos e EVAs têm requisitos de terreno/luz. O jogador aprende a escolher cristas para painéis e a evitar sombras para a estufa.

### 6.4 Módulos

| Módulo | Custo (provisório) | Requisito | Efeito | Estado |
|---|---|---|---|---|
| **Painel solar** | 1 AP, 10 Energia | Tile com iluminação ≥50% | +8 Energia/dia com 100% de luz; 0 na sombra. | Pode ficar sujo/danificado. |
| **Estufa** | 1 AP, 15 Energia, 5 Vida | Tile plano | +6 Alimentos/dia; consome 4 Energia/dia e 2 Vida/dia. | Pode falhar por água, frio ou energia. |
| **Abrigo anti-radiação** | 1 AP, 10 Energia, 5 Proteção | Tile com inclinação/regolito | Capacidade 4; reduz a dose em 90% durante tempestades. | Pode ser danificado. |
| **Extrator de água** | 1 AP, 20 Energia | Tile com sinal de gelo + 1 EVA de confirmação | +5 Vida/dia; consome 8 Energia/dia. | Produção incerta; pode falhar. |
| **Habitat** | Inicial | — | Capacidade 4; proteção básica. | Não removível. |

Todos os custos e produções são **valores de design**, marcados **“a validar”**. Não são dados da NASA. O extrator de água é inspirado em tecnologia ISRU em desenvolvimento; o jogo simplifica o processo e não promete uma tecnologia operacional.

### 6.5 EVAs

Uma EVA envia um astronauta a um ponto de interesse. Custa:

- **1 ponto de ação** e **1 dia** (o astronauta fica indisponível para outras tarefas);
- **10 Energia** (provisório);
- **+5 de dose de radiação** (provisório), ajustado pela proteção e pelo terreno;
- **+20 de fadiga** (provisório);
- **multiplicador de inclinação**: +50% de Energia se a inclinação for >10° (provisório).

Uma EVA pode:

- confirmar um sinal de gelo (LEND) e desbloquear o extrator;
- recolher uma amostra científica (bónus científico);
- reparar um módulo;
- reconhecer terreno para uma rota logística (cenário B).

O jogador vê sempre o custo estimado antes de confirmar. O terreno inclinado encarece a EVA; é uma simplificação didática do esforço real de deslocação.

### 6.6 Tempestades solares

- **Aviso prévio:** no briefing da manhã, o jogo mostra um alerta com 1 dia de antecedência (simplificação; na realidade, o tempo de aviso pode ser de minutos a horas).
- **Corrida ao abrigo:** o jogador decide se abriga a tripulação, se termina uma tarefa em curso ou se continua exposto.
- **Consequências:** quem não estiver no abrigo recebe dose de radiação; a proteção da base reduz, mas não elimina. O abrigo tem capacidade 4.
- **Decisão sob pressão:** a escolha é por turnos, sem cronómetro em tempo real, para ser acessível. O custo de abrigar é tempo e energia; o custo de não abrigar é radiação e saúde.

### 6.7 Eventos gerados pelo estado

Não há uma lista fixa de crises por partida. O motor autoriza **12–15 crises** e sorteia as relevantes com base no estado:

- recursos acima/abaixo de limiares;
- módulos construídos, ligados ou danificados;
- astronautas com dose/fadiga altas;
- luz/sombra atual e previsão;
- cenário, dia e objetivos;
- flags de decisões anteriores.

Cada crise tem:

- **≥2 opções**;
- **pelo menos uma vantagem e um custo** por opção;
- **efeitos imediatos** e, quando aplicável, **efeitos atrasados**;
- **conceito de aprendizagem** e fonte;
- **condições de elegibilidade**, peso, cooldown e pré-requisitos.

O sorteio usa um RNG com semente para ser reproduzível nos testes. Nenhum evento é escolhido por uma lista fixa de dias.

**Exemplo de condição (DSL simples, sem código arbitrário):**

```json
{
  "id": "tempestade_solar",
  "conditions": {
    "all": [
      { "resource": "energia", "op": ">=", "value": 20 },
      { "module": "abrigo", "state": "operacional" },
      { "day": { "op": ">=", "value": 3 } }
    ]
  },
  "weight": 3,
  "cooldownDays": 5
}
```

### 6.8 Consequências encadeadas

As decisões deixam **flags** e **efeitos atrasados**. Exemplos:

- **Poupar energia cedo** → flag `estufa_fria` → 2 dias depois, evento “estufa frágil”: se não houver energia extra, a produção de alimentos cai 50% durante 3 dias.
- **Fazer EVA sem abrigo durante uma tempestade** → flag `dose_acumulada` → evento médico mais tarde; o médico pode tratar, mas gasta recursos.
- **Construir o extrator sem confirmar o gelo** → flag `extrator_incerto` → produção abaixo do esperado e risco de falha.
- **Ignorar a poeira nos painéis** → flag `painel_sujo` → produção solar cai gradualmente.

O jogador vê o nexo causal no relatório da noite e no Debrief. A derrota explica a cadeia, não apenas o último evento.

---

## 7. Motor de aprendizagem

### 7.1 Os cinco passos de cada decisão

1. **Pista** — um dado real em linguagem simples. Ex.: “A LROC mostra que esta crista recebe Sol mais de 70% do tempo; a cratera ao lado está em sombra permanente.”
2. **Decisão** — o jogador escolhe entre opções com vantagens e custos.
3. **Consequência** — o sistema aplica efeitos imediatos e atrasados.
4. **Porquê** — mini-explicação com **≤2 frases** + fonte NASA.
5. **Diário do Astronauta** — o conceito fica desbloqueado na enciclopédia.

### 7.2 Diário do Astronauta

Cada conceito tem:

- título curto;
- explicação de 1–2 frases;
- “porque importa”;
- fonte (ID do registo de fontes);
- etiqueta **real** ou **simplificação**;
- decisões relacionadas.

O diário persiste em `localStorage` (sem login). No fim, o Debrief mostra o diário completo.

### 7.3 Painel “Real vs. Simplificação”

Sempre acessível no jogo e no Debrief. Lista os valores usados na partida com:

```ts
type ScienceValue = {
  id: string;
  valor: string;
  tipo: "real" | "simplificação";
  fonte: string;
  estado: "verificado" | "a validar";
  nota?: string;
  usadoEm: string[];
};
```

Filtros: **Tudo**, **Real**, **Simplificação**, **A validar**. É a prova visível de que o jogo não inventa dados.

### 7.4 Mini-desafios de raciocínio

Não são perguntas de trivia. São decisões curtas com um modelo científico, por exemplo:

> “A luz caiu 80% durante a tarde. O que ajustas primeiro?”
> - Redirecionar a bateria para o suporte vital.
> - Manter a estufa ligada e arriscar a bateria.
> - Desligar o extrator e poupar energia.

Cada opção tem consequência no sistema e uma explicação. O jogador pode ver o resultado no dia seguinte.

### 7.5 Derrota com causa científica

Se a missão falhar, o ecrã final mostra:

- o que aconteceu (ex.: “A base ficou sem energia”);
- a cadeia de causas (ex.: “Os painéis estavam na sombra; a estufa consumiu a bateria; a proteção caiu”);
- a explicação científica (ex.: “No Polo Sul, o Sol é rasante e o relevo cria sombras longas. A NASA usa LROC e LOLA para escolher cristas iluminadas.”);
- a fonte;
- o que o jogador poderia ter feito de diferente (sem culpa, com clareza).

### 7.6 Índice de Conhecimento (0–25)

Fórmula exata:

```
Índice = round( 20 × (pontosDeDecisão / pontosDeDecisãoMáximos)
              + 5 × (miniDesafiosCertos / miniDesafiosTotais) )
```

- **20 pontos** vêm da qualidade científica das decisões. Cada opção tem `knowledgePoints` 0–2, atribuídos pelo designer com base no uso do dado, não no resultado de sobrevivência. O máximo é a soma dos melhores pontos possíveis por evento.
- **5 pontos** vêm dos mini-desafios de raciocínio (1 ponto por desafio, 5 desafios).
- O **pós-teste opcional não conta para o Índice**. Serve para o jogador se autoavaliar e para a equipa medir aprendizagem.

O Índice premeia **decisões fundamentadas**, não sorte. O Debrief mostra quais decisões deram pontos e porquê.

### 7.7 Pós-teste opcional (3 perguntas)

No fim do Debrief, o jogador pode responder a 3 perguntas de compreensão:

1. Porque é que um painel solar na sombra produz pouca ou nenhuma energia?
2. O que é uma tempestade solar e porque é que a tripulação deve abrigar-se?
3. Porque é que o gelo lunar é importante para uma base?

Feedback imediato, com fonte. Não conta para a pontuação. Pode ser saltado.

---

## 8. Pontuação (máximo 100, sem ambiguidades)

| Componente | Máximo | Fórmula |
|---|---|---|
| **Astronautas vivos** | 20 | 5 × número de astronautas com saúde > 0. |
| **Vida final** | 15 | `round(VidaFinal / 100 × 15)`. |
| **Energia final** | 10 | `round(EnergiaFinal / 100 × 10)`. |
| **Proteção final** | 10 | `round(ProteçãoFinal / 100 × 10)`. |
| **Alimentos final** | 10 | `round(AlimentosFinal / 100 × 10)`. |
| **Bónus científico** | 10 | 2 × marcos científicos alcançados (máx. 5). |
| **Índice de Conhecimento** | 25 | Fórmula da secção 7.6. |
| **Total** | **100** | Soma, limitada a 0–100. |

**Marcos científicos (5 × 2 pontos):**

1. Confirmar um sinal de gelo com uma EVA.
2. Construir e operar o extrator de água.
3. Sobreviver a uma tempestade solar com a tripulação no abrigo.
4. Manter a estufa a produzir durante 3 dias seguidos.
5. Cumprir o objetivo principal do cenário.

**Penalizações:**

- **Vida = 0** → fim imediato da missão.
- **Energia = 0** → −20 pontos por dia em que termina a 0.
- **Proteção = 0** → −10 Vida por dia.
- **Alimentos = 0** → −10 Vida por dia.

As penalizações aplicam-se no fim do dia, uma vez por dia, e acumulam se o recurso continuar a 0. A pontuação final nunca desce abaixo de 0. O ecrã final mostra a decomposição completa, incluindo as penalizações.

**Arredondamento:** `Math.round` (meio para cima) em cada componente, antes da soma. O total é limitado a 0–100.

**Vitória:**

- **Missão cumprida:** objetivo do cenário + pelo menos 1 astronauta vivo.
- **Missão completa:** objetivo + 4 astronautas vivos + nenhum recurso a 0 no fim.
- **Derrota:** objetivo não cumprido, ou Vida = 0, ou todos os astronautas mortos.

---

## 9. Conteúdo e modelo de dados (alto nível)

A Fase 1 formaliza os schemas. Os ficheiros ficam em `app/data/`:

| Ficheiro | Conteúdo |
|---|---|
| `locations.json` | 3 cenários, traits, efeitos iniciais, missão, mapa, pool de eventos. |
| `modules.json` | 4 módulos construíveis + habitat, custos, requisitos, efeitos, estados. |
| `events.json` | 12–15 crises, condições, pesos, opções, efeitos, flags, aprendizagem. |
| `concepts.json` | Conceitos do Diário, explicações, fontes, real/simplificação. |
| `sources.json` | Registo de fontes NASA, URL, instrumento, uso no jogo. |
| `astronauts.json` | 4 astronautas, papéis, bónus, retratos. |
| `scoring.json` | Pesos, fórmulas, penalizações, marcos. |
| `science-values.json` | Cópia runtime da tabela de validação, com `{valor, tipo, fonte, estado}`. |
| `i18n/pt-AO.json` | Textos de interface. |

**Regras de integridade (testes automáticos na Fase 1):**

- todo o `science-value` tem `valor`, `tipo`, `fonte`, `estado`;
- toda a `fonte` existe em `sources.json`;
- todo o estado `a validar` aparece na lista de pendências de `/docs/validacao-ciencia.md`;
- cada opção de evento tem pelo menos uma vantagem e um custo;
- cada conceito tem pelo menos uma fonte;
- os textos de interface existem em pt-AO (fallback visível se faltar uma chave).

---

## 10. UX/UI e direção de arte

**Princípio:** clareza antes de espetáculo. O V1 usava glassmorphism e CRT; o V2 deve ser legível num telemóvel, com contraste alto e hierarquia simples.

**Paleta:**

- fundo: azul-noite profundo;
- superfície: cinza-regolito;
- energia: amarelo-solar;
- água/gelo: ciano;
- vida: coral;
- alerta: vermelho;
- sucesso: verde-menta.

**Mapa:** grelha 2D com sombras suaves, ícones de módulos e pontos de interesse. O Sol é uma seta no topo; a sombra desloca-se ao longo dos dias. Sem 3D.

**Layout mobile-first:**

- topo: dia, relógio, alerta;
- mapa: 55–60% da altura;
- HUD: 4 barras compactas com ícone, valor e estado;
- fundo: painel dos astronautas e botão do diário;
- ações: bottom sheet com custos visíveis;
- eventos: modal de ecrã inteiro, uma decisão de cada vez.

**Estados críticos:** quando um recurso está abaixo de 20, a barra pulsa suavemente e mostra texto (“Energia crítica”). Nunca só cor.

**Áudio:** ambiente lunar subtil, cliques de interface, alarme de tempestade. Desligado por defeito. Sem vozes.

**Internacionalização:** pt-AO primeiro. Todas as strings em `i18n/pt-AO.ts`; conteúdo em `LocalizedText` (`string | Record<Locale, string>`). O inglês fica como placeholder até depois do evento.

---

## 11. Arquitetura técnica

### 11.1 Stack

- **React + TypeScript + Vite.**
- **Canvas 2D** para o mapa (sem Phaser; menos peso e mais controlo).
- **Motor puro** em `src/game/`, sem imports de React, Zustand ou DOM.
- **Zustand** apenas como adaptador de UI para o motor (ou `useReducer` se o Zustand se revelar desnecessário). A lógica de jogo nunca vive no componente.
- **Vitest** para testes unitários.
- **PWA** com `vite-plugin-pwa` (app shell + dados em cache; offline após a primeira visita).
- **Sem backend.** `localStorage` para diário, definições e save.
- **i18n** com dicionário leve; sem biblioteca pesada na Fase 2.

### 11.2 Separação de responsabilidades

```
UI (React) → ações → motor puro → novo estado → UI
```

O motor recebe `GameState` + `Action` e devolve `GameState` + `GameEvent[]` (eventos de domínio, não eventos de UI). Isto permite testar regras sem browser.

### 11.3 Estrutura de ficheiros proposta

```
app/
├─ data/
│  ├─ locations.json
│  ├─ modules.json
│  ├─ events.json
│  ├─ concepts.json
│  ├─ sources.json
│  ├─ astronauts.json
│  ├─ scoring.json
│  ├─ science-values.json
│  └─ i18n/
│     └─ pt-AO.json
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ game/
│  │  ├─ types.ts
│  │  ├─ engine.ts
│  │  ├─ actions.ts
│  │  ├─ events.ts
│  │  ├─ map.ts
│  │  ├─ scoring.ts
│  │  ├─ learning.ts
│  │  ├─ rng.ts
│  │  └─ selectors.ts
│  ├─ state/
│  │  └─ store.ts
│  ├─ ui/
│  │  ├─ screens/
│  │  │  ├─ StartScreen.tsx
│  │  │  ├─ LocationScreen.tsx
│  │  │  ├─ PrepareScreen.tsx
│  │  │  ├─ GameScreen.tsx
│  │  │  ├─ ResultScreen.tsx
│  │  │  └─ DebriefScreen.tsx
│  │  ├─ components/
│  │  │  ├─ LunarMap.tsx
│  │  │  ├─ ResourceBar.tsx
│  │  │  ├─ CrewPanel.tsx
│  │  │  ├─ EventModal.tsx
│  │  │  ├─ DiaryPanel.tsx
│  │  │  └─ SciencePanel.tsx
│  │  └─ theme.css
│  ├─ i18n/
│  │  ├─ index.ts
│  │  └─ pt-AO.ts
│  └─ pwa/
│     └─ register.ts
├─ tests/
│  ├─ engine.test.ts
│  ├─ events.test.ts
│  ├─ scoring.test.ts
│  ├─ learning.test.ts
│  └─ science-values.test.ts
├─ public/
│  ├─ icons/
│  └─ manifest.webmanifest
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
└─ vitest.config.ts
```

**Nota de migração:** o V1 continua na raiz e não é apagado. Na Fase 1, o `vercel.json` passa a construir `app/` e a servir `app/dist`. Se preferires o V2 na raiz, movemos o V1 para `legacy/v1/` com confirmação.

**Nota da Fase 1:** a implementação usa `scenarios.json` em vez de `locations.json`; `scoring.json` não existe porque todos os números vivem em `science-values.json`. `sources.json`, `i18n/`, `state/`, `ui/` e `pwa/` ficam para as fases seguintes.

### 11.4 Testes mínimos da Fase 1

- **Motor:** aplicar ações, limites 0–100, tick diário, morte, fim de missão.
- **Eventos:** elegibilidade por condições, cooldown, pesos, sem repetição indevida, opções com vantagem e custo.
- **Pontuação:** todas as componentes, arredondamento, penalizações, total 0–100.
- **Aprendizagem:** Índice de Conhecimento, desbloqueio de conceitos, pós-teste.
- **Ciência:** todos os valores têm os quatro campos; fontes existem; “a validar” está listado.
- **Determinismo:** mesma semente + mesmas ações = mesmo resultado.

### 11.5 Performance e qualidade

- bundle JS alvo: **<300 KB gzip**;
- mapa a 60 fps em Android médio; redesenho só quando o estado muda;
- imagens em SVG/WebP; sem fontes pesadas;
- Lighthouse: performance ≥90, acessibilidade ≥90, PWA instalável;
- testar em 360×640, 390×844 e desktop 1280×720;
- zero erros na consola em produção.

---

## 12. Roadmap de 48 horas e equipa

### 12.1 Fases (sequenciais, com validação no fim de cada uma)

| Fase | Entrega | Tempo alvo |
|---|---|---|
| **0** | GDD + tabela de validação científica | 3 h |
| **1** | Schemas JSON + motor puro + testes unitários | 8 h |
| **2** | Cenário A jogável ponta a ponta + Debrief básico | 10 h |
| **3** | Motor de aprendizagem completo (Diário, Real vs. Simplificação, Índice) | 8 h |
| **4** | Cenários B e C | 8 h |
| **5** | Polimento visual, acessibilidade, performance, pitch | 8 h |
| **Buffer** | Deploy, ensaio, correções | 3 h |

### 12.2 Workstreams (6 pessoas)

| Workstream | Dono | Entregas |
|---|---|---|
| **Produto e game design** | Lead | GDD, balanceamento, priorização, validação das fases. |
| **Ciência e conteúdo** | Science lead | Tabela de validação, textos, fontes, revisão de afirmações. |
| **Motor e dados** | Engenheiro sénior | Schemas, motor puro, testes, RNG, pontuação. |
| **UI e mapa** | Frontend | Ecrãs React, Canvas, mobile-first, acessibilidade. |
| **Arte e UX** | Designer | Paleta, ícones, layout, motion, pitch visual. |
| **QA e aprendizagem** | QA/educação | Playtests, métricas, bugs, deploy, pós-teste. |

### 12.3 Plano horário (referência)

- **H0–3:** fechar Fase 0; criar repo/branch; combinar schemas.
- **H3–12:** Fase 1; conteúdo mínimo do cenário A em paralelo.
- **H12–24:** Fase 2; cenário A ponta a ponta; primeiro playtest interno.
- **H24–32:** Fase 3; Diário, painel científico, Índice; segundo playtest.
- **H32–42:** Fase 4; cenários B e C; conteúdo e balanceamento.
- **H42–46:** Fase 5; acessibilidade, performance, PWA, pitch.
- **H46–48:** deploy final, ensaio da demo, buffer.

**Regra de ouro:** às 30 horas, congelar o âmbito. Se B/C não estiverem prontos, o cenário A completo e polido vale mais do que três cenários inacabados.

---

## 13. Riscos e mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Afirmações científicas sem fonte | Média | Alto | Tabela de validação obrigatória; teste automático; revisão do science lead. |
| Confundir “evidência de hidrogénio” com “gelo confirmado” | Alta | Alto | Usar “sinal”, “evidência”, “estimativa”; nunca “certeza”. |
| Âmbito excessivo (3 cenários + aprendizagem + polimento) | Alta | Alto | Fase 2 primeiro; congelar âmbito às 30 h; cortar B/C se necessário. |
| Performance fraca no telemóvel | Média | Alto | Canvas 2D, sem Phaser, poucas imagens, teste em Android médio. |
| Eventos sentidos como aleatórios ou injustos | Média | Médio | Condições visíveis, aviso prévio, explicação causal, RNG com semente. |
| Falta de tempo para o Debrief completo | Média | Médio | Debrief básico na Fase 2; enriquecer na Fase 3. |
| Textos longos ou técnicos | Média | Médio | Uma ideia por ecrã; ≤2 frases no “Porquê”; revisão de linguagem. |
| Acessibilidade esquecida | Média | Médio | Checklist desde a Fase 2; testes com teclado e leitor de ecrã. |
| Deploy quebrado na Vercel | Baixa | Alto | Testar preview na Fase 2; `vercel.json` revisto; fallback estático. |
| Uso indevido de marca NASA | Baixa | Alto | Disclaimer “não oficial”; sem logotipo NASA; seguir guias de media da NASA. |
| Equipa desalinhada | Média | Médio | Uma reunião de 10 min a cada fase; quadro de tarefas; definição de pronto. |

---

## 14. Critérios de sucesso

### 14.1 Aprendizagem

- **80%** de jogadores novos explicam, em 5 minutos, (a) porque os painéis falham na sombra, (b) o que é uma tempestade solar, (c) porque o gelo lunar importa.
- **Índice de Conhecimento médio ≥15/25** no primeiro playtest.
- **Pós-teste:** ≥2/3 respostas corretas na média.
- **Diário:** ≥6 conceitos desbloqueados por partida no cenário A.

### 14.2 Ciência

- **100%** das afirmações têm fonte ou etiqueta “simplificação”.
- **0** números inventados sem estado “a validar”.
- Todas as fontes abrem e dizem o que o jogo afirma.
- O painel “Real vs. Simplificação” está visível em todos os ecrãs de jogo.

### 14.3 Jogabilidade

- **≥70%** dos testadores completam o cenário A sem ajuda.
- Sessão média de **10–15 minutos**.
- Nenhum beco sem saída; todas as crises têm ≥2 opções válidas.
- Os 4 astronautas têm impacto mecânico percetível.

### 14.4 Técnica

- Corre no telemóvel (360×640) sem erros na consola.
- PWA instalável e offline após a primeira visita.
- Lighthouse performance ≥90 e acessibilidade ≥90.
- Deploy estável na Vercel até H46.

### 14.5 Equipa

- Pitch de 3 minutos ensaiado.
- Demo funciona offline.
- Repositório com README de V2, instruções de execução e créditos.

---

## 15. Decisões por defeito (ambiguidades resolvidas)

| Questão | Decisão por defeito |
|---|---|
| Duração da missão | A 14 dias, B 21 dias, C 30 dias; 8–15 dias de decisão; rotina auto-simulada. |
| Escala dos recursos | 0–100 abstrata; nunca unidades reais. |
| Penalizações | Uma vez por dia em que o recurso termina a 0; acumulam. |
| Morte de astronauta | Permanente; reduz a pontuação e as capacidades da base. |
| Preparação | 1 kit de carga + colocação de 2 módulos iniciais. |
| Mapa | Grelha 10×10, Canvas 2D, sombras simplificadas. |
| Tempestade solar | Aviso de 1 dia; decisão por turnos; abrigo com capacidade 4. |
| Pós-teste | Opcional, 3 perguntas, não conta para a pontuação. |
| Idioma | pt-AO; estrutura i18n pronta; inglês depois. |
| Save | `localStorage`; sem backend. |
| Analytics | Nenhum serviço externo; métricas locais para playtest. |
| Deploy | V2 em `app/`; Vercel serve `app/dist`; V1 preservado. |
| Marca NASA | Disclaimer “não oficial”; sem logotipo; fontes citadas. |
| Vitória | Objetivo + ≥1 astronauta vivo; “completa” com 4 vivos e nenhum recurso a 0. |

---

## Apêndice A — Exemplo de decisão completa

**Evento:** Tempestade solar a caminho.

1. **Pista:** “O CRaTER deteta um aumento de partículas energéticas. Uma tempestade solar pode chegar em menos de uma hora. A Luzia está a 20 minutos do abrigo, a recolher uma amostra de gelo.”
2. **Decisão:**
   - **A) Abrigar já.** Vantagem: protege a tripulação. Custo: perde a amostra e 10 Energia.
   - **B) Terminar a recolha (10 min) e correr para o abrigo.** Vantagem: ganha a amostra. Custo: +20 de dose de radiação para a Luzia.
   - **C) Continuar fora.** Vantagem: termina o trabalho. Custo: +50 de dose, risco de saúde grave.
3. **Consequência:** A aplica −10 Energia e cancela a EVA; B aplica +20 de dose e +1 amostra; C aplica +50 de dose e −20 de saúde.
4. **Porquê:** “As partículas energéticas do Sol podem atravessar fatos espaciais. O abrigo com regolito reduz a dose; o CRaTER mede estes eventos.” Fonte: S4.
5. **Diário:** desbloqueia “Tempestade solar” e “Radiação na Lua”.

---

## Apêndice B — Glossário

- **PSR (região permanentemente em sombra):** área que nunca recebe luz solar direta; pode reter gelo.
- **GCR (raios cósmicos galácticos):** radiação de alta energia vinda de fora do sistema solar.
- **SEP (partículas energéticas solares):** partículas aceleradas pelo Sol, especialmente em tempestades solares.
- **Regolito:** camada de poeira e fragmentos de rocha que cobre a Lua; pode servir de escudo contra radiação.
- **ECLSS:** sistema de suporte de vida que recicla água e ar (usado na ISS).
- **ISRU:** uso de recursos locais (por exemplo, gelo lunar) para produzir água, oxigénio ou combustível.
- **LROC:** câmara da LRO que mapeia a iluminação e a superfície.
- **LOLA:** altímetro laser da LRO que mede relevo, inclinações e rugosidade.
- **LEND:** detetor de neutrões da LRO que indica hidrogénio (e, por inferência, possível gelo).
- **CRaTER:** instrumento da LRO que mede radiação atrás de plástico equivalente a tecido humano.
- **Veggie / APH:** sistemas de cultivo na ISS; inspiram a estufa do jogo.

---

## Apêndice C — Checklist da Fase 0

- [x] GDD curto com visão, pilares, loop, cenários, sistemas, pontuação e arquitetura.
- [x] Tabela de valores científicos com `{valor, tipo, fonte, estado}`.
- [x] Valores provisórios marcados “a validar”.
- [x] Fontes NASA registadas com URL e uso.
- [x] Decisões por defeito para ambiguidades.
- [x] Riscos, critérios de sucesso e roadmap de 48 h.
- [ ] Validação do GDD pela equipa.
- [ ] Revisão científica da tabela.
- [ ] Autorização para avançar para a Fase 1.

---

*Documento vivo. Alterações a valores científicos exigem atualização de `/docs/validacao-ciencia.md` e do ficheiro `science-values.json` na Fase 1.*
