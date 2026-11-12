# Validação científica — BASE KWANZA V2

**Documento de controlo da regra mais importante do projeto: não inventar dados.**
Versão 0.3.0 · 12 de novembro de 2026 · Estado: **para revisão científica**
NASA Space Apps Challenge 2026 · Equipa angolana

---

## 0. Como ler este documento

Cada valor usado no jogo tem quatro campos obrigatórios:

```ts
type ScienceValue = {
  valor: string;                         // o que o jogo afirma ou usa
  tipo: "real" | "simplificação";        // é um dado real ou uma abstracção do jogo?
  fonte: string;                         // ID do registo de fontes (S1, S2, ...) ou "design do jogo"
  estado: "proposto" | "a validar" | "verificado (humano)"; // já foi confirmado por revisão humana?
};
```

Regras:

1. **`real`** = a afirmação corresponde a uma fonte NASA ou a um artigo revisto por pares, com URL neste documento.
2. **`simplificação`** = o jogo usa uma abstracção para ensinar; não é uma medida real.
3. **`proposto`** = valor de design ainda sem playtest; **`a validar`** = falta fonte suficiente ou o balanceamento precisa de teste; **`verificado (humano)`** = uma pessoa reviu e confirmou o valor na fonte. Nenhum valor é promovido a verificado automaticamente. Nunca aparece como “dado real” no jogo antes da revisão humana.
4. Se um valor não tiver fonte, fica automaticamente **`a validar`** e entra na Tabela C.
5. O painel “Real vs. Simplificação” lê estes campos. O Debrief nunca apresenta um valor `a validar` como facto.

**Convenções de linguagem:**

- “**sinal**” ou “**evidência**” de gelo — nunca “gelo confirmado” para o LEND.
- “**dose de radiação**” no jogo é uma escala abstracta 0–100; não é mSv.
- “**PSR**” é uma região permanentemente em sombra; não é sinónimo de “cratera inteira”.
- “**Mons Mouton Plateau**” é a região candidata do Artemis III; “Mons Mouton” é o maciço.
- “**Estufa**” e “**extrator de água**” são inspirados em tecnologia existente/em desenvolvimento; não são equipamentos lunares operacionais.

---

## 1. Resumo do estado

| Categoria | Nº de valores | Verificados (humano) | A validar / propostos |
|---|---:|---:|---:|
| Valores científicos usados no jogo (Tabela A) | 33 (32 reais + 1 simplificação) | 0 | 33 |
| Parâmetros de design (Tabela B) | 24 | 0 | 24 |
| Pendências científicas/de conteúdo (Tabela C) | 12 | — | 12 |

**Leitura:** as afirmações científicas têm fonte identificada, mas **nenhuma foi marcada como `verificado (humano)` sem revisão humana**. O que falta validar são, sobretudo, **valores de balanceamento**, **decisões de representação** (por exemplo, quanto vale uma EVA ou como mapear mSv para a escala 0–100) e a **revisão final das fontes**. Nenhum número de balanceamento é apresentado como dado da NASA.

---

## 2. Tabela A — valores científicos usados no jogo

| ID | Valor / afirmação no jogo | Tipo | Fonte | Estado | Onde é usado | Nota |
|---|---|---|---|---|---|---|
| C01 | A inclinação do eixo da Lua é ~1,54°; no Polo Sul o Sol fica quase sempre rasante. | real | S1, S7 | a validar | Mapa, luz/sombra, cenários | É a razão pela qual o Polo Sul tem sombras longas e PSRs. |
| C02 | Um dia solar lunar dura ~29,53 dias terrestres. | real | S10 | a validar | Relógio da missão, cenário C | O jogo comprime o tempo; só os dias de decisão são jogados em detalhe. |
| C03 | Pequenas áreas na borda de Shackleton ficam iluminadas ~94% do ano; a borda recebe >70%; o período mais longo de escuridão é ~43 h; não há luz solar perpétua verdadeira. | real | S1 | a validar | Cenário A, mapa, dicas | “Quase contínua” é uma simplificação de 70–94%, não 100%. |
| C04 | O fundo de Shackleton e outras PSRs não recebe luz solar direta. | real | S1, S7, S11 | a validar | Mapa, PSRs, cenário C | PSR = permanente sombra direta; pode receber luz refletida. |
| C05 | A temperatura em PSRs pode ser <110 K (−163 °C); algumas chegam a ~70 K (−203 °C). | real | S7, S11 | a validar | Dicas, eventos de frio | Valores de contexto; o jogo não usa temperaturas reais na mecânica. |
| C06 | No Polo Sul iluminado, a temperatura pode chegar a ~54 °C. | real | S7 | a validar | Dicas, contraste térmico | Mostra que “sombra” e “Sol” são extremos. |
| C07 | Shackleton tem ~19–21 km de diâmetro e ~4,2 km de profundidade; a borda é um análogo para o cenário A. | real | S1, S11 | a validar | Cenário A | O cenário A é uma “borda de cratera” genérica inspirada em Shackleton. |
| C08 | Amundsen tem ~103 km de diâmetro, fica a ~83,4°S; a parte norte do fundo/parede é PSR; há evidência de gelo de água à superfície; Tmax <110 K. | real | S12 | a validar | Cenário C | O jogo usa a PSR, não a cratera inteira. As paredes sul são iluminadas. |
| C09 | Mons Mouton Plateau é uma região candidata do Artemis III; o maciço sobe ~8 km; é a maior região candidata (~4.450 km²); tem PSRs acessíveis. | real | S7, S13 | a validar | Cenário B | A luz é boa, mas o relevo e as sombras condicionam a logística. |
| C10 | O LEND deteta hidrogénio por supressão de neutrões; isso sugere gelo de água, mas não é uma medição direta; os sinais mais fortes estão em Cabeus, Shoemaker, Haworth e Faustini; nem todas as PSRs têm gelo. | real | S3 | a validar | Cenário C, extrator, Diário | Usar sempre “sinal” ou “evidência”, nunca “certeza”. |
| C11 | Estimativas de hidrogénio equivalente em água chegam a ~0,6% em massa nos primeiros metros (recalibração LEND). | real (estimativa) | S15 | a validar | Dicas, Debrief | Incerteza alta; o jogo não usa o número na mecânica. |
| C12 | Estimativas de gelo em regolito polar variam ~1–5% em massa (o jogo adota esta faixa conservadora; a literatura publicada vai de ~0,7% a ~8,5%). | simplificação | S16 | a validar | Extrator, Debrief | É uma faixa, não um valor único; a distribuição é desconhecida. O valor de jogo é uma simplificação, não uma medição local. A literatura publicada é a referência real. |
| C13 | O gelo lunar pode fornecer água, oxigénio, combustível e proteção contra radiação. | real | S3, S9 | a validar | Diário, Debrief, cenário C | É a justificação de “porque é que o gelo importa”. |
| C14 | A Lua não tem atmosfera significativa nem campo magnético global; a radiação chega à superfície. | real | S4, S7, S17 | a validar | Radiação, tempestades, Diário | A exosfera lunar é extremamente ténue. |
| C15 | A dose equivalente de GCR na superfície lunar é ~1,37 mSv/dia (LND, Chang'e-4, mínimo solar); é ~2,6× a dose na ISS. | real | S8 | a validar | Dicas, Debrief | O LND não é o CRaTER; o CRaTER mede o ambiente orbital. O jogo usa dose abstracta. |
| C16 | O CRaTER mede GCR e SEP atrás de plástico equivalente a tecido humano; os dados ajudam a estimar risco e blindagem. | real | S4 | a validar | Radiação, tempestades, Diário | Fonte principal da mecânica de radiação. |
| C17 | Eventos SEP podem entregar doses perigosas em horas; a tripulação deve abrigar-se. | real | S4 | a validar | Tempestades solares | O jogo não usa um valor exato de dose; usa a decisão de abrigar. |
| C18 | O terreno e o regolito podem reduzir a dose; as paredes de crateras bloqueiam SEP em ângulos rasantes. | real | S4, S14 | a validar | Abrigo, proteção, cenário C | Conceito real; a geometria do jogo é simplificada. |
| C19 | A ECLSS recupera ~93–94% da água (antes do BPA) e demonstrou 98% com o BPA; produz oxigénio por eletrólise e reduz CO2. | real | S5 | a validar | Água, suporte vital, Diário | Valores da ISS, não de uma base lunar. |
| C20 | Cada astronauta precisa de ~1 galão (~3,8 L) de água por dia para consumo, preparação de alimentos e higiene. | real | S5 | a validar | Diário, Debrief | Não usado na escala 0–100. |
| C21 | O Veggie é um sistema de cultivo de baixo consumo; a alface romana foi colhida após 33 dias; primeira colheita em 2015; 0,15 m²; LEDs e capilaridade. | real | S6 | a validar | Estufa, Diário | A estufa do jogo é inspirada no Veggie/APH. |
| C22 | As plantas no espaço complementam a dieta; não substituem toda a alimentação. | real | S6 | a validar | Estufa, Debrief | Evita a ideia de que uma estufa alimenta 4 pessoas sozinha. |
| C23 | Stress hídrico pode matar plantas (perda de plantas na primeira cultura do Veggie). | real | S6 | a validar | Eventos da estufa | Justifica a fragilidade da estufa. |
| C24 | O LOLA mede topografia, inclinações e rugosidade; tem pegadas de ~5 m; os DEMs do Polo Sul têm 5–20 m/px. | real | S2 | a validar | Mapa, EVAs, Diário | O mapa do jogo é uma grelha didática, não um DEM LOLA. |
| C25 | O estudo de Amundsen excluiu inclinações >10°; a inclinação afeta a deslocação. | real (critério de estudo) | S12, S2 | a validar | Custo de EVA | O multiplicador de +50% é design, não um dado. |
| C26 | A extração de água lunar é uma tecnologia ISRU em desenvolvimento; o desempenho depende da forma, concentração e distribuição do gelo, que são incertas. | real | S9 | a validar | Extrator, Debrief | O extrator do jogo é uma simplificação, não uma promessa tecnológica. |
| C27 | A iluminação e a sombra no Polo Sul variam com o relevo e a estação; não há um único valor para todo o Polo Sul. | real | S1, S2 | a validar | Cenários, mapa | O jogo usa valores por cenário, marcados como simplificação. |
| C28 | A luz solar é necessária para os painéis fotovoltaicos; na sombra, a produção cai para perto de zero. | real | S1 | a validar | Energia | Princípio básico de fotovoltaica; o jogo usa uma curva simplificada. |
| C29 | As tempestades solares são imprevisíveis e o tempo de aviso pode ser curto. | real | S4 | a validar | Tempestades | O aviso de 1 dia é uma simplificação para jogabilidade. |
| C30 | A poeira lunar é um desafio para equipamentos e fatos; o efeito exato na produção solar é simplificado no jogo. | real | S7 | a validar | Eventos de poeira | O multiplicador de perda solar é design. |
| C31 | A radiação de fundo na Lua é maior do que na ISS. | real | S8 | a validar | Dicas, Debrief | ~2,6×; usar como contexto, não como valor de jogo. |
| C32 | O gelo lunar não está confirmado em todos os locais; a distribuição é complexa. | real | S3, S7 | a validar | Cenário C, Debrief | Essencial para o tom de incerteza. |
| C33 | A temperatura e a iluminação de uma PSR podem preservar voláteis durante longos períodos. | real | S7, S12 | a validar | Gelo, Diário | “Podem” — não “preservam sempre”. |

---

## 3. Tabela B — parâmetros de design (não são dados científicos)

Todos os valores abaixo são **simplificações** e estão **`proposto`** ou **`a validar`** por playtest. Não devem aparecer no jogo como “dados da NASA”.

| ID | Valor no jogo | Tipo | Fonte | Estado | Onde é usado | Nota |
|---|---|---|---|---|---|---|
| D01 | Vida 100, Energia 70, Proteção 60, Alimentos 70 no início. | simplificação | design do jogo | a validar | Preparação | Equilíbrio inicial; testar dificuldade. |
| D02 | Escala 0–100 para todos os recursos. | simplificação | design do jogo | a validar | HUD, pontuação | Não representa kWh, kg, L ou mSv. |
| D03 | Vida=0 termina a missão; Energia=0 → −20 pontos/dia; Proteção=0 → −10 Vida/dia; Alimentos=0 → −10 Vida/dia. | simplificação | design do jogo | a validar | Fim do dia, pontuação | Aplicar uma vez por dia; acumular se continuar a 0. |
| D04 | A: Energia +15, Alimentos +5. B: Energia +5, Alimentos −5. C: Energia −10, Proteção +10. | simplificação | design do jogo | a validar | Escolha do local | Efeitos provisórios; a lógica científica está em C01–C09. |
| D05 | Missões de 14, 21 e 30 dias; 8–15 dias de decisão. | simplificação | design do jogo | a validar | Relógio, ritmo | Cabe numa sessão de 10–15 min. |
| D06 | 1 turno = 1 dia de missão; dias de rotina auto-simulados. | simplificação | design do jogo | a validar | Loop | Compressão de tempo. |
| D07 | Mapa 10×10, Canvas 2D, sombras por travessia de raios simplificada. | simplificação | design do jogo | a validar | Mapa | Não é um modelo LOLA. |
| D08 | Custos/efeitos dos módulos (painel +8 Energia/dia; estufa +6 Alimentos/dia e −4 Energia/−2 Vida; abrigo −90% dose; extrator +5 Vida/dia e −8 Energia). | simplificação | design do jogo | a validar | Construção | Testar economia; evitar módulos “obrigatórios”. |
| D09 | EVA: 1 AP, 1 dia, −10 Energia, +5 dose, +20 fadiga; +50% Energia se inclinação >10°. | simplificação | design do jogo | a validar | EVAs | O custo real varia com o fato, o rover e o terreno. |
| D10 | Tempestade: aviso de 1 dia; abrigo com capacidade 4; abrigar custa 10 Energia. | simplificação | design do jogo | a validar | Tempestades | O aviso real pode ser de minutos a horas. |
| D11 | Saúde, dose e fadiga 0–100; aviso de dose >60; grave >80; fadiga >80 prejudica. | simplificação | design do jogo | a validar | Astronautas | Limiares de jogo, não médicos. |
| D12 | Índice = round(20 × pontos/máx + 5 × miniDesafiosCertos/total). | simplificação | design do jogo | a validar | Resultado, Debrief | Pós-teste não conta. |
| D13 | Bónus científico = 2 × 5 marcos. | simplificação | design do jogo | a validar | Pontuação | Marcos na secção 8 do GDD. |
| D14 | Pesos: 20/15/10/10/10/10/25. | simplificação | design do jogo | a validar | Pontuação | Soma 100. |
| D15 | Extrator: +5 Vida/dia; produção incerta se o gelo não foi confirmado. | simplificação | design do jogo | a validar | Cenário C | Sem valor real de rendimento; ver C26. |
| D16 | Painel solar: +8 Energia/dia a 100% de luz; 0 na sombra. | simplificação | design do jogo | a validar | Energia | Curva linear didática; painéis reais têm curvas e temperatura. |
| D17 | Estufa: +6 Alimentos/dia; −4 Energia/dia; −2 Vida/dia. | simplificação | design do jogo | a validar | Alimentos | Não implica que a estufa alimente toda a base. |
| D18 | 12–15 crises autorais; 8–12 por partida. | simplificação | design do jogo | a validar | Eventos | Conteúdo, não todas vistas numa partida. |
| D19 | Pós-teste de 3 perguntas, opcional, não pontuado. | simplificação | design do jogo | a validar | Debrief | Serve para autoavaliação e medição. |
| D20 | Vitória = objetivo + ≥1 astronauta vivo; “completa” = 4 vivos + nenhum recurso a 0. | simplificação | design do jogo | a validar | Resultado | Evita que uma morte tardia anule toda a missão. |
| D21 | Consumo diário de suporte de vida: −3 Energia, −4 Alimentos, −1 Vida, 0 Proteção. | simplificação | design do jogo | proposto | Loop diário | Aplicado antes das penalizações; testar se A fica demasiado fácil. |
| D22 | Mapa 10×10; elevações 2/3/5/0/0 para plano/encosta/borda/PSR/gelo; Sol entre 5° e 20°; sombras por travessia de raios; PSR e gelo sempre em sombra. | simplificação | design do jogo | proposto | Mapa e luz | Modelo didático, não um DEM LOLA. A luz do dia 1 é usada na preparação. |
| D23 | Preparação com 5 pontos; custos 2/3/2/3; painel solar exige luz ≥0,25; extrator exige gelo; estufa exige plano; abrigo exige plano ou encosta. | simplificação | design do jogo | proposto | Preparação | Sem kits de carga nem habitat inicial nesta fase. |
| D24 | Dia de jogo = 20 s; pausa; velocidades 1× e 2×. | simplificação | design do jogo | proposto | Loop diário | O jogador pode avançar manualmente. |

**Valores de conteúdo (Fase 1):** os efeitos numéricos de eventos, módulos, EVAs, ritmo e estado inicial dos astronautas são instâncias dos parâmetros D05, D08, D09, D11, D12 e D18. Vivem todos em `app/data/science-values.json`, com `tipo: "simplificação"` e `estado: "a validar"`. Não são dados da NASA.

**Fase 2a:** D21–D24 vivem no mesmo ficheiro e começam como `proposto`. O mapa, os custos dos módulos, o consumo diário e o temporizador não têm números mágicos na UI nem no motor. Os testes de 1000 partidas aleatórias verificam estados válidos, distribuição de pontuação e a existência de partidas não triviais.

---

## 4. Tabela C — pendências “a validar”

| ID | O que validar | Porque importa | Ação | Dono | Prazo | Impacto se não validar |
|---|---|---|---|---|---|---|
| P01 | Valores de iluminação específicos de A/B/C. | Os cenários usam “quase contínua”, “boa com sombras” e “quase total”; são generalizações. | Extrair valores LROC/LOLA ou manter rótulos qualitativos com fonte. | Science lead | Antes da Fase 2 | O jogador pode achar que todo o Polo Sul é igual. |
| P02 | Redação sobre gelo em Amundsen. | “Evidência” não é “certeza”; a distribuição é complexa. | Revisar Sefton-Nash 2019 e LPSC 2025; usar “sinal/evidência”. | Science lead | Antes da Fase 4 | Overclaim científico; perda de credibilidade. |
| P03 | Iluminação e terreno de Mons Mouton Plateau. | É uma região candidata do Artemis III, não um “planalto qualquer”. | Confirmar com NASA 2024 e JGR 2025; ajustar texto. | Science lead | Antes da Fase 4 | Cenário B pode ser cientificamente vago. |
| P04 | Mapeamento de mSv para a escala 0–100. | A dose real é ~1,37 mSv/dia; o jogo usa 0–100. | Documentar a conversão como simplificação; nunca mostrar 0–100 como mSv. | Engine + science | Antes da Fase 3 | Confusão sobre radiação. |
| P05 | Uso dos valores da ECLSS. | 93–94% e 98% são da ISS, não de uma base lunar. | Dizer “na ISS” no texto; não prometer ECLSS lunar. | Science lead | Antes da Fase 3 | O jogador pode achar que a tecnologia já está na Lua. |
| P06 | Papel da estufa. | Veggie/APH complementam a dieta; não alimentam uma base inteira. | Usar “complemento” e “produção limitada”; ajustar D17. | Science lead | Antes da Fase 3 | Expectativa errada sobre comida lunar. |
| P07 | Rendimento e energia do extrator. | A extração de água é ISRU em desenvolvimento; os números do jogo são ficção. | Usar dados do pilot plant ou marcar claramente como simplificação. | Science lead | Antes da Fase 4 | O jogo pode parecer prometer tecnologia inexistente. |
| P08 | Custos de módulos e EVAs. | A economia pode tornar uma estratégia obrigatória. | Playtest com 5–8 pessoas; ajustar D08/D09. | Game design | Fase 2 e 4 | Jogo desequilibrado ou sem escolhas reais. |
| P09 | Penalizações e pesos da pontuação. | −20/dia pode zerar a pontuação cedo demais. | Playtest; comparar runs; ajustar D03/D14. | Game design | Fase 2 e 4 | Sensação de injustiça. |
| P10 | Terminologia científica em pt-AO. | “PSR”, “regolito”, “dose” e “solar” precisam de consistência. | Revisão por professor/cientista angolano. | Science lead | Fase 3 | Textos ambíguos. |
| P11 | Uso de marca e conteúdo NASA. | O projeto não é oficial. | Disclaimer, sem logotipo, seguir guias de media da NASA. | Lead | Fase 5 | Risco legal/reputacional. |
| P12 | Acessibilidade e performance. | O jogo tem de correr num telemóvel. | Testar 360×640, teclado, leitor de ecrã, Lighthouse. | QA | Fase 5 | Falha do critério de sucesso. |

**Critério de fecho:** nenhum valor com `estado: "a validar"` pode ser apresentado no Debrief como “dado real da NASA”. Se não houver fonte, o texto diz “simplificação do jogo” e o painel “Real vs. Simplificação” mostra o campo.

---

## 5. Registo de fontes

**Acesso a todas as fontes: 12 de novembro de 2026.**

### 5.1 Fontes nucleares (ligadas diretamente às mecânicas)

| ID | Fonte | Instrumento / programa | URL | O que mede / mostra | Uso no jogo |
|---|---|---|---|---|---|
| **S1** | LROC — Lunar Reconnaissance Orbiter Camera | Câmara WAC/NAC da LRO | [lroc.im-ldi.com/images/789](https://lroc.im-ldi.com/images/789) · [lroc.im-ldi.com/images/271](https://www.lroc.im-ldi.com/images/271) · [Speyerer & Robinson 2013](https://www.sciencedirect.com/science/article/pii/S0019103512004174) | Iluminação polar, sombras, PSRs, cobertura de Shackleton | Cenário A, mapa, ciclo de luz/sombra, Diário |
| **S2** | LOLA — Lunar Orbiter Laser Altimeter | Altímetro laser da LRO | [science.nasa.gov/mission/lro/lola](https://science.nasa.gov/mission/lro/lola) · [PGDA/LOLA South Pole](https://pgda.gsfc.nasa.gov/products/90) | Topografia, inclinações, rugosidade, DEMs polares | Mapa, custo de EVAs, cenário B, Diário |
| **S3** | LEND — Lunar Exploration Neutron Detector | Detetor de neutrões da LRO | [NASA SVS — LEND](https://svs.gsfc.nasa.gov/4057) · [NASA Moon Water and Ices](https://science.nasa.gov/moon/moon-water-and-ices/) · [LRO ice widespread](https://science.nasa.gov/solar-system/moon/nasas-lro-lunar-ice-deposits-are-widespread/) | Hidrogénio no regolito; indícios de gelo; PSRs | Cenário C, extrator, Diário, Debrief |
| **S4** | CRaTER — Cosmic Ray Telescope for the Effects of Radiation | Telescópio de radiação da LRO | [NASA CRaTER (PDF)](https://assets.science.nasa.gov/content/dam/science/cds/general/documents/2024/01/crater-litho-2023feb.pdf) · [NASA LRO Science and Data](https://science.nasa.gov/mission/lro/science-and-data/) · [UNH CRaTER](https://eos.unh.edu/crater/crater-lro) | GCR, SEP, dose atrás de tecido equivalente, blindagem | Radiação, tempestades, abrigo, Diário |
| **S5** | ECLSS — Environmental Control and Life Support System | Sistema de suporte de vida da ISS | [NASA ECLSS](https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss) · [NASA water recovery 98%](https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station) | Reciclagem de água, oxigénio, CO2 | Água, suporte vital, Diário |
| **S6** | Veggie / Advanced Plant Habitat | Sistemas de cultivo da ISS | [Veggie Fact Sheet (PDF)](https://www.nasa.gov/wp-content/uploads/2023/03/veggie-fact-sheet-508.pdf) · [NASA Veggie activation](https://www.nasa.gov/missions/station/veggie-plant-growth-system-activated-on-international-space-station) | Cultivo de plantas, LED, água, colheita | Estufa, alimentos, eventos, Diário |

### 5.2 Fontes complementares (contexto e verificação cruzada)

| ID | Fonte | URL | O que acrescenta | Uso no jogo |
|---|---|---|---|---|
| **S7** | NASA — Moon's South Pole / Moon Base environment / Artemis III regions | [South Pole](https://www.nasa.gov/feature/moons-south-pole-is-full-of-mystery-science-intrigue) · [Moon Base](https://www.nasa.gov/reference/moonbase-environment) · [Artemis III regions](https://www.nasa.gov/news-release/nasa-provides-update-on-artemis-iii-moon-landing-regions) | Temperaturas, PSRs, poeira, regiões candidatas | Cenários, dicas, Debrief |
| **S8** | Zhang et al. 2020 — First measurements of radiation dose on the lunar surface (LND, Chang'e-4) | [Science Advances](https://www.science.org/doi/10.1126/sciadv.aaz1334) | Dose de superfície ~1,37 mSv/dia; comparação com a ISS | Dicas de radiação, Debrief |
| **S9** | NASA ISRU — extração de água lunar | [Aqua Factorem](https://www.nasa.gov/general/aqua-factorem-ultra-low-energy-lunar-water-extraction) · [NASA ISRU progress (PDF)](https://ntrs.nasa.gov/api/citations/20250003730/downloads/Progress%20Review%20NASA%20Lunar%20ISRU_Sanders.pdf) | Tecnologia em desenvolvimento; incerteza do gelo; TRL | Extrator, cenário C, Debrief |
| **S10** | NASA SVS — 100 Lunar Days | [svs.gsfc.nasa.gov/12739](https://svs.gsfc.nasa.gov/12739) | Dia solar lunar = 29,53 dias terrestres | Relógio, cenário C |
| **S11** | LPI — Lunar South Pole Atlas | [lpi.usra.edu/lunar/lunar-south-pole-atlas](https://www.lpi.usra.edu/lunar/lunar-south-pole-atlas) | Shackleton, PSRs, contexto visual | Cenário A, mapa, Debrief |
| **S12** | Amundsen crater — Sefton-Nash et al. 2019; LPSC 2025 | [Icarus 2019](https://www.sciencedirect.com/science/article/abs/pii/S0019103518306328) · [LPSC 2025 (PDF)](https://www.hou.usra.edu/meetings/lpsc2025/pdf/1712.pdf) | PSR, gelo superficial, temperatura, inclinações | Cenário C, Debrief |
| **S13** | Mons Mouton — JGR Planets 2025 | [AGU](https://agupubs.onlinelibrary.wiley.com/doi/10.1029/2025JE009127) | Maciço, região candidata, PSRs acessíveis | Cenário B, Debrief |
| **S14** | Phipps et al. — blindagem pelo terreno e dose perto de crateras lunares | [NTRS 2024 (PDF)](https://ntrs.nasa.gov/api/citations/20240004047/downloads/PhippsMapsAbstract.pdf) · [NTRS 2021 (PDF)](https://ntrs.nasa.gov/api/citations/20210021043/downloads/Phipps_LPSC_2021_abstract.pdf) | Paredes de crateras bloqueiam SEP rasantes; GCR dentro de crateras reduzido em ≥40% | Abrigo, proteção, cenário C, Debrief |
| **S15** | McClanahan et al. 2018 — recalibração do LEND (LPSC 2018) | [LPSC 2018 (PDF)](https://www.hou.usra.edu/meetings/lpsc2018/pdf/2339.pdf) | ~0,6% de hidrogénio equivalente em água no topo do regolito; recuperação do sensor SETN | Dicas, Debrief |
| **S16** | NASA — estimativas da abundância de gelo no regolito polar | [NASA TM-2018-219937 (PDF)](https://ntrs.nasa.gov/api/citations/20180008495/downloads/20180008495.pdf) · [LPSC 2021 (PDF)](https://www.hou.usra.edu/meetings/lpsc2021/pdf/1882.pdf) · [LPSC 2024 — LEND (PDF)](https://www.hou.usra.edu/meetings/lpsc2024/pdf/1920.pdf) | Faixa publicada ~0,7–8,5% em massa; LEND ~0,7% em Cabeus; LCROSS ~5,6%; distribuição incerta | Extrator, Debrief |
| **S17** | NASA — Moon Facts / Top Moon Questions | [Moon Facts](https://science.nasa.gov/moon/facts/) · [Top Moon Questions](https://science.nasa.gov/moon/top-moon-questions) | Atmosfera ténue, inclinação axial, dia solar, temperaturas e fases | Contexto, Diário, Debrief |

### 5.3 Notas sobre as fontes

- **S1–S6** são as seis fontes nucleares pedidas no briefing. **S7–S17** são complementares e servem para verificar contexto, não para multiplicar citações no jogo.
- O **LEND** não mede gelo diretamente: mede a supressão de neutrões causada por hidrogénio. O texto do jogo deve refletir essa cadeia.
- O **CRaTER** mede o ambiente de radiação em órbita lunar. A dose de superfície citada em C15 vem do **LND** (Chang'e-4); a distinção está explícita para não atribuir ao CRaTER um valor que ele não mediu.
- Os valores da **ECLSS** são da ISS. A base lunar do jogo é uma extrapolação; o texto deve dizer “na ISS” e “tecnologia em desenvolvimento” quando aplicável.
- O **Veggie/APH** são sistemas da ISS. A estufa lunar do jogo é uma analogia; não existe uma estufa lunar operacional.
- O **ISRU** de água lunar está em desenvolvimento (TRL 4–6 em componentes). O extrator do jogo é uma simplificação; não é uma promessa de tecnologia pronta.

---

## 6. Frases seguras para o jogo

Usar estas formulações nos textos, dicas e Debrief:

- “No Polo Sul, o Sol fica quase sempre rasante. O relevo cria sombras longas e algumas zonas nunca recebem luz direta.”
- “A LROC mostra que pequenas áreas na borda de Shackleton ficam iluminadas quase 94% do ano — mas não há luz solar perpétua.”
- “O LEND deteta hidrogénio no solo. Isso sugere gelo de água, mas não é uma medição direta.”
- “As estimativas de gelo variam muito. O jogo usa valores abstratos para ensinar o princípio.”
- “O CRaTER mede a radiação na órbita da Lua. Na superfície, a dose de fundo medida é de cerca de 1,37 mSv por dia.”
- “Uma tempestade solar pode entregar uma dose perigosa em pouco tempo. Por isso, a tripulação abriga-se.”
- “A ECLSS da ISS recicla cerca de 93–94% da água; com o processador de salmoura, demonstrou 98%. A base lunar do jogo simplifica este sistema.”
- “O Veggie e o Advanced Plant Habitat mostram que é possível cultivar no espaço. As plantas complementam a dieta; não a substituem toda.”
- “O extrator de água do jogo é inspirado em tecnologia ISRU em desenvolvimento. A NASA ainda está a estudar como extrair gelo lunar de forma fiável.”
- “A cratera Amundsen tem uma região em sombra permanente e paredes iluminadas. O jogo usa a região em sombra para ensinar o desafio energético.”

**Evitar:**

- “A NASA confirmou gelo em Amundsen.” → “Há evidência de gelo de água na região.”
- “Os painéis solares não funcionam de noite.” → “Na sombra, a produção solar cai para perto de zero; as baterias cobrem o resto.”
- “A base vai produzir toda a comida.” → “A estufa complementa a dieta.”
- “A radiação é 100.” → “A dose de radiação é uma escala do jogo; não é mSv.”
- “A NASA tem um extrator de água na Lua.” → “A NASA está a desenvolver tecnologia para extrair água lunar.”

---

## 7. Notas de incerteza (para o Debrief)

1. **Gelo:** a evidência é indireta (hidrogénio) ou remota (espetroscopia, radar, emissividade). A concentração e a forma do gelo são desconhecidas. O jogo deve dizer “sinal” e “estimativa”.
2. **Radiação:** a dose depende da altitude, do local, da blindagem, da atividade solar e do ciclo solar. O valor de 1,37 mSv/dia é uma medição de superfície num período de mínimo solar; não é uma constante universal.
3. **Iluminação:** os valores de 70–94% são para áreas específicas de Shackleton, não para todo o Polo Sul. Cada cenário tem o seu próprio padrão.
4. **Temperatura:** os valores de PSR (<110 K, ~70 K) e de superfície iluminada (~54 °C) são extremos; a temperatura real varia com a estação e o local.
5. **ECLSS:** os 98% foram demonstrados na ISS com o Brine Processor Assembly; não são um valor de projeto de uma base lunar.
6. **Estufa:** o Veggie tem 0,15 m² e complementa a dieta; uma estufa lunar para 4 pessoas exigiria uma área e uma potência muito maiores.
7. **ISRU:** a extração de água lunar tem componentes em TRL 4–6; a viabilidade depende de recursos conhecidos e de energia no local.
8. **Tempestades:** o tempo de aviso pode ser curto; o jogo dá 1 dia para tornar a decisão jogável. Isto é uma simplificação assumida.

---

## 8. Change log

| Data | Versão | Alteração |
|---|---|---|
| 12/11/2026 | 0.1 | Criação da tabela inicial, fontes nucleares e complementares, pendências e frases seguras. |
| 12/11/2026 | 0.1.1 | Adicionadas S14–S17 (blindagem pelo terreno, recalibração LEND, abundância de gelo, factos lunares); C12 clarificado com a faixa publicada; referências S1–S17 cruzadas, ainda sem revisão humana final. |
| 12/11/2026 | 0.2.0 | Fase 1: C12 marcado como simplificação; valores de conteúdo centralizados em `app/data/science-values.json`; D05/D08/D09/D11/D12/D18 passam a cobrir os efeitos de eventos, módulos e ritmo. |
| 12/11/2026 | 0.3.0 | Fase 2a: mapa 10×10, ciclo de luz/sombra, preparação com 5 pontos, módulos com custos/requisitos, consumo diário, loop com pausa/velocidade e teste de 1000 partidas. Estados migrados para `proposto`/`a validar`/`verificado (humano)`; nenhum valor fica verificado sem revisão humana. |

---

*Este documento é a fonte de verdade científica do projeto. Qualquer alteração a um valor do jogo deve ser refletida aqui e em `app/data/science-values.json`.*
