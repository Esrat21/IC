var result = 0;
var hrFim;
var correto = -1;
var texto;
var idCerta;
let justificativas = [];
let justf = [];

class NewQuiz extends Phaser.Scene {
    constructor() {
        super({
            key: 'newQuiz',
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
