# Projeto: Ciclo do Caos

## Visão Geral do Projeto

Este projeto visa criar um jogo web do gênero Clicker/Idle Incremental chamado "Ciclo do Caos". O conceito, detalhado no `Ciclo_do_Caos_GDD.markdown`, foca em balancear as forças de Criação (Ordem) e Destruição (Caos).

**Estado Atual:** O projeto encontra-se em seu estágio inicial. A estrutura de arquivos existente é um template padrão gerado pela IDE IntelliJ, com uma configuração básica de Webpack. O arquivo `index.html` é um boilerplate e a lógica em `js/app.js` está vazia. O próximo passo é integrar o framework Phaser.js e começar a implementação do MVP.

## Tecnologias (Tech Stack)

Conforme o `Ciclo_do_Caos_Tech_Stack.markdown`, as seguintes tecnologias serão utilizadas:

*   **Linguagens Base:** HTML5, CSS3, JavaScript (ES6+).
*   **Framework de Jogo:** **Phaser.js (3.x)**.
*   **Armazenamento:** `localStorage`.
*   **Áudio:** Web Audio API ou Howler.js.
*   **Ferramentas de Build:** Webpack (configuração inicial já presente).
*   **Hospedagem:** GitHub Pages, Netlify ou Itch.io.

## Como Compilar e Executar

Os comandos abaixo funcionam para o template atual com Webpack. Eles serão a base para o projeto com Phaser.

1.  **Instalar Dependências:**
    ```bash
    npm install
    ```

2.  **Executar Servidor de Desenvolvimento:**
    ```bash
    npm start
    ```

3.  **Compilar para Produção:**
    ```bash
    npm build
    ```

## Convenções de Desenvolvimento

*   **Documento Guia:** O `Ciclo_do_Caos_GDD.markdown` é a fonte principal para todas as mecânicas e funcionalidades.
*   **Próximos Passos:** O desenvolvimento deve seguir o checklist no arquivo `MVP_TODO.md`, começando pela configuração do Phaser.js dentro da estrutura Webpack existente.
*   **Armazenamento Local:** Todo o progresso do jogador será salvo no `localStorage` do navegador.
