# CICLO DO CAOS - Game Design Document (Versão Atualizada)
## Tópico Narrativo: O ZELADOR DO ÚLTIMO RELÓGIO

## 1. Visão Geral (Overview)
**Título do Jogo:** Ciclo do Caos: O Zelador do Último Relógio
**Gênero:** Clicker/Idle Incremental com elementos de estratégia e gerenciamento de equilíbrio.
**Plataforma Alvo:** 100% Web (HTML5), com interface responsiva para desktop e mobile. Use media queries CSS para adaptar layouts: em mobile, cliques viram taps; barra de equilíbrio central e botões maiores para touch. Teste em browsers como Chrome, Firefox e Safari (incluindo iOS/Android).
**Público-Alvo:** Jogadores casuais de idle games (18-35 anos) que gostam de progressão infinita, temas filosóficos, narrativa contemplativa e mecânicas de risco/recompensa. Fãs de *Cookie Clicker*, *NGU Idle*, *Antimatter Dimensions* e *Manifold Garden*.
**Equipe de Desenvolvimento:** Solo (desenvolvedor único). Foque em prototipagem rápida: Use JavaScript puro ou framework leve como Phaser.js para mecânicas e visuals.
**Tempo de Desenvolvimento para MVP:** 7 dias corridos (priorize loop principal, equilíbrio, narrativa visual e monetização; expansões futuras podem estender).
- Dia 1-2: Mecânicas core + flavor text narrativo
- Dia 3-4: UI/Visuals + estética relógio cósmico
- Dia 5: Monetização/Ads + eventos temáticos
- Dia 6: Balanceamento/Testes
- Dia 7: Polish e Deploy (ex: GitHub Pages ou itch.io)
**Monetização:** Banners ads (ex: Google AdSense integrado via JS) e vídeos recompensados (ex: via AdMob ou ironSource para web). Assistir vídeo dá boost momentâneo (ex: x2 produção por 5min) ou offline (ex: dobra ganhos offline). Ads client-side, sem backend.
**Conceito Central:** Você é o guardião de um **Relógio Cósmico Ancestral** que mantém a coesão temporal do multiverso. Cada tique representa bilhões de realidades sincronizadas. Seu trabalho: manter os ponteiros em movimento harmônico, equilibrando as duas forças opostas — **Chrono-Essence** (Ordem/Criação) e **Entropy Shards** (Caos/Destruição). Desequilíbrio causa "rachaduras nos ponteiros" (fim da run), forçando um reset emergencial. Cada run é um "turno de manutenção" antes da próxima catástrofe temporal. Boosts acumulam como **Aeon Fragments** (Horological Mastery), revelando camadas de lore e mistério sobre o relógio e sua própria identidade. Tema: O tempo como metáfora cósmica, filosófias de ordem/caos, e a ilusão de um ciclo eterno. Sem backend: Salve progresso via localStorage (JSON para recursos, boosts e aeon fragments).

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
**Recursos de Produção:**
- **Chrono-Essence** (antes: Essência Criadora): Óleo temporal que lubrifica as engrenagens. Gerada por estruturas de Ordem. Cliques verdes produzem diretamente.
- **Entropy Shards** (antes: Essência Caótica): Fragmentos de futuros que nunca aconteceram. Gerada por estruturas de Caos. Cliques vermelhos produzem diretamente.

**Metricas de Status:**
- **Phase Deviation Meter** (antes: Equilíbrio Universal): Medição de desvio temporal. Valores: 0% = Relógio congelado (Ordem total), 50% = Movimento harmônico ideal, 100% = Relógio descontrolado (Caos total). Métrica de sobrevivência (ficar perto de 50% = bom).

**Moedas de Progressão:**
- **Aeon Fragments** (antes: Boost de Equilíbrio): Fragmentos de eras perdidas. Moeda de prestígio acumulada entre runs. Calculada como: Fragmentos Ganhos = Tempo Sobrevivido (seg) / 100. Usada para desbloquear upgrades permanentes, "Ancient Blueprints" e "Horological Mastery" abilities.
- **Primordial Oils** (antes: Energia Primordial): Recurso neutro raro, gerado por equilíbrio perfeito (<5% Phase Deviation). Usada para boosts raros e temporários (ex: +20% produção por 60s). Salva localmente no localStorage.

## 4. Estruturas e Upgrades (Mecanismos do Relógio)
Árvores simples com 5 tiers cada, desbloqueados por essências. Upgrades aumentam produção, mas arriscam desequilíbrio se focar em um lado. Cada estrutura tem **flavor text narrativo** descrevendo seu papel na manutenção do relógio cósmico.

**FACÇÃO DA ORDEM - "Os Arquitetos Eternos" (Produzem Chrono-Essence):**
Estruturas que lubrificam, estabilizam e mantêm o movimento controlado do relógio.

1. **Mainspring Stabilizers** (Estabilizadores de Mola Mestra): 1 Chrono-Essence/s. Custo: 10 Entropy Shards. Flavor: *"Every second costs eternity. These springs ensure time flows, never stops."*
2. **Gear Calibration Arrays** (Matrizes de Calibração): +5% eficiência de Chrono-Essence. Custo: 50 Entropy Shards. Flavor: *"Precision beyond measure. Teeth mesh perfectly across dimensional boundaries."*
3. **Temporal Governors** (Reguladores Temporais): +10% de produção base. Custo: 200 Entropy Shards. Flavor: *"Ancient mechanisms that remember when time flowed freely. They teach the gears patience."*
4. **Eternal Keepers** (Guardiões Eternos): +15% Phase Deviation tolerance. Custo: 1000 Entropy Shards. Flavor: *"Sentinels who've watched galaxies age. Their presence calms the rhythm."*
5. **Primordial Pendulums** (Pêndulos Primordiais): +20% Aeon Fragment gains on reset. Custo: 5000 Entropy Shards. Flavor: *"The first mechanisms ever crafted. Time remembers them. They remember time."*

**FACÇÃO DO CAOS - "Os Aceleradores" (Produzem Entropy Shards):**
Estruturas que injetam, catalisam e provocam desestabilização acelerada do relógio (risco/recompensa).

1. **Quantum Lubricant Injectors** (Injetores de Lubrificante Quântico): 1 Entropy Shard/s. Custo: 10 Chrono-Essence. Flavor: *"Liquid paradox. What flows backward also moves forward—both, neither, eternally."*
2. **Paradox Coils** (Bobinas de Paradoxo): +5% velocidade de eventos. Custo: 50 Chrono-Essence. Flavor: *"Coils that sing with contradictions. They make broken things move faster."*
3. **Possibility Valves** (Válvulas de Possibilidade): +10% Entropy Shard generation. Custo: 200 Chrono-Essence. Flavor: *"Every path not taken floods through here. The unrealized futures yearn for form."*
4. **Singularity Cores** (Núcleos de Singularidade): +20% boost gains on catastrophic Phase Deviation. Custo: 1000 Chrono-Essence. Flavor: *"Black holes where time folds. Risk everything. The void rewards the reckless."*
5. **Apocalypse Engines** (Motores do Apocalipse): -30% time to Phase Deviation catastrophe (risky!). Custo: 5000 Chrono-Essence. Flavor: *"Build these if you dare. They accelerate the end so you can begin again, amplified."*

**Upgrades Gerais Permanentes (Horological Mastery):** Comprados com Aeon Fragments, desbloqueados conforme você avança. Exemplos:
- **Primordial Oils** (Óleos Primordiais): +5% Phase Deviation tolerance no início de cada run. Custa 10 Aeon Fragments.
- **Ancient Blueprints** (Planos Antigos): Todas as estruturas começam +10% mais eficientes. Custa 25 Aeon Fragments.
- **Time-Worn Wisdom** (Sabedoria Desgastada pelo Tempo): Vê previamente qual evento vai ocorrer nos próximos 30s. Custa 50 Aeon Fragments.
- **Eternal Patience** (Paciência Eterna): -10% todas as penalidades de eventos. Custa 75 Aeon Fragments.

## 5. Eventos Dinâmicos (Manifestações Temporais)
Aleatórios via Math.random(), baseados em Phase Deviation. Cooldown: 30s-1min entre eventos. Cada evento tem **flavor text poético** que amplifica a narrativa do relógio.

**Eventos de ORDEM (Acionados quando Phase Deviation > 60% para Chrono-Essence):**
- **"The Frozen Gear" (A Engrenagem Congelada):** Produção de Entropy Shards -25% por 90s. Flavor: *"An Architect has seized a mechanism. The gears grind slower. Freedom crystallizes into stasis."*
- **"Temporal Anchor Surge" (Ondulação de Âncora Temporal):** +30% Chrono-Essence generation por 60s. Flavor: *"Anchors pulse with power. Time settles. The clock finds its rhythm again, but for how long?"*
- **"The Hour Hand Trembles" (O Ponteiro das Horas Estremece):** Neutral tension event - +5% Phase Deviation tolerance temporário. Flavor: *"Reality holds its breath. Something vast is looking at the mechanism. You feel seen."*

**Eventos de CAOS (Acionados quando Phase Deviation > 60% para Entropy Shards):**
- **"Paradox Cascade" (Cascata de Paradoxo):** Entropy Shards jump +40%, Phase Deviation risk increases. Flavor: *"Contradictions flood the system. Futures that should never meet collide. The clock screams."*
- **"Temporal Rupture" (Ruptura Temporal):** -30% Chrono-Essence generation por 2min, mas +50% Aeon Fragment gain if you survive. Flavor: *"A crack appears in the gears. Time leaks from the edges. But from the fracture, wisdom flows."*
- **"Quantum Lubricant Surge" (Injeção de Lubrificante Quântico):** +50% Entropy Shard generation por 45s, Phase Deviation skyrockets. Flavor: *"The Accelerators flood the system with possibility. The clock spins faster, faster. Control slips."*

**Eventos NEUTROS (Aleatórios, independentes de Phase Deviation):**
- **"Echoes from Your Last Shift" (Ecos de Seu Último Turno):** Recupera 5% de recursos baseado em como a run anterior terminou. Flavor: *"A memory surfaces. You remember... a voice calling your name. What was it?"* (Raro, Tier 2+)
- **"The Clock Ticks Twice" (O Relógio Marca Duas Vezes):** Produção x1.5 por 30s quando Phase Deviation < 10%. Flavor: *"Perfect harmony. The mechanisms dance. Just for a moment, time sings."*
- **"Silent Maintenance Window" (Janela de Manutenção Silenciosa):** 20s sem eventos. Flavor: *"The clock rests. You can breathe. These moments are precious. They don't last."*
- **"Temporal Echo from the Last Era" (Eco Temporal da Última Era):** Desbloqueia fragmento de lore sobre o relógio. Flavor: *"A fragment of memory: 'The first Keeper built this from the ruins of a dead universe. Why?'"* (Raro, Tier 2+)

## 6. Sistema de Prestígio - Horological Mastery
Ao fim de cada run (seja por catástrofe temporal ou voluntário via ads), o jogador acumula **Aeon Fragments** como moeda de progressão permanente. Cada Aeon Fragment desbloqueado traz fragmentos de história sobre o relógio.

**Fórmula de Ganho:**
```
Aeon Fragments Ganhos = Tempo Sobrevivido (segundos) / 100
Exemplo: Sobreviveu 245 segundos → Ganhou 2,45 Aeon Fragments (arredondado para 2)
```

**Upgrades Desbloqueáveis (Horological Mastery Tiers):**
1. **Primordial Oils** (Óleos Primordiais) - 10 Aeon Fragments
   - +5% Phase Deviation tolerance no início de cada run
   - Flavor: *"Ancient oils extracted from defunct timelines. They make the gears more forgiving."*

2. **Ancient Blueprints** (Planos Antigos) - 25 Aeon Fragments
   - Todas as estruturas começam +10% mais eficientes em novas runs
   - Flavor: *"Designs from civilizations that mastered temporal mechanics. You're beginning to remember."*

3. **Time-Worn Wisdom** (Sabedoria Desgastada pelo Tempo) - 50 Aeon Fragments
   - Vê qual evento ocorrerá nos próximos 30s (tooltip previamente)
   - Flavor: *"Memories of past eras crystallize. You see patterns. Repetition. Purpose?"*

4. **Eternal Patience** (Paciência Eterna) - 75 Aeon Fragments
   - -15% severidade de todas as penalidades de eventos
   - Flavor: *"You've done this before. Many times. Your hands know the rhythm."*

5. **Causal Insight** (Compreensão Causal) - 150 Aeon Fragments
   - +25% Aeon Fragment gain (runs pagam mais bônus)
   - Flavor: *"You understand now: Each cycle feeds the next. You are trapped. But you are learning."*

**Meta-Progresso:**
- A cada 10 Aeon Fragments obtidos cumulativamente, desbloqueia um fragmento de lore: *"Who constructed the clock? Why were you chosen?"*
- Após 100 Aeon Fragments totais: "Hardcore Mode" desbloqueado (Phase Deviation tolerance -20%, mas +50% Aeon Fragment gain)
- Após 250 Aeon Fragments totais: "Asymptote Challenge" (relógio torna-se cada vez mais difícil de balancear, mas rewarda exponencialmente)

## 7. Estilo Visual e Áudio
- **Visual:** Abstrato cósmico. Responsivo: Mobile layout vertical; desktop horizontal. Barra equilíbrio full-width. Use CSS animations para partículas.  
- **Áudio:** Ambiente adaptativo (Web Audio API). Sons leves para cliques/events. Opcional mute para mobile.  
- **Acessibilidade:** Touch-friendly, high contrast, screen reader support (ARIA labels).

## 8. Tom Narrativo & Estética
**Estilo de Linguagem:** Épico-Contemplativo. Formal mas não arcaico. Poético mas acessível.
- Exemplos: *"The gears grind"* (não *"Hark, the mechanisms doth protest"*)
- Foco em imagens sensoriais: tempo como mecanismo, paradoxos como cacos, futuro como óleo

**Entrega de Narrativa:**
- **Flavor Text em TODOS os upgrades:** Cada estrutura e upgrade tem uma frase que contextualiza seu papel
- **Tooltips com Lore:** Hover em estruturas mostra minihistória (ex: "Mainspring - Since the First Age, these have kept time flowing. But at what cost?")
- **Pop-ups Poéticos em Eventos:** Não apenas números, mas contexto emocional (ex: "The gears have shattered. Time fractures. Resetting to last stable moment...")
- **Game Over Narrativo:** *"The gears have shattered. Time fractures. Resetting to last stable moment... but something remains. Memory persists."*
- **Fragmentos de Lore Desbloqueáveis:** Sistema de conquistas/marcos que revelam história aos poucos

**Tema Visual-Narrativo:**
- **Steampunk Cósmico:** Bronze, latão, cristal, nebulosas refletidas em engrenagens
- **Números do Relógio:** Números romanos aparecem sutilmente em backgrounds (XII, VI, III)
- **Barra de Equilíbrio como Pêndulo:** Visualmente oscila entre 0% (congelado) e 100% (acelerado)
- **Ponteiros Animados:** UI mostra ponteiros de relógio se movendo em tempo real

**Progressão Narrativa (12 Mecanismos Secretos):**
1. Cada run bem-sucedida (ou manutenção longeva) desbloqueia 1/12 de um mecanismo secreto
2. À medida que descobre, a narrativa se expande:
   - Mecanismo 1-3: *"Who am I? Why do I remember the last cycle?"*
   - Mecanismo 4-6: *"The clock is older than time itself. I've seen it break before."*
   - Mecanismo 7-9: *"The Accelerators and the Architects... they are part of ME. Fragmented."*
   - Mecanismo 10-12: *"I am the last Keeper. Or the first? The clock doesn't remember. Maybe it never did."*
3. **Final Twist (Mecanismo 12 Revelado):** Você descobre que é um fragmento temporal aprisionado em loop — "O 'último zelador' foi você mesmo em um ciclo anterior". A narrativa questiona a natureza da identidade e livre arbítrio em um universo cíclico.

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