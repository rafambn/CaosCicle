import Phaser from 'phaser';

// Cena para a Interface do Usuário (incluindo tela de Game Over)
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
    const panelWidth = isMobile ? gameWidth - 40 : 400;
    const panelHeight = isMobile ? 250 : 300;
    
    this.gameOverPanel = this.add.container(gameWidth / 2, gameHeight / 2).setVisible(false);
    const background = this.add.graphics().fillStyle(0x111111, 0.9).fillRect(
      -panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight
    );
    
    const title = this.add.text(0, -panelHeight / 2 + 40, 'O Ciclo se Reinicia', { 
      fontSize: isMobile ? '20px' : '28px' 
    }).setOrigin(0.5);
    
    this.timeSurvivedText = this.add.text(0, -30, '', { 
      fontSize: isMobile ? '14px' : '18px' 
    }).setOrigin(0.5);
    
    this.boostGainedText = this.add.text(0, 0, '', { 
      fontSize: isMobile ? '14px' : '18px' 
    }).setOrigin(0.5);
    
    const restartButton = this.add.rectangle(0, panelHeight / 2 - 40, 
      isMobile ? 120 : 150, 
      isMobile ? 40 : 50, 
      0x00ff00
    ).setInteractive();
    
    const restartText = this.add.text(0, panelHeight / 2 - 40, 'Recomeçar', { 
      fill: '#000',
      fontSize: isMobile ? '14px' : '16px'
    }).setOrigin(0.5);

    this.gameOverPanel.add([background, title, this.timeSurvivedText, this.boostGainedText, restartButton, restartText]);

    restartButton.on('pointerdown', () => {
      this.gameOverPanel.setVisible(false);
      // Reinicia a cena principal, passando o novo bônus acumulado
      mainScene.scene.restart({ balanceBoost: this.nextBoost });
    });

    // Ouvir o evento de fim de jogo
    mainScene.events.on('gameOver', (stats) => {
      this.timeSurvivedText.setText(`Tempo Sobrevivido: ${stats.timeSurvived.toFixed(2)}s`);
      this.boostGainedText.setText(`Bônus Ganhos: +${stats.boostGained.toFixed(4)}%`);
      this.nextBoost = stats.newTotalBoost; // Armazena o novo total de bônus
      this.gameOverPanel.setVisible(true);
    });
  }
}

// Cena Principal do Jogo
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
    
    this.creatorEssenceText = this.add.text(20, 20, 'Criação: 0', { 
      fontSize: textSize, 
      fill: '#fff' 
    });
    
    this.chaoticEssenceText = this.add.text(gameWidth - 20, 20, 'Caos: 0', { 
      fontSize: textSize, 
      fill: '#fff' 
    }).setOrigin(1, 0);
    
    this.boostText = this.add.text(gameWidth / 2, 20, `Bônus: ${this.balanceBoost.toFixed(4)}%`, { 
      fontSize: smallTextSize, 
      fill: '#00ffff' 
    }).setOrigin(0.5, 0);
    
    this.imbalanceTimerText = this.add.text(gameWidth / 2, gameHeight - 100, '', { 
      fontSize: isMobile ? '16px' : '18px', 
      fill: '#ff0000' 
    }).setOrigin(0.5).setVisible(false);

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
    
    this.add.text(gameWidth * 0.25, buttonY, 'Gerar Criação', { 
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
    
    this.add.text(gameWidth * 0.75, buttonY, 'Gerar Caos', { 
      fill: '#000',
      fontSize: isMobile ? '14px' : '16px'
    }).setOrigin(0.5);
    
    chaoticButton.on('pointerdown', () => { this.chaoticEssence++; });

    // --- UI e Lógica das Estruturas (Responsive) ---
    const structureY = isMobile ? 140 : 200;
    const structureTextY = isMobile ? 140 : 200;
    const structureCostY = isMobile ? 160 : 220;
    const structureButtonY = isMobile ? 200 : 280;
    
    // Creator Structures (Left side)
    this.creatorStructureLevelText = this.add.text(20, structureTextY, 'Sementes: 0', { 
      fill: '#fff',
      fontSize: isMobile ? '14px' : '16px'
    });
    
    this.creatorStructureCostText = this.add.text(20, structureCostY, 'Custo: 10 Caos', { 
      fill: '#fff',
      fontSize: isMobile ? '12px' : '14px'
    });
    
    const buyCreatorStructureBtn = this.add.rectangle(
      gameWidth * 0.25, 
      structureButtonY, 
      buttonWidth, 
      buttonHeight - 10, 
      0x00dd00
    ).setInteractive();
    
    this.add.text(gameWidth * 0.25, structureButtonY, 'Comprar Semente', { 
      fill: '#000',
      fontSize: isMobile ? '12px' : '14px'
    }).setOrigin(0.5);
    
    buyCreatorStructureBtn.on('pointerdown', () => {
      const cost = this.getStructureCost('creator');
      if (this.chaoticEssence >= cost) {
        this.chaoticEssence -= cost;
        this.creatorStructures++;
      }
    });

    // Chaotic Structures (Right side)
    this.chaoticStructureLevelText = this.add.text(gameWidth - 20, structureTextY, 'Fragmentos: 0', { 
      fill: '#fff',
      fontSize: isMobile ? '14px' : '16px'
    }).setOrigin(1, 0);
    
    this.chaoticStructureCostText = this.add.text(gameWidth - 20, structureCostY, 'Custo: 10 Criação', { 
      fill: '#fff',
      fontSize: isMobile ? '12px' : '14px'
    }).setOrigin(1, 0);
    
    const buyChaoticStructureBtn = this.add.rectangle(
      gameWidth * 0.75, 
      structureButtonY, 
      buttonWidth, 
      buttonHeight - 10, 
      0xdd0000
    ).setInteractive();
    
    this.add.text(gameWidth * 0.75, structureButtonY, 'Comprar Fragmento', { 
      fill: '#000',
      fontSize: isMobile ? '12px' : '14px'
    }).setOrigin(0.5);
    
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
    console.log('Jogo salvo!');
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
    console.log('Estado de reset salvo!');
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
    if (this.isGameOver) return; // Para completamente a lógica de update se o jogo acabou

    this.timeSurvived += delta / 1000; // em segundos

    // --- Geração Passiva ---
    this.creatorEssence += (this.creatorStructures * 1) * (delta / 1000);
    this.chaoticEssence += (this.chaoticStructures * 1) * (delta / 1000);

    // --- Atualizar UI ---
    this.creatorEssenceText.setText('Criação: ' + Math.floor(this.creatorEssence));
    this.chaoticEssenceText.setText('Caos: ' + Math.floor(this.chaoticEssence));
    this.creatorStructureLevelText.setText('Sementes: ' + this.creatorStructures);
    this.creatorStructureCostText.setText('Custo: ' + this.getStructureCost('creator') + ' Caos');
    this.chaoticStructureLevelText.setText('Fragmentos: ' + this.chaoticStructures);
    this.chaoticStructureCostText.setText('Custo: ' + this.getStructureCost('chaotic') + ' Criação');

    // --- Lógica de Equilíbrio e Fim de Jogo ---
    const totalEssence = this.creatorEssence + this.chaoticEssence;
    let balance = 0; // de -1 (Caos total) a +1 (Criação total)
    if (totalEssence > 0) {
      balance = (this.creatorEssence - this.chaoticEssence) / totalEssence;
    }

    // Atualiza a posição do marcador (responsive)
    this.balanceMarker.x = this.balanceBarProps.centerX + (balance * (this.balanceBarProps.width / 2));
    this.balanceMarker.y = this.balanceBarProps.y;

    // Nova lógica de fim de jogo com temporizador
    const currentImbalanceLimit = this.imbalanceLimit - (this.balanceBoost / 100);
    if (Math.abs(balance) > currentImbalanceLimit) {
      this.imbalanceTimer += delta;
      this.imbalanceTimerText.setText(`Colapso em: ${((10000 - this.imbalanceTimer) / 1000).toFixed(1)}s`);
      this.imbalanceTimerText.setVisible(true);

      if (this.imbalanceTimer >= 10000) {
        this.isGameOver = true; // Ativa a flag de fim de jogo
        const boostGained = this.timeSurvived / 100;
        const newTotalBoost = this.balanceBoost + boostGained;

        this.saveResetState(newTotalBoost); // Salva o estado de reset imediatamente

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

