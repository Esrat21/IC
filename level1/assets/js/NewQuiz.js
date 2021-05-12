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

        $('#quiz').show();

        for(let i = 0;i<4;i++){
            $('.quizAlts').append("<div id='fade+1'>" + i + "</div>");
            
        }

        for(let i = 0;i<4;i++){
            $('#fade'+i).hover(function(){
                $(this).toggleClass("hover")
                console.log('hover ' + i)
            })
        }
        

    }

    create() {
        
    }

    update() {
        

    }
}
