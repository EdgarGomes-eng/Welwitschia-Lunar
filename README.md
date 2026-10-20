# 🌙 Welwitschia Lunar: Treinador de Missão Lunar

**"Da Baía de Luanda ao Polo Sul da Lua"**

![NASA Space Apps Challenge 2026](https://img.shields.io/badge/NASA-Space%20Apps%20Challenge%202026-blue)
![UI/UX](https://img.shields.io/badge/UI/UX-Premium%20Glassmorphism-purple)
![Language](https://img.shields.io/badge/Language-HTML%2FJS-yellow)

**Welwitschia Lunar** é um simulador educativo e interativo desenhado para ensinar os fundamentos da sobrevivência e gestão de bases lunares. O projecto coloca o utilizador no papel de Comandante de uma base no Polo Sul da Lua, onde cada decisão impacta a sobrevivência da tripulação e a integridade da infraestrutura, tudo baseado em dados reais da NASA.

## 🚀 O Conceito

O jogo transforma dados científicos complexos da NASA em mecânicas de jogo simples e intuitivas. O objectivo é equilibrar quatro recursos críticos enquanto se navega por eventos imprevistos durante uma missão de 5 dias.

### 🛠️ Mecânicas Principais
1.  **Seleção de Local**: Escolha entre locais reais (ex: Borda de Shackleton), cada um com bónus e penalidades baseados em luz, gelo e terreno.
2.  **Gestão de Recursos**: Alocação estratégica de pontos em:
    *   ❤️ **Vida**: Suporte vital, ar e água.
    *   ⚡ **Energia**: Painéis solares e baterias.
    *   🛡️ **Proteção**: Escudos contra radiação e poeira lunar.
    *   🥬 **Alimentos**: Estufas e reservas alimentares.
3.  **Simulação de Eventos**: Resolução de problemas reais (tempestades solares, falhas de comunicação) com feedback visual imediato.
4.  **NASA Debrief**: Um sistema de aprendizagem que liga cada decisão tomada a fontes oficiais da NASA (LROC, LOLA, LEND, etc.), transformando o jogo numa ferramenta educativa.

## 🎨 Experiência Visual (UI/UX Pro Max)

O projecto foi desenvolvido com um foco rigoroso em **Imersão** e **Estética Futurista**:

*   **Glassmorphism 2.0**: Interfaces translúcidas com desfoque profundo (`backdrop-filter`), saturação elevada e bordas com brilho interno, simulando projectores holográficos.
*   **Background Imersivo**: 
    *   **Parallax Starfield**: Três camadas de estrelas que reagem ao movimento do rato, criando profundidade 3D.
    *   **Nebulae Dinâmicas**: Nuvens de gás cósmico animadas que flutuam suavemente no fundo.
    *   **Luz Ambiente Reactiva**: Uma luz suave que segue o cursor e muda de cor (para vermelho) em estados críticos de alerta.
*   **Estética CRT**: Sobreposição de scanlines e um efeito de "flicker" subtil para evocar os terminais de comando das missões Apollo.
*   **Animações Fluidas**: Uso de curvas de Bézier (`cubic-bezier`) para interacções orgânicas e "saltitantes".

## 💻 Tecnologias Utilizadas

*   **Frontend**: HTML5, CSS3 (Custom Properties, Grid, Flexbox).
*   **Lógica**: Vanilla JavaScript (ES6+).
*   **Gráficos**: SVG Dinâmico e HTML5 Canvas (para o campo estelar).
*   **Dados**: JSON externo para fácil manutenção e expansão de eventos.

## 🛠️ Como Executar

Como o projecto utiliza ficheiros JSON externos, deve ser corrido através de um servidor local para evitar erros de CORS.

1.  Clone o repositório ou descarregue os ficheiros.
2.  Abra o terminal na pasta do projecto.
3.  Inicie um servidor simples com Python:
    ```bash
    python3 -m http.server 8000
    ```
4.  Aceda no seu navegador a: `http://localhost:8000/index.html`

## 🚀 Deploy (Vercel)

O projecto é um site estático puro — não precisa de build nem de dependências.

*   O ficheiro de entrada **tem de se chamar `index.html`** e estar na raiz do repositório. É este o ficheiro que a Vercel serve em `/`. Se o ficheiro tiver outro nome, todas as rotas devolvem `404 NOT_FOUND`.
*   O `game-data.json` tem de ficar na mesma raiz, porque o jogo o carrega com `fetch('game-data.json')` (caminho relativo).
*   O `vercel.json` na raiz declara o projecto como site estático (`framework: null`, `buildCommand: null`, `outputDirectory: "."`).

Fluxo de publicação: push para `main` → a Vercel faz o redeploy automaticamente (ou `npx vercel --prod` para publicar na mão).

## 🛰️ Referências Científicas

O jogo integra dados de instrumentos reais da sonda **LRO (Lunar Reconnaissance Orbiter)**:
*   **LROC**: Mapeamento de iluminação e superfície.
*   **LOLA**: Altimetria laser e relevo lunar.
*   **LEND**: Detecao de hidrogénio e gelo de água.
*   **CRaTER**: Medição de ambientes de radiação.

---
*Desenvolvido por uma equipa angolana para o NASA Space Apps Challenge 2026.*
