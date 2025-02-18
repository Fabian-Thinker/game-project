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
    this.countdownTime = 5;
    this.currentHour = 0;
    this.cameraModeActive = false;
    this.canToggleCamera = true;
  }

  preload() {
    this.load.image('0-FLIP', 'assets/0-FLIP.png');
    this.load.image('cameraOverlay', 'assets/1-STAGE.png');
  }

  create() {
    this.UI();
    this.createCameraMode();
    this.startNight();
  }

  UI() {
    this.add.text(100, 50, 'office mode', { 
      fontSize: '25px',
      fill: '#ffffff',
      fontFamily: 'Sans-serif'
    }).setOrigin(0.5);

    this.flipButtonOffice = this.add.image(400, 550, '0-FLIP')
      .setOrigin(0.5)
      .setDisplaySize(400, 50)
      .setInteractive()
      .on('pointerover', () => {
          this.handleFlipHover();
      });

    this.hourText = this.add.text(700, 50, this.formatHour(), { font: '25px Arial', fill: '#ffffff' }).setOrigin(0.5);
    this.countdownText = this.add.text(400, 300, `Seconds: ${this.countdownTime}`, { font: '32px Sans-serif', fill: '#ffffff' }).setOrigin(0.5);
  }

  createCameraMode() {
    this.cameraOverlay = this.add.container(0, 0).setVisible(false);

    let overlay = this.add.image(400, 300, 'cameraOverlay')
      .setDisplaySize(800, 600);

    this.flipButtonCamera = this.add.image(400, 550, '0-FLIP')
      .setOrigin(0.5)
      .setDisplaySize(400, 50)
      .setInteractive()
      .on('pointerover', () => {
          this.handleFlipHover();
      });

    this.cameraOverlay.add([overlay, this.flipButtonCamera]);
  }

  handleFlipHover() {
    if (this.canToggleCamera) {
      this.toggleCameraMode();
      this.canToggleCamera = false;

      this.flipButtonOffice.setVisible(false);
      this.flipButtonCamera.setVisible(false);
      this.flipButtonOffice.disableInteractive();
      this.flipButtonCamera.disableInteractive();

      this.time.delayedCall(700, () => {
        this.flipButtonOffice.setVisible(true);
        this.flipButtonCamera.setVisible(true);
        this.flipButtonOffice.setInteractive();
        this.flipButtonCamera.setInteractive();
        this.canToggleCamera = true;
      });
    }
  }

  toggleCameraMode() {
    this.cameraModeActive = !this.cameraModeActive;
    this.cameraOverlay.setVisible(this.cameraModeActive);
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
      this.countdownTime = 5;
      this.currentHour++;
    }

    this.countdownText.setText(`Seconds: ${this.countdownTime}`);
    this.hourText.setText(this.formatHour());

    if (this.currentHour === 6) {
      this.scene.pause();
    }
  }

  formatHour() {
    let displayHour = this.currentHour === 0 ? 12 : this.currentHour;
    return `${displayHour} AM`;
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
