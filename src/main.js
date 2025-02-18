import './style.css';
import Phaser from 'phaser';

const sizes={
  width: 800,
  height: 600
};

class menuScene extends Phaser.Scene{
  constructor(){
    super({ key: 'menuScene' });
  }

  preload(){
    this.load.image('uncanny', 'assets/uncanny.jpg');
    this.load.glsl('vhsShader', 'assets/vhs.glsl');
  }
  create(){
    this.vhsEffect = this.add.shader('vhsShader', 400, 300, 800, 600);
    this.vhsEffect.setDepth(1);
    this.add.image(400,300,'uncanny').setOrigin(0.5).setDisplaySize(800,600);

    this.add.text(50,50, 'A night at uncanny', {
      fontSize: '50px', 
      fill: '#fff',
      fontFamily: 'sans-serif',
      fontStyle: 'bold'
    }).setDepth(1);

    let buttonX = 50, buttonY = 170, buttonWidth = 160, buttonHeight = 50;

    let buttonBg = this.add.graphics().setDepth(1);
    buttonBg.fillStyle(0x000000, 0.5);
    buttonBg.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);

    let startButton = this.add.text(buttonX + buttonWidth / 2, buttonY + buttonHeight / 2, 'Start Game', { 
        fontSize: '24px', 
        fill: '#ffffff',  
        fontFamily: 'Sans-serif',
        fontStyle: 'bold',
    }).setOrigin(0.5).setInteractive().setDepth(1);

    startButton.on('pointerover', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x333333, 0.8);
      buttonBg.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
      this.input.setDefaultCursor('pointer');
  })
  .on('pointerout', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x000000, 0.5);
      buttonBg.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
      this.input.setDefaultCursor('default');
  })
  .on('pointerdown', () => {
      this.scene.start('gameScene');
      this.input.setDefaultCursor('default');
  });
  }
  update(){}
};

class gameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'gameScene' });
    this.countdownTime = 10;
    this.currentHour = 12;
  }

  preload() {
    this.load.image('0-FLIP', 'assets/0-FLIP.png');
  }

  create() {
    this.UI();
    this.startNight();
  }

  UI() {
    this.add.text(100,100, 'office mode', { 
      fontSize: '25px',
      fill: '#ffffff',
      fontFamily: 'Sans-serif',
    }).setOrigin(0.5);

    this.add.image(400, 550, '0-FLIP').setOrigin(0.5).setDisplaySize(400, 50).setInteractive()
      .on('pointerover', () => {
        
      });

    this.hourText = this.add.text(700, 50, this.formatHour(), { font: '25px Arial', fill: '#ffffff' }).setOrigin(0.5);
    this.countdownText = this.add.text(400, 300, `Time: ${this.countdownTime}`, { font: '32px Sans-serif', fill: '#ffffff' }).setOrigin(0.5);
  }

  startNight() {
    this.time.addEvent({
      delay: 1000,
      callback: this.countDown,
      callbackScope: this,
      loop: true
    });
  }

  countDown() {
    if (this.countdownTime > 1) {
      this.countdownTime--;
    } else {
      this.countdownTime = 10;
      this.currentHour++;
    }

    this.countdownText.setText(`Time: ${this.countdownTime}`);
    this.hourText.setText(this.formatHour());

    if (this.currentHour === 18) {
      this.scene.pause();
    }
  }

  formatHour() {
    let period = this.currentHour >= 12 ? "PM" : "AM";
    let standardHour = this.currentHour > 12 ? this.currentHour - 12 : this.currentHour;
    return `${standardHour} ${period}`;
  }
}

const config = {
  type:Phaser.WEBGL,
  width:sizes.width,
  height:sizes.height,
  canvas:gameCanvas,
  scene:[menuScene,gameScene]
};

new Phaser.Game(config);