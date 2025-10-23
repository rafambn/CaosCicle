# Tech Stack para Ciclo do Caos

## 1. Linguagens e Tecnologias Base
- **HTML5**: Estrutura da página e canvas para o jogo. Use `<canvas>` nativo para visuals abstratos (partículas, gradientes cósmicos).
- **CSS3**: Estilização responsiva com media queries para layouts desktop (horizontal) e mobile (vertical, botões touch-friendly). Use CSS keyframes para animações cósmicas (ex: estrelas piscando).
- **JavaScript (ES6+)**: Lógica do jogo (cliques/taps, produção idle, equilíbrio, eventos, saves). Use `setInterval` ou `requestAnimationFrame` para game loop. Offline progress via `Date.now()`.

## 2. Framework/Engine de Jogo
- **Phaser.js (3.x)**: Framework HTML5 para jogos 2D. Suporta inputs (cliques/taps, swipe), scenes, particles e animations para estilo cósmico. Responsivo, leve e ideal para MVP em 7 dias.  
  - Docs: [phaser.io/tutorials](https://phaser.io/tutorials) (busque "idle game example").
  - Motivo: Comunidade ativa, performance boa em mobile, integração fácil com ads.

## 3. Bibliotecas e Ferramentas Adicionais
- **Armazenamento**:  
  - `localStorage` (JS nativo): Salva progresso, boosts e high scores em JSON (ex: `localStorage.setItem('gameState', JSON.stringify(state))`). Limite: ~5MB, avise sobre cache.
- **Áudio**:  
  - **Web Audio API**: Música adaptativa e SFX. Carregue via `AudioContext`, ajuste volume/pitch conforme equilíbrio (ex: tenso em desequilíbrio).  
  - Opcional: **Howler.js** para áudio cross-browser simplificado.
- **Monetização (Ads Client-Side)**:  
  - **Banners**: Google AdSense (`adsbygoogle.js`). Integre via `<script>` em divs não intrusivas (ex: bottom banner).  
  - **Vídeos Recompensados**: Google Ad Placement API (H5 Games Ads). Use `adBreak({type: 'rewarded'})` para vídeos com boosts (ex: x2 produção por 5min).  
    - Docs: [developers.google.com/ad-placement](https://developers.google.com/ad-placement).  
    - Fallback: AppLixir SDK ou ayeT-Studios SDK para rewarded videos em web.  
  - Teste: Use sandbox do AdSense para simular ads sem conta real.  
- **UI e Responsividade**:  
  - **Bootstrap 5** (opcional): Grids e botões responsivos. Alternativa: Flexbox/Grid CSS puro.  
  - **Lodash** (opcional): Utilitários JS para manipulação de estados.

## 4. Ferramentas de Desenvolvimento
- **Editor**: VS Code (extensões para Phaser, JS debugging, live server).  
- **Versionamento**: Git + GitHub (backups e deploy).  
- **Testes**: Chrome DevTools (emule mobile, performance). Use Lighthouse para acessibilidade (ARIA labels).  
- **Build**: Sem bundler inicial; opcional Parcel/Webpack para minificação.

## 5. Deploy e Hosting
- **GitHub Pages** ou **Netlify**: Deploy gratuito, HTTPS, custom domains.  
- **Itch.io**: Upload direto com HTML5 embeds, suporte a monetização.  

## Considerações
- **Plano de 7 Dias**: Dia 1-2 (Phaser + loop), Dia 3 (equilíbrio/eventos), Dia 4 (visuals/áudio), Dia 5 (ads), Dia 6 (responsivo/testes), Dia 7 (polish/deploy).  
- **Vantagens**: Client-side, cross-browser, escalável.  
- **Riscos**: Ads variam por região (use fallbacks); otimize particles para mobile low-end.