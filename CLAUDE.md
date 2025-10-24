# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Ciclo do Caos** is a browser-based idle/clicker game built with Phaser.js 3 and vanilla JavaScript. It's a solo developer project deployed to GitHub Pages via the `docs/` folder. The game focuses on managing balance between two opposing forces (Creation vs. Chaos) to survive as long as possible before imbalance triggers a reset.

**Tech Stack:**
- Phaser.js 3.90.0 (game framework)
- HTML5/CSS3/JavaScript (ES6+)
- Webpack 5 (bundler with hot reload)
- localStorage (state persistence, no backend)

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (hot reload, auto-open browser)
npm start

# Build production bundle to docs/ (for GitHub Pages)
npm build

# Tests (currently placeholder)
npm test
```

## Architecture Overview

### High-Level Structure

The game is a **two-scene Phaser application** with all logic in `/js/app.js`:

1. **MainScene** - Game loop, state management, resource generation, building system
2. **UIScene** - Game Over screen and results display

**State Flow:**
```
Load saved state (localStorage)
  ↓
MainScene creates (UI, buttons, balance bar)
  ↓
Game loop: update() called every frame
  ↓
Manual clicks + passive structure generation
  ↓
Balance calculation: |Creator - Chaos| / Total
  ↓
If imbalance > 80% → Game Over after 10s countdown
  ↓
Calculate boost based on time survived
  ↓
Persist new boost to localStorage
  ↓
MainScene restarts with accumulated boost
```

### Core Game Objects (MainScene)

**Resources:**
- `creatorEssence` - Primary resource from green button/structures
- `chaoticEssence` - Primary resource from red button/structures
- `balanceBoost` - Prestige currency carried between runs

**Structures:**
- `creatorStructures` - Count of Creator buildings (passive income)
- `chaoticStructures` - Count of Chaos buildings (passive income)

**State Management:**
- `timeSurvived` - Elapsed seconds in current run
- `imbalanceTimer` - Countdown to game over (0-10s)
- `imbalanceLimit` - Threshold percentage (80%)
- `isGameOver` - Game state flag

### Key Methods

**MainScene.update(time, delta)**
```
Each frame:
1. Increment timeSurvived by delta/1000
2. Calculate balance percentage
3. If balance > 80%, start 10s countdown
4. If countdown reaches 0, trigger game over
5. Generate passive income from structures (essences * delta/1000)
6. Update UI text
7. Save game every 30 seconds
```

**Structure Costs (Exponential)**
```
Cost = BasePrice * (1.15 ^ Level)
Example: Creator structures cost Chaos, Chaos structures cost Creator
```

**Save/Load System**
```
localStorage key: "caosCicleSave"
Saves: {creatorEssence, chaoticEssence, creatorStructures, chaoticStructures, timeSurvived, balanceBoost}
Auto-save: Every 30s or on tab visibility change
```

## Build Process

### Webpack Configuration

**Files:**
- `webpack.common.js` - Shared config (entry, output, plugins)
- `webpack.config.dev.js` - Development (HMR, source maps, inline)
- `webpack.config.prod.js` - Production (minified, asset copy)

**Key Points:**
- Entry: `js/app.js`
- Output: `docs/` (for GitHub Pages)
- Plugins: HtmlWebpackPlugin generates index.html, CopyPlugin copies static assets
- Dev server: Serves from root, auto-opens browser on `npm start`

### Deployment

Output directory is `docs/` (not `dist/`) to support GitHub Pages. Production build copies:
- Bundled `js/app.js` → `docs/js/app.js`
- CSS, images, icons → `docs/`
- Generates `docs/index.html` from template

## Responsive Design

### Breakpoints

**Mobile (< 768px):**
- Buttons: 140px × 50px, smaller fonts
- Game Over panel: Full width - 40px
- Reduced spacing and text sizes

**Desktop (≥ 768px):**
- Buttons: 180px × 60px, standard fonts
- Game Over panel: 400px fixed width
- Full-size layout

### CSS Strategy

- Mobile-first media queries in `css/style.css`
- Touch optimizations: `@media (hover: none) and (pointer: coarse)`
- Canvas responsive sizing via Phaser config

## Game Loop Logic

### Balance Calculation

```javascript
imbalance = Math.abs(creatorEssence - chaoticEssence) / (creatorEssence + chaoticEssence) * 100
```

If > 80%:
1. Show red countdown timer
2. Start 10-second countdown to game over
3. On timer = 0, trigger `gameOver` event

### Passive Generation

```javascript
essenceGain = structures * (delta / 1000)
// e.g., 5 structures generate 5 essence per second
```

### Game Over Event

Emitted by MainScene, caught by UIScene:
```javascript
mainScene.events.emit('gameOver', {
  timeSurvived: 123.45,
  boostGained: 1.2345,
  newTotalBoost: 10.5 // cumulative across runs
})
```

## State Persistence

All state saved to localStorage as JSON. No encryption or validation; warns user about cache clearing. Boost is **cumulative** across runs — new runs use previous `balanceBoost` value.

## Future Extensions (from TODO.txt)

**Priority TODOs:**
1. Dynamic events system (random events triggered by balance conditions)
2. Permanent boost abilities (purchasable with `balanceBoost`)
3. Complete 5-tier structure trees (currently only tier 1 visible)
4. Video ad integration (watch for 2x production or balance reset)
5. Primordial Energy (neutral resource from perfect balance)
6. Offline progression (50% production when tab closed)

**Current MVP coverage:**
- ✅ Core game loop and balance system
- ✅ Structure purchase and passive income
- ✅ Game over and prestige reset
- ✅ Responsive UI
- ✅ Save/load state
- ❌ Events, ads, advanced structures

## Code Style Notes

- **Language:** JavaScript ES6+ with Phaser 3 (class-based scenes)
- **No linters configured** — manual code review needed
- **All game logic in one file** (`js/app.js`) for MVP simplicity
- **Phaser geometry objects** for buttons (rectangles) and text
- **Phaser events** for communication between scenes (`gameOver`, `pointerdown`)

## Performance Considerations

- Update loop runs every frame (~60fps target)
- localStorage writes throttled to 30s intervals
- No animation loops or particle systems yet
- Mobile touch support via Phaser's input system (3 pointers max)

## Testing & Debugging

- **No automated tests** — manual testing only
- **Browser DevTools:** Chrome mobile emulation recommended for responsive testing
- **Debug output:** Check browser console for errors
- **State inspection:** Open browser console and check `localStorage.getItem('caosCicleSave')`

## Common Tasks

### Add a New Resource Type

1. Add property to `MainScene.init()` and save schema
2. Add UI text display in `create()`
3. Update generation logic in `update()`
4. Include in `saveGame()` and `loadGame()` JSON

### Add a New Event

1. Create event trigger condition in `MainScene.update()`
2. Emit event with `this.events.emit('eventName', data)`
3. Listen in UIScene: `mainScene.events.on('eventName', ...)`
4. Update related state (resources, timers, etc.)

### Modify Costs or Generation Rates

- **Costs:** `getStructureCost(type)` uses exponential formula (1.15x multiplier)
- **Generation:** Passive income proportional to `structures * (delta / 1000)`
- **Balance threshold:** `imbalanceLimit` property (currently 0.8 = 80%)

### Deploy to GitHub Pages

```bash
npm run build
git add docs/
git commit -m "Deploy build"
git push origin main
# GitHub Pages auto-publishes from docs/ folder
```

## File Structure Quick Reference

```
D:\MyProjects\CaosCicle/
├── js/app.js                        # All game logic (MainScene + UIScene)
├── css/style.css                    # Responsive styles
├── index.html                       # Entry template (Webpack generates output)
├── webpack.common.js                # Shared Webpack config
├── webpack.config.dev.js            # Dev server config
├── webpack.config.prod.js           # Production build config
├── package.json                     # Dependencies & scripts
├── Ciclo_do_Caos_GDD.markdown      # Full game design document
├── TODO.txt                         # Remaining features list
└── docs/                            # Build output (GitHub Pages)
```

## Resources & Documentation

- **Game Design:** See `Ciclo_do_Caos_GDD.markdown` for complete design doc
- **Tech Stack:** See `Ciclo_do_Caos_Tech_Stack.markdown`
- **Phaser Docs:** https://photonstorm.github.io/phaser3-docs
- **Webpack Docs:** https://webpack.js.org/
