import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });

    // Variáveis de recursos
    this.creatorEssence = 0;
    this.chaoticEssence = 0;

    // Variáveis das estruturas
    this.creatorStructures = 0;
    this.chaoticStructures = 0;
    this.creatorStructureBaseCost = 10;
    this.chaoticStructureBaseCost = 10;
  }

  preload() {
    // Carregue seus assets aqui
  }

  create() {
    // --- UI de Recursos ---
    this.creatorEssenceText = this.add.text(50, 30, 'Criação: 0', { fontSize: '20px', fill: '#fff' });
    this.chaoticEssenceText = this.add.text(650, 30, 'Caos: 0', { fontSize: '20px', fill: '#fff' });

    // --- Botões de Geração Manual ---
    const creatorButton = this.add.rectangle(150, 100, 180, 60, 0x00ff00).setInteractive();
    this.add.text(150, 100, 'Gerar Criação', { fill: '#000' }).setOrigin(0.5);
    creatorButton.on('pointerdown', () => {
      this.creatorEssence++;
    });

    const chaoticButton = this.add.rectangle(650, 100, 180, 60, 0xff0000).setInteractive();
    this.add.text(650, 100, 'Gerar Caos', { fill: '#000' }).setOrigin(0.5);
    chaoticButton.on('pointerdown', () => {
      this.chaoticEssence++;
    });

    // --- UI e Lógica das Estruturas ---
    // Estrutura de Criação
    this.creatorStructureLevelText = this.add.text(50, 200, 'Sementes: 0', { fill: '#fff' });
    this.creatorStructureCostText = this.add.text(50, 220, 'Custo: 10 Caos', { fill: '#fff' });
    const buyCreatorStructureBtn = this.add.rectangle(150, 280, 180, 50, 0x00dd00).setInteractive();
    this.add.text(150, 280, 'Comprar Semente', { fill: '#000' }).setOrigin(0.5);
    buyCreatorStructureBtn.on('pointerdown', () => {
      const cost = this.getStructureCost('creator');
      if (this.chaoticEssence >= cost) {
        this.chaoticEssence -= cost;
        this.creatorStructures++;
      }
    });

    // Estrutura de Caos
    this.chaoticStructureLevelText = this.add.text(550, 200, 'Fragmentos: 0', { fill: '#fff' });
    this.chaoticStructureCostText = this.add.text(550, 220, 'Custo: 10 Criação', { fill: '#fff' });
    const buyChaoticStructureBtn = this.add.rectangle(650, 280, 180, 50, 0xdd0000).setInteractive();
    this.add.text(650, 280, 'Comprar Fragmento', { fill: '#000' }).setOrigin(0.5);
    buyChaoticStructureBtn.on('pointerdown', () => {
      const cost = this.getStructureCost('chaotic');
      if (this.creatorEssence >= cost) {
        this.creatorEssence -= cost;
        this.chaoticStructures++;
      }
    });


    // --- Barra de Equilíbrio ---
    this.balanceBarBackground = this.add.graphics();
    this.balanceBarBackground.fillStyle(0x555555, 1);
    this.balanceBarBackground.fillRect(150, 500, 500, 50);
    this.balanceBar = this.add.graphics();
  }

  getStructureCost(type) {
    if (type === 'creator') {
      return Math.floor(this.creatorStructureBaseCost * Math.pow(1.15, this.creatorStructures));
    }
    return Math.floor(this.chaoticStructureBaseCost * Math.pow(1.15, this.chaoticStructures));
  }

  update(time, delta) {
    // --- Geração Passiva ---
    const passiveCreatorGeneration = (this.creatorStructures * 1) * (delta / 1000);
    const passiveChaoticGeneration = (this.chaoticStructures * 1) * (delta / 1000);
    this.creatorEssence += passiveCreatorGeneration;
    this.chaoticEssence += passiveChaoticGeneration;

    // --- Atualizar UI ---
    this.creatorEssenceText.setText('Criação: ' + Math.floor(this.creatorEssence));
    this.chaoticEssenceText.setText('Caos: ' + Math.floor(this.chaoticEssence));

    this.creatorStructureLevelText.setText('Sementes: ' + this.creatorStructures);
    this.creatorStructureCostText.setText('Custo: ' + this.getStructureCost('creator') + ' Caos');

    this.chaoticStructureLevelText.setText('Fragmentos: ' + this.chaoticStructures);
    this.chaoticStructureCostText.setText('Custo: ' + this.getStructureCost('chaotic') + ' Criação');

    // --- Atualizar Barra de Equilíbrio ---
    const totalEssence = this.creatorEssence + this.chaoticEssence;
    let balance = 0;
    if (totalEssence > 0) {
      balance = Math.abs(this.creatorEssence - this.chaoticEssence) / totalEssence;
    }

    this.balanceBar.clear();
    this.balanceBar.fillStyle(0xffff00, 1);
    this.balanceBar.fillRect(150, 500, 500 * balance, 50);
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container', // ID do div no index.html
  scene: [MainScene]
};

const game = new Phaser.Game(config);
