var result = 0;
var texto;
var idCerta;
let quest;

class Quiz extends Phaser.Scene {
    constructor() {
        super({
            key: 'quiz',
            active: false,
            visible: false
        })
    }

    preload() {
        this.scale.setGameSize(1100, 600);
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: './assets/js/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

    async create() {
        texto = this.add.text(450, 100, "", { fontFamily: 'Arial', fontSize: 26, color: '#FFF' });
        texto.setVisible(false)

        try {
            const data = await getQuiz();
            console.log(data);

            let sss = "";
            let ss = data["pergunta"].split(' ');
            var quizId = data["quiz_id"]

            //console.log(ss);
            let c = 1;
            quest = retornaQuiz(ss);
            ss = data["alternativas"];
            var alternativas = [];
            var ids = [];

            for (let alt in ss) {
                ids.push(ss[alt]["id"]);
                alternativas.push(retornaQuiz(ss[alt]["descricao"].split(" ")));
            }
            console.log(ids)
            //console.log(alternativas);


        } catch (err) {
            console.log(err);
        }

        var dialog = this.rexUI.add.dialog({
            x: 500,
            y: 300,
            width: 500,

            background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

            title: createLabel(this, 'QUIZ').setDraggable(),

            //content: createLabel(this, 'Content'),

            description: createLabel(this, quest),

            choices:
            (
                (context) => {
                    let labels = [];

                    for (let alt in alternativas) {

                        labels.push(createLabel(context, alternativas[alt]));
                    }
                    //console.log(labels)
                    return labels;
                }
            )(this)
            ,

            actions: 
                //createLabel(this, 'confirmar')
                []
            ,

            space: {
                left: 20,
                right: 20,
                top: -20,
                bottom: -20,

                title: 25,
                titleLeft: 30,
                content: 25,
                description: 25,
                descriptionLeft: 20,
                descriptionRight: 20,
                choices: 25,

                toolbarItem: 5,
                choice: 15,
                action: 15,
            },

            expand: {
                title: false,
                // content: false,
                //description: false,
                // choices: false,
                // actions: true,
            },

            align: {
                title: 'center',
                // content: 'left',
                //description: 'left',
                // choices: 'left',
                actions: 'center', // 'center'|'left'|'right'
            },

            click: {
                mode: 'release'
            }
        })
            // Draggable-background
            .layout()
            // .drawBounds(this.add.graphics(), 0xff0000)
            .popUp(1000);

        var tween = this.tweens.add({
            targets: dialog,
            scaleX: 1,
            scaleY: 1,
            ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0, // -1: infinity
            yoyo: false
        });

        dialog.on('button.click', function (button, groupName, index, pointer, event) {
           console.log( groupName + '-' + index + ': ' + button.text + '\n');

            //formatando a string de data;
            hrFim = new Date();
            let h = hrFim.toISOString();
            let hh = [];
            hh = h.split("T");
            let hh2 = [];
            hh2 = hh[1].split(".")
            h = hh[0] + " " + hh2[0];

            h = h.replace("-", "/");
            h = h.replace("-", "/");

            hrFim = h;

            console.log("h': " + hrFim);

            //envia que terminou a fase e enviou o quiz
            $.ajax({
                method: "POST",
                url: "https://apichemical.quimicotgames.com/aluno/log",
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenAluno}` },
                data: JSON.stringify({
                    fase: turmaFase,
                    detalhes: "completou a fase e enviou a resposta de id: " + ids[index],
                    tipo: "fim da fase",
                    comeco: hrInicio,// formatar Y-m-d H:i:s
                    fim: hrFim,// formatar Y-m-d H:i:s
                    objeto: JSON.stringify({
                        idRespostas: ids
                    }),
                })
            })
            .done(function () {
                //console.log('foi');
            })
            .fail(function (jqXHR, textStatus, msg) {
                console.log(msg);
            });

            quizId = Number.parseInt(quizId)

            //envia o resultado do quiz e recebe uma resposta se esta certo ou nao 
            $.ajax({ // nao funciona por agora  
                method: "POST",
                url: `https://apichemical.quimicotgames.com/aluno/turmas/fases/${turmaFase}/quiz`,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenAluno}` },
                data: JSON.stringify({
                    quiz: quizId,
                    escolha: ids[index],
                    data_hora: hrFim,//Y-m-d H:i:s
                })//
            }).done(function (data) {
                idCerta = data["idAlternativaCorreta"];
                if (ids[index] == idCerta) {

                    texto.setText("ACERTOU");
                    dialog.setVisible(false);
                    texto.setVisible(true);
                } else{

                    texto.setText("ERROU");
                    dialog.setVisible(false);
                    texto.setVisible(true);
                }
            }).fail(function (jqXHR, textStatus, msg) {
                console.log(jqXHR);
            });
        }, this)
        dialog.on('button.over', function (button, choices, index, pointer, event) {
            button.getElement('background').setStrokeStyle(1, 0xffffff);
            
        })
        dialog.on('button.out', function (button, choices, index, pointer, event) {
            button.getElement('background').setStrokeStyle();
            
        });

        this.scale.setGameSize(1000, dialog.height + 120);
        dialog.setY((dialog.height / 2) + 85)

    }

    update() {

    }
}

function getQuiz() {
    return $.ajax({
        method: "GET",
        url: `https://apichemical.quimicotgames.com/aluno/turmas/fases/${turmaFase}/quiz`,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenAluno}` }
    });
}

var createLabel = function (scene, text) {
    return scene.rexUI.add.label({
        width: 40, // Minimum width of round-rectangle
        height: 40, // Minimum height of round-rectangle

        background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x5e92f3),

        text: scene.add.text(0, 0, text, {
            fontSize: '22px'
        }),

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    });
}

function retornaQuiz(ss) {
    let c = 1;
    let sss = "";

    ss.forEach(i => {
        let temp = sss + " " + i;
        if (sss.length == 0) {
            sss = sss + i

        } else if (temp.length < 45 * c) {
            sss = sss + " " + i;
        } else {
            sss = sss + "\n" + i;
            c++;
        }
    });

    return sss;
}