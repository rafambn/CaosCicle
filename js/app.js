import Phaser from 'phaser';
import i18n from './i18n';
import Debug from './debug';

// UI Scene (including Game Over screen)
class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  create() {
    const mainScene = this.scene.get('MainScene');
    
    // Get game dimensions for responsive layout
    const gameWidth = this.sys.game.config.width;
    const gameHeight = this.sys.game.config.height;
    const isMobile = gameWidth < 768;
    
    // Painel de Game Over (responsive)
    const panelWidth = isMobile ? gameWidth - 40 : 450;
    const panelHeight = isMobile ? 380 : 420;
    
    this.gameOverPanel = this.add.container(gameWidth / 2, gameHeight / 2).setDepth(10).setVisible(false);
    
    const background = this.add.graphics().fillStyle(0x111111, 0.95).fillRect(
      -panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight
    );
    
    const title = this.add.text(0, -panelHeight / 2 + 30, i18n.get('gameOver.title'), {
      fontSize: isMobile ? '22px' : '28px',
      fill: '#ff4444'
    }).setOrigin(0.5);

    const narrativeText = this.add.text(0, -panelHeight / 2 + 70, i18n.get('gameOver.narrative'), {
      fontSize: isMobile ? '14px' : '16px',
      fill: '#cccccc',
      align: 'center',
      wordWrap: { width: panelWidth - 40 }
    }).setOrigin(0.5);
    
    // Stats section
    const statsY = -panelHeight / 2 + 130;
    this.timeSurvivedText = this.add.text(0, statsY, '', { 
      fontSize: isMobile ? '16px' : '18px' 
    }).setOrigin(0.5);
    
    this.boostGainedText = this.add.text(0, statsY + 30, '', { 
      fontSize: isMobile ? '16px' : '18px' 
    }).setOrigin(0.5);
    
    this.totalBoostText = this.add.text(0, statsY + 60, '', { 
      fontSize: isMobile ? '16px' : '18px' 
    }).setOrigin(0.5);

    // Lore section
    this.loreTitleText = this.add.text(0, statsY + 110, `--- ${i18n.get('lore.unlocked')} ---`, {
      fontSize: isMobile ? '15px' : '17px',
      fill: '#00ffff'
    }).setOrigin(0.5).setVisible(false);

    this.loreContentText = this.add.text(0, statsY + 140, '', {
      fontSize: isMobile ? '14px' : '16px',
      fill: '#dddddd',
      align: 'center',
      wordWrap: { width: panelWidth - 60 },
      fontStyle: 'italic'
    }).setOrigin(0.5).setVisible(false);

    const restartButton = this.add.rectangle(0, panelHeight / 2 - 50, 
      isMobile ? 180 : 220, 
      isMobile ? 50 : 60, 
      0x00ff00
    ).setInteractive();
    
    const restartText = this.add.text(0, panelHeight / 2 - 50, i18n.get('buttons.witnessNextCycle'), {
      fill: '#000',
      fontSize: isMobile ? '16px' : '18px'
    }).setOrigin(0.5);

    this.gameOverPanel.add([
      background, title, narrativeText, 
      this.timeSurvivedText, this.boostGainedText, this.totalBoostText,
      this.loreTitleText, this.loreContentText,
      restartButton, restartText
    ]);

    restartButton.on('pointerdown', () => {
      this.gameOverPanel.setVisible(false);
      mainScene.scene.restart({ balanceBoost: this.nextBoost });
    });

    // Listen for game over event
    mainScene.events.on('gameOver', (stats) => {
      // Hide lore texts initially
      this.loreTitleText.setVisible(false);
      this.loreContentText.setVisible(false);
      
      this.timeSurvivedText.setText(`${i18n.get('gameOver.timeSurvived')}: ${this.formatTime(stats.timeSurvived)}`);
      this.boostGainedText.setText(`${i18n.get('gameOver.aeonFragmentsGained')}: +${stats.boostGained.toFixed(4)}`);
      this.totalBoostText.setText(`${i18n.get('gameOver.totalAeonFragments')}: ${stats.newTotalBoost.toFixed(4)}`);
      
      this.nextBoost = stats.newTotalBoost;

      // Lore unlock logic
      const previousBoost = stats.newTotalBoost - stats.boostGained;
      const milestones = [10, 20, 30]; // From TODO
      let unlockedLore = null;

      for (const milestone of milestones) {
        if (previousBoost < milestone && stats.newTotalBoost >= milestone) {
          unlockedLore = i18n.get(`lore.fragments.${milestone}`);
          break; 
        }
      }

      if (unlockedLore) {
        this.loreTitleText.setVisible(true);
        this.loreContentText.setText(`"${unlockedLore}"`).setVisible(true);
      }

      this.gameOverPanel.setVisible(true);
    });
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const paddedSeconds = remainingSeconds.toString().padStart(2, '0');
    return `${minutes}:${paddedSeconds}`;
  }
}

// Main Game Scene
class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  init(data) {
    const saveData = this.loadGame();

    // Se 'data' existir, significa que a cena foi reiniciada (prestígio)
    if (data && data.balanceBoost) {
      this.creatorEssence = 0;
      this.chaoticEssence = 0;
      this.creatorStructures = 0;
      this.chaoticStructures = 0;
      this.timeSurvived = 0;
      this.balanceBoost = data.balanceBoost;
    } else if (saveData) {
      // Se não, tenta carregar do localStorage
      this.creatorEssence = saveData.creatorEssence || 0;
      this.chaoticEssence = saveData.chaoticEssence || 0;
      this.creatorStructures = saveData.creatorStructures || 0;
      this.chaoticStructures = saveData.chaoticStructures || 0;
      this.timeSurvived = saveData.timeSurvived || 0;
      this.balanceBoost = saveData.balanceBoost || 0;
    } else {
      // Se não houver nada, começa um jogo do zero
      this.creatorEssence = 0;
      this.chaoticEssence = 0;
      this.creatorStructures = 0;
      this.chaoticStructures = 0;
      this.timeSurvived = 0;
      this.balanceBoost = 0;
    }

    // Variáveis das estruturas
    this.creatorStructureBaseCost = 10;
    this.chaoticStructureBaseCost = 10;

    // Variáveis de Jogo
    this.imbalanceTimer = 0; // Temporizador para a condição de perda
    this.imbalanceLimit = 0.8; // 80% de desequilíbrio para perder
    this.isGameOver = false; // Flag para controlar o estado de fim de jogo

    // Variáveis do Sistema de Eventos
    this.activeEvents = [];
    this.eventCooldown = 10000; // Cooldown inicial de 10s antes do primeiro evento
    this.productionModifiers = {
      creator: 1.0,
      chaotic: 1.0,
    };
  }

  create() {
    // Garante que a UIScene esteja limpa e pronta
    if (this.scene.get('UIScene')) {
        this.scene.get('UIScene').scene.restart();
    }
    this.scene.launch('UIScene');

    // Get game dimensions for responsive layout
    const gameWidth = this.sys.game.config.width;
    const gameHeight = this.sys.game.config.height;
    const isMobile = gameWidth < 768;
    const scale = isMobile ? 0.8 : 1;
    
    // --- UI de Recursos (Responsive) ---
    const textSize = isMobile ? '16px' : '20px';
    const smallTextSize = isMobile ? '14px' : '16px';
    
    this.creatorEssenceText = this.add.text(20, 20, `${i18n.get('resources.chronoEssence')}: 0`, {
      fontSize: textSize,
      fill: '#fff'
    });
    
    this.chaoticEssenceText = this.add.text(gameWidth - 20, 20, `${i18n.get('resources.entropyShards')}: 0`, {
      fontSize: textSize,
      fill: '#fff'
    }).setOrigin(1, 0);
    
    this.boostText = this.add.text(gameWidth / 2, 20, `${i18n.get('resources.aeonFragments')}: ${this.balanceBoost.toFixed(4)}`, {
      fontSize: smallTextSize,
      fill: '#00ffff'
    }).setOrigin(0.5, 0);
    
    this.imbalanceTimerText = this.add.text(gameWidth / 2, gameHeight - 120, '', { 
      fontSize: isMobile ? '18px' : '22px', 
      fill: '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(5).setVisible(false);

    this.eventText = this.add.text(gameWidth / 2, 50, 'No Active Event', {
        fontSize: smallTextSize,
        fill: '#ffff00',
        align: 'center'
    }).setOrigin(0.5, 0);

    // --- Sistema de Eventos (Definição) ---
    this.eventsData = [
      {
        id: 'frozenGear',
        type: 'ORDER',
        name: 'The Frozen Gear',
        triggerCondition: (balance) => balance > 0.6,
        duration: 90000, // 90s
        start: () => {
          this.productionModifiers.chaotic *= 0.75; // -25%
        },
        end: () => {
          this.productionModifiers.chaotic /= 0.75; // Reverte o efeito
        }
      },
      {
        id: 'paradoxCascade',
        type: 'CHAOS',
        name: 'Paradox Cascade',
        triggerCondition: (balance) => balance < -0.6,
        duration: 60000, // O efeito no risco dura 60s
        start: () => {
          this.chaoticEssence *= 1.40; // +40% instantâneo
          this.imbalanceLimit *= 0.85; // Risco aumenta em 15%
        },
        end: () => {
          this.imbalanceLimit /= 0.85; // Reverte o risco
        }
      }
    ];

    // --- Botões de Geração Manual (Touch-optimized) ---
    const buttonWidth = isMobile ? 140 : 180;
    const buttonHeight = isMobile ? 50 : 60;
    const buttonY = isMobile ? 80 : 100;
    
    const creatorButton = this.add.rectangle(
      gameWidth * 0.25, 
      buttonY, 
      buttonWidth, 
      buttonHeight, 
      0x00ff00
    ).setInteractive();
    
    this.add.text(gameWidth * 0.25, buttonY, i18n.get('buttons.generateChrono'), {
      fill: '#000',
      fontSize: isMobile ? '14px' : '16px'
    }).setOrigin(0.5);
    
    creatorButton.on('pointerdown', () => { this.creatorEssence++; });

    const chaoticButton = this.add.rectangle(
      gameWidth * 0.75, 
      buttonY, 
      buttonWidth, 
      buttonHeight, 
      0xff0000
    ).setInteractive();
    
    this.add.text(gameWidth * 0.75, buttonY, i18n.get('buttons.generateEntropy'), {
      fill: '#000',
      fontSize: isMobile ? '14px' : '16px'
    }).setOrigin(0.5);
    
    chaoticButton.on('pointerdown', () => { this.chaoticEssence++; });

    // --- UI e Lógica das Estruturas (Responsive) ---
    const structureXPadding = 20;
    let creatorY = isMobile ? 150 : 170;

    // --- Creator Structures (Left Side) ---
    this.creatorStructureLevelText = this.add.text(structureXPadding, creatorY, `${i18n.get('structures.mainspringStabilizers.name')}: 0`, {
      fill: '#00ff00',
      fontSize: isMobile ? '14px' : '16px',
      fontStyle: 'bold'
    });
    creatorY += this.creatorStructureLevelText.height + 5;

    const creatorDesc = this.add.text(structureXPadding, creatorY, i18n.get('structures.mainspringStabilizers.description'), {
      fill: '#cccccc',
      fontSize: isMobile ? '12px' : '14px'
    });
    creatorY += creatorDesc.height + 5;

    const creatorFlavor = this.add.text(structureXPadding, creatorY, i18n.get('structures.mainspringStabilizers.flavor'), {
      fill: '#999999',
      fontSize: isMobile ? '11px' : '13px',
      fontStyle: 'italic',
      wordWrap: { width: gameWidth / 2 - (structureXPadding * 2) }
    });
    creatorY += creatorFlavor.height + 10;
    
    this.creatorStructureCostText = this.add.text(structureXPadding, creatorY, `${i18n.get('cost')}: 10 ${i18n.get('resources.entropyShards')}`, {
      fill: '#fff',
      fontSize: isMobile ? '12px' : '14px'
    });
    creatorY += this.creatorStructureCostText.height + 10;
    
    const btnH = buttonHeight - 10;
    const btnY = creatorY + (btnH / 2);
    const buyCreatorStructureBtn = this.add.rectangle(gameWidth * 0.25, btnY, buttonWidth, btnH, 0x00dd00).setInteractive();
    this.add.text(buyCreatorStructureBtn.x, buyCreatorStructureBtn.y, i18n.get('buttons.buyStabilizer'), { fill: '#000', fontSize: isMobile ? '12px' : '14px' }).setOrigin(0.5);
    
    buyCreatorStructureBtn.on('pointerdown', () => {
      const cost = this.getStructureCost('creator');
      if (this.chaoticEssence >= cost) {
        this.chaoticEssence -= cost;
        this.creatorStructures++;
      }
    });

    // --- Chaotic Structures (Right Side) ---
    let chaoticY = isMobile ? 150 : 170; // Reset Y for the right column
    const rightColumnX = gameWidth - structureXPadding;

    this.chaoticStructureLevelText = this.add.text(rightColumnX, chaoticY, `${i18n.get('structures.quantumLubricantInjectors.name')}: 0`, {
      fill: '#ff0000',
      fontSize: isMobile ? '14px' : '16px',
      fontStyle: 'bold'
    }).setOrigin(1, 0);
    chaoticY += this.chaoticStructureLevelText.height + 5;

    const chaoticDesc = this.add.text(rightColumnX, chaoticY, i18n.get('structures.quantumLubricantInjectors.description'), {
      fill: '#cccccc',
      fontSize: isMobile ? '12px' : '14px'
    }).setOrigin(1, 0);
    chaoticY += chaoticDesc.height + 5;

    const chaoticFlavor = this.add.text(rightColumnX, chaoticY, i18n.get('structures.quantumLubricantInjectors.flavor'), {
      fill: '#999999',
      fontSize: isMobile ? '11px' : '13px',
      fontStyle: 'italic',
      align: 'right',
      wordWrap: { width: gameWidth / 2 - (structureXPadding * 2) }
    }).setOrigin(1, 0);
    chaoticY += chaoticFlavor.height + 10;
    
    this.chaoticStructureCostText = this.add.text(rightColumnX, chaoticY, `${i18n.get('cost')}: 10 ${i18n.get('resources.chronoEssence')}`, {
      fill: '#fff',
      fontSize: isMobile ? '12px' : '14px'
    }).setOrigin(1, 0);
    chaoticY += this.chaoticStructureCostText.height + 10;
    
    const chaoticBtnY = chaoticY + (btnH / 2);
    const buyChaoticStructureBtn = this.add.rectangle(gameWidth * 0.75, chaoticBtnY, buttonWidth, btnH, 0xdd0000).setInteractive();
    this.add.text(buyChaoticStructureBtn.x, buyChaoticStructureBtn.y, i18n.get('buttons.buyInjector'), { fill: '#000', fontSize: isMobile ? '12px' : '14px' }).setOrigin(0.5);
    
    buyChaoticStructureBtn.on('pointerdown', () => {
      const cost = this.getStructureCost('chaotic');
      if (this.creatorEssence >= cost) {
        this.creatorEssence -= cost;
        this.chaoticStructures++;
      }
    });

    // --- Barra de Equilíbrio (Responsive) ---
    const balanceBarY = gameHeight - 80;
    const balanceBarWidth = gameWidth - 40;
    const balanceBarHeight = isMobile ? 40 : 50;
    const balanceBarX = 20;
    
    this.balanceBarBackground = this.add.graphics();
    this.balanceBarBackground.fillStyle(0x555555, 1);
    this.balanceBarBackground.fillRect(balanceBarX, balanceBarY, balanceBarWidth, balanceBarHeight);

    // Efeito de flash para desequilíbrio
    this.imbalanceFlash = this.add.graphics({ fillStyle: { color: 0xff0000 } });
    this.imbalanceFlash.fillRect(balanceBarX, balanceBarY, balanceBarWidth, balanceBarHeight);
    this.imbalanceFlash.setAlpha(0);
    
    // Linha central para referência
    const centerX = gameWidth / 2;
    this.add.graphics().fillStyle(0xffffff, 0.5).fillRect(centerX - 2, balanceBarY, 4, balanceBarHeight);
    
    // Marcador do equilíbrio
    this.balanceMarker = this.add.rectangle(centerX, balanceBarY + balanceBarHeight / 2, 10, balanceBarHeight - 10, 0xffff00);
    
    // Store balance bar properties for update method
    this.balanceBarProps = {
      centerX: centerX,
      width: balanceBarWidth,
      y: balanceBarY + balanceBarHeight / 2
    };

    // --- Salvamento Automático e ao Sair ---
    this.time.addEvent({
      delay: 30000, // 30 segundos
      callback: this.saveGame,
      callbackScope: this,
      loop: true
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.saveGame();
      }
    });

    // --- Debug Tools ---
    if (process.env.NODE_ENV !== 'production') {
      window.dev = new Debug(this);
    }
  }

  saveGame() {
    // Não salva se o jogo já tiver acabado, para não sobrescrever o save de reset
    if (this.isGameOver) return;

    const saveData = {
      creatorEssence: this.creatorEssence,
      chaoticEssence: this.chaoticEssence,
      creatorStructures: this.creatorStructures,
      chaoticStructures: this.chaoticStructures,
      timeSurvived: this.timeSurvived,
      balanceBoost: this.balanceBoost
    };
    localStorage.setItem('caosCicleSave', JSON.stringify(saveData));
    console.log('Game saved!');
  }

  saveResetState(newBoost) {
    const saveData = {
      creatorEssence: 0,
      chaoticEssence: 0,
      creatorStructures: 0,
      chaoticStructures: 0,
      timeSurvived: 0,
      balanceBoost: newBoost
    };
    localStorage.setItem('caosCicleSave', JSON.stringify(saveData));
    console.log('Reset state saved!');
  }

  loadGame() {
    const savedData = localStorage.getItem('caosCicleSave');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return null;
  }

  getStructureCost(type) {
    const baseCost = type === 'creator' ? this.creatorStructureBaseCost : this.chaoticStructureBaseCost;
    const level = type === 'creator' ? this.creatorStructures : this.chaoticStructures;
    return Math.floor(baseCost * Math.pow(1.15, level));
  }

  update(time, delta) {
    if (this.isGameOver) return; // Stop all update logic if game is over

    this.timeSurvived += delta / 1000; // in seconds

    // --- Event System Update ---
    const balance = this.updateBalance();
    this.updateActiveEvents(delta);
    this.handleEventTriggering(delta, balance);

    // --- Passive Generation (com modificadores de evento) ---
    this.creatorEssence += (this.creatorStructures * 1 * this.productionModifiers.creator) * (delta / 1000);
    this.chaoticEssence += (this.chaoticStructures * 1 * this.productionModifiers.chaotic) * (delta / 1000);

    // --- Update UI ---
    this.creatorEssenceText.setText(`${i18n.get('resources.chronoEssence')}: ${Math.floor(this.creatorEssence)}`);
    this.chaoticEssenceText.setText(`${i18n.get('resources.entropyShards')}: ${Math.floor(this.chaoticEssence)}`);
    this.creatorStructureLevelText.setText(`${i18n.get('structures.mainspringStabilizers.name')}: ${this.creatorStructures}`);
    this.creatorStructureCostText.setText(`${i18n.get('cost')}: ${this.getStructureCost('creator')} ${i18n.get('resources.entropyShards')}`);
    this.chaoticStructureLevelText.setText(`${i18n.get('structures.quantumLubricantInjectors.name')}: ${this.chaoticStructures}`);
    this.chaoticStructureCostText.setText(`${i18n.get('cost')}: ${this.getStructureCost('chaotic')} ${i18n.get('resources.chronoEssence')}`);

    // --- Game Over Logic ---
    this.updateGameOver(delta, balance);
  }

  updateBalance() {
    const totalEssence = this.creatorEssence + this.chaoticEssence;
    let balance = 0; // from -1 (Total Chaos) to +1 (Total Order)
    if (totalEssence > 0) {
      balance = (this.creatorEssence - this.chaoticEssence) / totalEssence;
    }

    // Update marker position (responsive)
    this.balanceMarker.x = this.balanceBarProps.centerX + (balance * (this.balanceBarProps.width / 2));
    this.balanceMarker.y = this.balanceBarProps.y;
    return balance;
  }

  handleEventTriggering(delta, balance) {
    this.eventCooldown -= delta;

    if (this.eventCooldown <= 0) {
      const possibleEvents = this.eventsData.filter(event => {
        // Evento já está ativo?
        const isEventActive = this.activeEvents.some(active => active.id === event.id);
        if (isEventActive) return false;

        // Condição de trigger é satisfeita?
        return event.triggerCondition(balance);
      });

      if (possibleEvents.length > 0) {
        const eventToTrigger = Phaser.Math.RND.pick(possibleEvents);
        this.triggerEvent(eventToTrigger);
      }

      // Reseta o cooldown mesmo que nenhum evento seja disparado, para não checar a cada frame
      this.eventCooldown = Phaser.Math.Between(30000, 60000); // Próxima checagem em 30-60s
    }
  }

  triggerEvent(event) {
    console.log(`Event triggered: ${event.name}`);
    this.eventText.setText(`Active Event: ${event.name}`);

    if (event.start) {
      event.start();
    }

    this.activeEvents.push({ ...event, remaining: event.duration });
  }

  updateActiveEvents(delta) {
    for (let i = this.activeEvents.length - 1; i >= 0; i--) {
      const event = this.activeEvents[i];
      event.remaining -= delta;

      if (event.remaining <= 0) {
        console.log(`Event ended: ${event.name}`);
        if (event.end) {
          event.end();
        }
        this.activeEvents.splice(i, 1);

        // Se não houver mais eventos, limpa o texto
        if (this.activeEvents.length === 0) {
          this.eventText.setText('No Active Event');
        }
      }
    }
  }

  updateGameOver(delta, balance) {
    // Game over logic with timer
    const currentImbalanceLimit = this.imbalanceLimit - (this.balanceBoost / 100);
    if (Math.abs(balance) > currentImbalanceLimit) {
      this.imbalanceTimer += delta;
      this.imbalanceTimerText.setText(`${i18n.get('collapse')}: ${((10000 - this.imbalanceTimer) / 1000).toFixed(1)}s`);
      this.imbalanceTimerText.setVisible(true);

      // Start flash tween if it's not already running
      if (!this.imbalanceFlashTween) {
        this.imbalanceFlashTween = this.tweens.add({
          targets: this.imbalanceFlash,
          alpha: 0.4,
          duration: 250,
          ease: 'Cubic.easeInOut',
          yoyo: true,
          repeat: -1
        });
      }

      if (this.imbalanceTimer >= 10000) {
        this.isGameOver = true; // Set game over flag
        const boostGained = this.timeSurvived / 100;
        const newTotalBoost = this.balanceBoost + boostGained;

        this.saveResetState(newTotalBoost); // Save reset state immediately

        // Stop the flash effect
        if (this.imbalanceFlashTween) {
          this.imbalanceFlashTween.stop();
          this.imbalanceFlash.setAlpha(0);
        }

        this.scene.pause();
        this.events.emit('gameOver', {
          timeSurvived: this.timeSurvived,
          boostGained: boostGained,
          newTotalBoost: newTotalBoost
        });
      }
    } else {
      this.imbalanceTimer = 0;
      this.imbalanceTimerText.setVisible(false);

      // Stop flash tween if it exists
      if (this.imbalanceFlashTween) {
        this.imbalanceFlashTween.stop();
        this.imbalanceFlashTween = null;
        this.imbalanceFlash.setAlpha(0);
      }
    }
  }
}

// Responsive game configuration
function getGameConfig() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  let gameWidth = 800;
  let gameHeight = 600;
  
  if (isMobile || screenWidth < 768) {
    gameWidth = Math.min(screenWidth, 800);
    gameHeight = Math.min(screenHeight, 600);
  }
  
  return {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    parent: 'game-container',
    backgroundColor: '#000000',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: gameWidth,
      height: gameHeight
    },
    scene: [MainScene, UIScene],
    input: {
      activePointers: 3 // Support for multi-touch
    }
  };
}

const config = getGameConfig();

const game = new Phaser.Game(config);

