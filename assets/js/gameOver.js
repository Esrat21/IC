class GameOver extends Phaser.Scene {
    constructor() {
        super({
            key: 'gameOver',
            active: false,
            visible: false
        })
    }

    preload() {
        this.scale.setGameSize(1000, 600);
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

    create() {
        var txt = this.add.text((this.sys.canvas.width/2) - 180,30, "Game Over", { fontFamily: 'Arial', fontSize: 64, color: '#fff' });
    
        var expand = true;
        var buttons = this.rexUI.add.buttons({
                x: this.sys.canvas.width / 2 - 8,
                y: 400,
                width: 100,
                orientation: 'x',

                buttons: [
                    createButton(this, 'Jogar Novamente'),
                ],
                expand: expand
            })
            .layout()
            //.drawBounds(this.add.graphics(), 0xff0000)
            

        buttons
            .on('button.click', function(button, index, pointer, event) {
                check = 1;
            })
            .on('button.over', function(button, groupName, index, pointer, event) {
                button.getElement('background').setStrokeStyle(1, 0xffffff);
            })
            .on('button.out', function(button, groupName, index, pointer, event) {
                button.getElement('background').setStrokeStyle();
            });
    }

    update() {
        if (check == 1) {
            check = 0;
            this.scene.remove('gameOver');
            this.scene.start('level1');
        }
    }
}

