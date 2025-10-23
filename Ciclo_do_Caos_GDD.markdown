# CICLO DO CAOS - Game Design Document (Versão Atualizada)

## 1. Visão Geral (Overview)
**Título do Jogo:** Ciclo do Caos  
**Gênero:** Clicker/Idle Incremental com elementos de estratégia e gerenciamento de equilíbrio.  
**Plataforma Alvo:** 100% Web (HTML5), com interface responsiva para desktop e mobile. Use media queries CSS para adaptar layouts: em mobile, cliques viram taps; barra de equilíbrio central e botões maiores para touch. Teste em browsers como Chrome, Firefox e Safari (incluindo iOS/Android).  
**Público-Alvo:** Jogadores casuais de idle games (18-35 anos) que gostam de progressão infinita, temas filosóficos e mecânicas de risco/recompensa. Fãs de *Cookie Clicker*, *NGU Idle* ou *Antimatter Dimensions*.  
**Equipe de Desenvolvimento:** Solo (desenvolvedor único). Foque em prototipagem rápida: Use JavaScript puro ou framework leve como Phaser.js para mecânicas e visuals.  
**Tempo de Desenvolvimento para MVP:** 7 dias corridos (priorize loop principal, equilíbrio e monetização; expansões futuras podem estender).  
- Dia 1-2: Mecânicas core  
- Dia 3-4: UI/Visuals  
- Dia 5: Monetização/Ads  
- Dia 6: Balanceamento/Testes  
- Dia 7: Polish e Deploy (ex: GitHub Pages ou itch.io)  
**Monetização:** Banners ads (ex: Google AdSense integrado via JS) e vídeos recompensados (ex: via AdMob ou ironSource para web). Assistir vídeo dá boost momentâneo (ex: x2 produção por 5min) ou offline (ex: dobra ganhos offline). Ads client-side, sem backend.  
**Conceito Central:** Um jogo onde o jogador manipula duas forças opostas — Criação (Ordem) e Destruição (Caos) — para manter o equilíbrio do universo o maior tempo possível. Desequilíbrio causa "perda" (fim da run), reiniciando com boosts baseados na duração anterior. Tema: O universo como um ciclo eterno, inspirado em filosofias como o yin-yang ou o caos primordial. Sem backend: Salve progresso via localStorage (JSON para recursos e boosts).

## 2. Mecânicas de Gameplay (Loop Principal)
O loop é baseado em cliques/taps manuais e produção idle. Foco em sobrevivência: Manter equilíbrio para maximizar tempo de run. Progressão client-side, com saves automáticos a cada minuto.

1. **Clique/Tap e Geração de Energia:**  
   - Clique esquerdo/tap esquerdo: Gera Essência Criadora (+1 por clique base).  
   - Clique direito/tap direito: Gera Essência Caótica (+1 por clique base). Em mobile, use botões dedicados ou swipe para diferenciar.  
   - Produção idle: Estruturas geram energia passivamente (0.1/s por estrutura). Use Date.now() para calcular tempo offline.  
   - Fórmula: Energia Total = (Cliques) + (Produção Idle * Tempo Delta).  

2. **Conversão e Construção:**  
   - Use Essências para construir/upgradar estruturas. Cada estrutura consome essência oposta para incentivar equilíbrio (ex: Construir Criação custa Caos).  
   - Custo: Base * (1.15 ^ Nível), armazenado localmente.  

3. **Equilíbrio Universal:**  
   - Medido como %: Equilíbrio = |Essência Criadora - Essência Caótica| / Total Essências * 100 (quanto menor, melhor; ideal <10%).  
   - Meta: Manter equilíbrio baixo o maior tempo possível. Barra visual enche com desequilíbrio (>30% avisa; >50% acelera perda).  
   - Desequilíbrio: >50% causa eventos negativos crescentes; >80% = Perda automática (fim da run). Tempo de run medido em segundos/minutos.  
   - Boosts de Ads: Assistir vídeo reseta parcial desequilíbrio ou dá x1.5 produção por tempo limitado.  

4. **Reset (Fim de Run e Nova Rodada):**  
   - Não há reset voluntário; ocorre por desequilíbrio (>80%). Meta: Sobreviver o máximo (high score em tempo).  
   - Ao perder: Calcula boost para próxima run: Boost = Tempo Sobrevivido (seg) / 100 * 1% estabilidade extra.  
   - Nova rodada: Zera recursos, aplica boost permanente cumulativo (+5% faixa de equilíbrio por run longa). Use localStorage para high scores e boosts.  
   - Progressão Offline: 50% produção enquanto aba fechada (calcule via timestamp). Boost de vídeo dobra isso.

## 3. Recursos Principais
- **Essência Criadora:** Para criação. Gerada por Ordem.  
- **Essência Caótica:** Para destruição. Gerada por Caos.  
- **Equilíbrio Universal:** Métrica de sobrevivência (baixa = bom).  
- **Boost de Equilíbrio:** Moeda de progressão entre runs (acumula com tempo sobrevivido).  
- **Energia Primordial:** Neutra, gerada por equilíbrio perfeito, usada para boosts raros (salva localmente).

## 4. Estruturas e Upgrades
Árvores simples com 5 tiers cada, desbloqueados por essências. Upgrades aumentam produção, mas arriscam desequilíbrio se focar em um lado.

**Criação (Ordem):**
1. Sementes Primordiais: 1 Essência/s. Custo: 10 Caótica.  
2. Artesãos Estelares: +5% eficiência. Custo: 50.  
3. Arquitetos da Ordem: Automação básica. Custo: 200.  
4. Mundos Harmônicos: +5% estabilidade. Custo: 1000.  
5. Bibliotecas da Eternidade: +10% boost em resets. Custo: 5000.

**Destruição (Caos):**
1. Fragmentos do Vazio: 1 Essência/s. Custo: 10 Criadora.  
2. Devastadores: +5% eventos benéficos. Custo: 50.  
3. Fendas Entópicas: Acelera riscos (para runs agressivas). Custo: 200.  
4. Colapsos Singulares: +20% boost em perda. Custo: 1000.  
5. Devoradores do Tempo: Reduz tempo idle. Custo: 5000.

**Upgrades Gerais:** Comprados com Boosts, como "Estabilidade Inicial" (+10% equilíbrio no start).

## 5. Eventos Dinâmicos
Aleatórios via Math.random(), baseados em equilíbrio. Cooldown: 30s-1min.

- Estagnação Cósmica: (>50% Criação) Produção -20% por 2min.  
- Colapso Universal: (>50% Destruição) Acelera perda, mas +boost se sobreviver.  
- Renovação do Ciclo: (<20% desequilíbrio) x1.5 produção por 1min.  
- Ecos do Passado: Recupera 5% recursos (raro).  
- Cicatrizes do Caos: Debuff temporário, removível com ads.  
- Anomalia Dimensional: Inverte essências por 30s.

## 6. Sistema de Boosts
- **Mecânica:** Ao fim da run, ganhe Boost = Tempo Sobrevivido (seg) / 100. Acumule para upgrades permanentes.  
- **Habilidades:**  
  - Equilíbrio Instintivo: +5% faixa segura. Custa 10 Boost.  
  - Caos Controlado: -10% penalidades. Custa 20.  
  - Criação Corrompida: Auto-conversão 2%. Custa 30.  
- **Meta-Progresso:** Após runs longas, desbloqueie modos (ex: hardcore com equilíbrio mais rígido).

## 7. Estilo Visual e Áudio
- **Visual:** Abstrato cósmico. Responsivo: Mobile layout vertical; desktop horizontal. Barra equilíbrio full-width. Use CSS animations para partículas.  
- **Áudio:** Ambiente adaptativo (Web Audio API). Sons leves para cliques/events. Opcional mute para mobile.  
- **Acessibilidade:** Touch-friendly, high contrast, screen reader support (ARIA labels).

## 8. Tom Narrativo
Poético: Pop-ups como "O equilíbrio treme... segure o ciclo!" Lore via tooltips.

## 9. Expansões Futuras
- Civilizações: NPCs reativos.  
- Ritmos Dimensionais: Modos assíncronos (sem backend, via local).  
- Multiversal: Universos paralelos.  
- Mais Conteúdo: Pode estender além dos 7 dias (ex: novos eventos).

## 10. Balanceamento e Testes
- Fórmulas: Simples JS (ex: setInterval para ticks).  
- Metas: Runs iniciais 5-10min; Com boosts: 30min+.  
- Testes: Emuladores mobile (Chrome DevTools). Foque em não-frustração.

## 11. Riscos e Considerações
- Solo Dev: Priorize MVP mínimo.  
- Sem Backend: LocalStorage limita saves (até 5MB); avise sobre limpezas de cache.  
- Ads: Integre non-intrusivamente; teste cross-browser.  
- Próximos Passos: Comece com loop em JS; deploy rápido.