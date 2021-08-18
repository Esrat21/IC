const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var tokenAluno = urlParams.get('aluno'); // variavel q recebe o token
var turmaFase = urlParams.get('turmaFase'); //variavel turmaFase

//js das rotas
window.sessionStorage.setItem('token', tokenAluno);
window.sessionStorage.setItem('urlApi', "https://apichemical.quimicotgames.com");
window.sessionStorage.setItem('rotas', JSON.stringify({

}));
window.sessionStorage.setItem('turmaFase', turmaFase);

// var config = {
//     type: Phaser.AUTO,
//     width: 512,
//     height: 256,
//     scale: {
//         mode: Phaser.Scale.FIT
//     },
//     physics: {
//         default: 'arcade',
//         gravity: 0
//     },
//     scene: [Menu, Game, Quiz],
// };

// APENAS PARA TESTES
var config = {
    type: Phaser.AUTO,
    width: 512,
    height: 256,
    scale: {
        mode: Phaser.Scale.FIT
    },
    physics: {
        default: 'arcade',
        gravity: 0
    },
    scene: [Menu,Game,Quiz],
};

$.ajax({
        method: "GET",
        url: `https://apichemical.quimicotgames.com/aluno?turmaFase=${turmaFase}`,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenAluno}` }
    })
    .done(function(data, textStatus, xhr) {
        console.log(xhr.status);
        console.log(data)
        if (xhr.status = 200) {
            var game = new Phaser.Game(config);
        } else {
            console.log("erro no login") // mandar de volta pro roberto se n der 200
                //alert("ACESSO NÃO AUTORIZADO");
                //console.log("else redirect")
                //window.location.replace("#");// ** colocar o endereço do roberto**
        }
    })
    .fail(function(jqXHR, textStatus, msg) {
        //console.log(jqXHR.responseJSON['error']);
        //alert("ACESSO NÃO AUTORIZADO");
        //console.log("fail redirect")
        //window.location.replace("#");// ** colocar o endereço do roberto**
    });

//var game = new Phaser.Game(config);