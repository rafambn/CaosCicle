# Checklist para o MVP do Jogo "Ciclo do Caos"

Este documento detalha as tarefas necessárias para desenvolver a Versão Mínima Viável (MVP) do jogo, com base nos documentos de GDD e Tech Stack.

## Etapa 1: Configuração e Estrutura Base

- [x] **1.1. Instalar Phaser.js:** Adicionar o Phaser.js como uma dependência do projeto (`npm install phaser`).
- [x] **1.2. Integrar Phaser com Webpack:** Ajustar a configuração do Webpack (`webpack.common.js`) para que ele inclua e processe corretamente a biblioteca do Phaser.
- [x] **1.3. Limpar HTML:** Remover o conteúdo boilerplate do `index.html` e adicionar um elemento `<div id="game-container"></div>` onde o canvas do Phaser será renderizado.
- [x] **1.4. Criar a Cena Principal:** Em `js/app.js`, inicializar uma instância do jogo Phaser e criar uma cena principal (ex: `MainScene`).
- [x] **1.5. Testar a Integração:** Garantir que uma tela preta ou uma cena básica do Phaser seja exibida ao rodar `npm start`.

## Etapa 2: Mecânicas de Geração de Recursos

- [x] **2.1. Exibir Recursos:** Criar elementos de UI na cena para mostrar a contagem de "Essência Criadora" e "Essência Caótica".
- [x] **2.2. Implementar Cliques:**
    - [x] Adicionar botões ou áreas de clique na tela.
    - [x] Implementar a lógica para que o clique esquerdo gere `+1` Essência Criadora.
    - [x] Implementar a lógica para que o clique direito gere `+1` Essência Caótica (ou usar um segundo botão para mobile).
- [x] **2.3. Barra de Equilíbrio:**
    - [x] Criar um elemento visual (barra) para representar o "Equilíbrio Universal".
    - [x] Implementar a fórmula de cálculo do desequilíbrio: `|Criadora - Caótica| / (Criadora + Caótica) * 100`.
    - [x] Fazer a barra de equilíbrio ser atualizada visualmente em tempo real.

## Etapa 3: Estruturas e Geração Passiva (Idle)

- [x] **3.1. Criar UI das Estruturas:** Adicionar botões na UI para comprar a primeira estrutura de Criação ("Sementes Primordiais") e de Destruição ("Fragmentos do Vazio").
- [x] **3.2. Lógica de Compra:**
    - [x] Implementar a lógica de custo (ex: comprar "Sementes Primordiais" consome Essência Caótica).
    - [x] Descontar os recursos e registrar o nível da estrutura comprada.
    - [x] Implementar o aumento de custo a cada novo nível (Custo = Base * 1.15 ^ Nível).
- [x] **3.3. Geração Passiva:** No loop de atualização do jogo (`update()`), adicionar a geração passiva de essências com base no número e nível das estruturas.

## Etapa 4: Loop de Jogo e Reset (Prestígio)

- [x] **4.1. Condição de Fim de Run:** Implementar a lógica que detecta quando o desequilíbrio ultrapassa o limite (ex: 80%) e encerra a rodada atual.
- [x] **4.2. Cálculo de Boost:** Ao final da run, calcular o "Boost de Equilíbrio" com base no tempo sobrevivido.
- [x] **4.3. Mecanismo de Reset:**
    - [x] Criar uma função que zera os recursos e estruturas.
    - [x] Aplicar o boost permanente acumulado para a próxima rodada (ex: tornando a faixa de equilíbrio mais estável).
- [x] **4.4. UI de Fim de Jogo:** Mostrar uma tela simples de "Fim de Run" com as estatísticas (tempo, boost ganho) e um botão para recomeçar.

## Etapa 5: Persistência de Dados

- [x] **5.1. Salvar Jogo:** Criar uma função para salvar o estado do jogo (recursos, níveis de estruturas, boosts permanentes) em formato JSON no `localStorage`.
- [x] **5.2. Carregar Jogo:** Criar uma função que, ao iniciar o jogo, verifica se há um save no `localStorage` e carrega os dados.
- [x] **5.3. Salvamento Automático:** Chamar a função de salvar periodicamente (ex: a cada 60 segundos).

## Etapa 6: Polimento Mínimo do MVP

- [ ] **6.1. Feedback Visual:** Adicionar feedback simples para cliques (ex: um efeito de partícula ou mudança de cor).
- [ ] **6.2. Teste de Responsividade:** Verificar se a UI se adapta minimamente a uma tela de celular (via Chrome DevTools).
- [ ] **6.3. Deploy:** Publicar a versão MVP em um serviço como GitHub Pages ou Netlify para testes.
