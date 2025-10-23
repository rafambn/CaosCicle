import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });

    // Variáveis de recursos
    this.creatorEssence = 0;
    this.chaoticEssence = 0;
  }

  preload() {
    // Carregue seus assets aqui
  }

  create() {
    // --- UI de Recursos ---
    this.creatorEssenceText = this.add.text(50, 50, 'Criação: 0', { fontSize: '24px', fill: '#fff' });
    this.chaoticEssenceText = this.add.text(550, 50, 'Caos: 0', { fontSize: '24px', fill: '#fff' });

    // --- Botões de Geração ---
    const creatorButton = this.add.rectangle(150, 200, 200, 100, 0x00ff00).setInteractive();
    this.add.text(150, 200, 'Gerar Criação', { fill: '#000' }).setOrigin(0.5);
    creatorButton.on('pointerdown', () => {
      this.creatorEssence++;
    });

    const chaoticButton = this.add.rectangle(650, 200, 200, 100, 0xff0000).setInteractive();
    this.add.text(650, 200, 'Gerar Caos', { fill: '#000' }).setOrigin(0.5);
    chaoticButton.on('pointerdown', () => {
      this.chaoticEssence++;
    });

    // --- Barra de Equilíbrio ---
    this.balanceBarBackground = this.add.graphics();
    this.balanceBarBackground.fillStyle(0x555555, 1);
    this.balanceBarBackground.fillRect(150, 400, 500, 50);

    this.balanceBar = this.add.graphics();
  }

  update() {
    // --- Atualizar UI ---
    this.creatorEssenceText.setText('Criação: ' + this.creatorEssence);
    this.chaoticEssenceText.setText('Caos: ' + this.chaoticEssence);

    // --- Atualizar Barra de Equilíbrio ---
    const totalEssence = this.creatorEssence + this.chaoticEssence;
    let balance = 0;
    if (totalEssence > 0) {
      balance = Math.abs(this.creatorEssence - this.chaoticEssence) / totalEssence;
    }

    this.balanceBar.clear();
    this.balanceBar.fillStyle(0xffff00, 1);
    this.balanceBar.fillRect(150, 400, 500 * balance, 50);
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
