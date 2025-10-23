import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // Carregue seus assets aqui
  }

  create() {
    // Adicione um texto para confirmar que a cena funciona
    this.add.text(400, 300, 'Ciclo do Caos - MVP', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
  }

  update() {
    // Loop do jogo
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
