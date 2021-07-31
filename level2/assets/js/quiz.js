var result = 0;
var correto = -1;
var texto;
var idCerta;
let justificativas = [];
let justf = [];

class Quiz extends Phaser.Scene {
    constructor() {
        super({
            key: 'quiz',
            active: false,
            visible: false
        })
    }

    preload() {
        $('#game').hide();
        $('canvas').hide();
        $("#quiz").show();
    }

    create() {

    }

    update() {


    }
}