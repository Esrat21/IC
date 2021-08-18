var layer0;
var layer1;
var layer2;
var layer3;
var layer4;
var layer5;
var layer6;
var layer7;
var layer8;
var layer9;
var check = 0;
var hrInicio;

hrInicio = new Date();
let h = hrInicio.toISOString();
let hh = [];
hh = h.split("T");
let hh2 = [];
hh2 = hh[1].split(".")
h = hh[0] + " " + hh2[0];

// h = h.replace("-", "/");
// h = h.replace("-", "/");

hrInicio = h;

console.log("h: " + hrInicio)

const Random = Phaser.Math.Between;

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;


class Menu extends Phaser.Scene {

    constructor() {
        super('menu')
    }

    preload() {
        this.scale.setGameSize(432, 214);
        //background parallax
        this.load.image('cloud1', './assets/images/bg/cloud_lonely.png');
        this.load.image('cloudbg', './assets/images/bg/clouds_bg.png');
        this.load.image('cloudmg1', './assets/images/bg/clouds_mg_1.png');
        this.load.image('cloudmg2', './assets/images/bg/clouds_mg_2.png');
        this.load.image('cloudmg3', './assets/images/bg/clouds_mg_3.png');
        this.load.image('mountain1', './assets/images/bg/glacial_mountains.png');
        this.load.image('sky', './assets/images/bg/sky.png');

        //plugin do botao
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'assets/js/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

    create() {


        layer8 = this.add.tileSprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 'sky');
        layer8.setScrollFactor(0);
        layer1 = this.add.tileSprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 'cloudbg');
        layer1.setScrollFactor(0);
        layer6 = this.add.tileSprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 'mountain1');
        layer6.setScrollFactor(0);
        layer5 = this.add.tileSprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 'cloudmg3');
        layer5.setScrollFactor(0);
        layer4 = this.add.tileSprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 'cloudmg2');
        layer4.setScrollFactor(0);
        layer2 = this.add.tileSprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 'cloudmg1');
        layer2.setScrollFactor(0);
        layer0 = this.add.tileSprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 'cloud1');
        layer0.setScrollFactor(0);

        //texto do menu
        var txt = this.add.text(this.sys.canvas.width / 2 - 32, 100, "Menu", { fontFamily: 'Arial', fontSize: 26, color: '#000' });

        //botao iniciar
        var expand = true;
        var buttons = this.rexUI.add.buttons({
                x: this.sys.canvas.width / 2,
                y: 180,
                width: 100,
                orientation: 'x',
                buttons: [
                    createButton(this, 'Jogar'),
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
        layer8.tilePositionX += .4
        layer1.tilePositionX += .3
        layer2.tilePositionX += .5
        layer0.tilePositionX += .6
        layer4.tilePositionX += .2
        layer5.tilePositionX += .1

        if (check == 1) {
            check = 0;
            this.scene.start('level1');
            //this.scene.start('NewQuiz');
        }

    }
}

var createButton = function(scene, text) {
    return scene.rexUI.add.label({
        width: 40,
        height: 40,
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, COLOR_LIGHT),
        text: scene.add.text(0, 0, text, {
            fontSize: 15
        }),
        space: {
            left: 10,
            right: 10,
        },
        align: 'center'
    });

}