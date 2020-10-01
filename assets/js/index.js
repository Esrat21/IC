var config = {
    type: Phaser.AUTO,
    width: 432,
    height: 224,
    scale: {
        mode: Phaser.Scale.FIT
    },
    physics: {
        default: 'arcade',
        gravity: 0
    },
    scene: [Menu, GameOver, Level1, Quiz]
};

game = new Phaser.Game(config);