var lastAnim; // 0 = idle -- 1 = run right -- 2 = run left;
var player;
var coin;
var coins;
var coinSound;
var a;
var d;
var z;
var jump = 1;
var cam;
var placa;
var texto = [];
var mountainBg;
var mountainFar;
var mountain;
var bgTrees;
var fgTrees;
var baloes1;
var baloes2;
var baloes3;
var ckpx = 298;
var ckpy = 176;
var zeppelin;
var hp = [];
var mortes = 0;
var bats = [];
var pltfrm;
var canMove = true;
var zpopup;
var winimg;
var dieimg;
var morreu = false;
var win;
var score;
var scoreValue = 0;

var activebox = 0;
var activeSound = 1;

var leftKeyDown
var rightKeyDown
var upKeyDown
var downKeyDown

var content = `O elemento Hélio foi descoberto por Pierre - Jules - César Janssen após observações do espectro de luz do sol, o cientista percebeu a existência de um espectro de luz que ainda não era conhecido na terra, chamando então o novo elemento de Hélio, em referência a personificação divina do sol na mitologia grega, ocupa a 2° posição na tabela periódica e é um gás nobre, possui uma densidade baixa em relação ao ar atmosférico, sendo o segundo elemento mais abundante no universo, logo após o Hidrogênio.`;

var quest,r1,r2,r3,r4;

let vMortes = []
let ob = [];


function die() {
    //console.log("Tile X: " + parseInt(player.x / 16) + "\nTile Y: " + parseInt(player.y / 16));
    
    let px = player.x;
    let py = player.y;

    let obstaculos = ["baloes","airship"];
    if(px>370 && px<670){
        ob.push(obstaculos[0]);
    }else if(px>1000 && px<1745){
        ob.push(obstaculos[1]);
    }

    player.x = ckpx;
    player.y = ckpy;
    
    if (mortes == 0) {
        hp[0].play('death');
        vMortes[0] = [px,py]

    } else if (mortes == 1) {
        hp[1].play('death');
        vMortes[1] = [px,py]

    } else if (mortes == 2) {
        hp[2].play('death');
        vMortes[2] = [px,py]

        //formatando hora da morte
        hrFim = new Date();
        let h = hrFim.toISOString();  
        let hh = [];
        hh = h.split("T");
        let hh2 = [];
        hh2 = hh[1].split(".")
        h = hh[0] + " " + hh2[0];
        h = h.replace("-","/");
        h = h.replace("-","/");
        hrFim = h;

        console.log("h': " + hrFim);
        //
        $.ajax({
            method: "POST",
            url: "apichemical.quimicotgames.com/aluno/log",
            headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${tokenAluno}` },
            data: JSON.stringify({
                turma_fase: turmaFase,//
                detalhes: "morreu nas coordenadas x: " + px + ", y: " + py,
                tipo: "morte",
                comeco: hrInicio ,//Y-m-d H:i:s
                fim: hrFim ,//Y-m-d H:i:s
                objeto: JSON.stringify({
                    obstaculos: ob,
                    coordenadas: vMortes
                }),
            })
        })
        .done(function(){
           morreu = true;
           //this.scene.start('gameOver');
        })
        .fail(function(jqXHR, textStatus, msg){
            console.log(msg);
            morreu = true;
            //this.scene.start('gameOver');
        });
        //this.scene.start('gameOver');
    }

    mortes++;
    player.setVelocityY(0);

    var b2 = baloes2.getChildren();

    b2[0].setY(72);
    b2[1].setY(136);
    b2[2].setY(200);
    baloes2.setVelocityY(-75);

    resetAirship();
    //console.log(b2);
}

function resetAirship() {
    pltfrm.setVelocityX(0);
    zeppelin.setVisible(true)

    var v = pltfrm.getChildren();
    v[0].setX(1024);
    v[1].setX(1088);
    v[2].setX(1088);
    v[3].setX(1024);
    v[4].setX(1056);
    v[5].setX(1052);
}

function won() {
    canMove = false;
    //console.log('ganhou');
    win = true;
}

class Level1 extends Phaser.Scene {
    constructor() {
        super({
            key: 'level1',
            active: false
        })
    }

    init(){
        morreu = false;
    }

    preload() {
        this.scale.setGameSize(432, 224);
        //virtual joystick
        this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);

        //coin sound
        this.load.audio('coinSound', './assets/sounds/coins2.mp3');

        //plugins 
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        //background
        this.load.image('mountainBg', './assets/images/bg/parallax-mountain-bg.png');
        this.load.image('mountainFar', './assets/images/bg/parallax-mountain-montain-far.png');
        this.load.image('mountain', './assets/images/bg/parallax-mountain-mountains.png');
        this.load.image('bgTrees', './assets/images/bg/parallax-mountain-trees.png');
        this.load.image('fgTrees', './assets/images/bg/parallax-mountain-foreground-trees.png');

        //load map
        this.load.image('tiles', './assets/maps/tiles.png');
        this.load.image('tiles2', './assets/maps/blocoVerde.png');
        this.load.tilemapTiledJSON('map', './assets/maps/level1.json');

        //load plugin text box
        this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');

        //load sign bg
        this.load.image('placa', './assets/images/ui/wood.png');
        this.load.spritesheet('zpopup', './assets/images/ui/zPopup.png', { frameWidth: 32, frameHeight: 32 });

        //load baloon
        this.load.image('baloon', './assets/images/items/baloon.png');
        this.load.image('balaoHe', './assets/images/items/balaoHe.png');
        this.load.image('balaoNe', './assets/images/items/balaoNe.png');
        this.load.image('balaoAr', './assets/images/items/balaoAr.png');

        //load gold coins
        this.load.image('coin1', './assets/images/items/GoldCoin/gold_coin_round_star_1.png');
        this.load.image('coin2', './assets/images/items/GoldCoin/gold_coin_round_star_2.png');
        this.load.image('coin3', './assets/images/items/GoldCoin/gold_coin_round_star_3.png');
        this.load.image('coin4', './assets/images/items/GoldCoin/gold_coin_round_star_4.png');
        this.load.image('coin5', './assets/images/items/GoldCoin/gold_coin_round_star_5.png');
        this.load.image('coin6', './assets/images/items/GoldCoin/gold_coin_round_star_6.png');

        //load zeppelin
        this.load.image('zeppelin', './assets/images/items/airBaloon.png');

        //load zeppelin platforms
        this.load.image('plataforma', './assets/images/ui/platform.png');

        //load bat
        this.load.spritesheet('bat', './assets/images/enemies/Bat.png', { frameWidth: 16, frameHeight: 16 });

        //load player HP
        this.load.spritesheet('playerhp', './assets/images/ui/playerHp.png', { frameWidth: 16, frameHeight: 16 });

        //load player animations ---> tamanho ideal de frame w:24 h:30
        this.load.spritesheet('playerIdle', './assets/images/player/playerIdle.png', { frameWidth: 26, frameHeight: 30 });
        this.load.spritesheet('playerRun', './assets/images/player/playerRun.png', { frameWidth: 26, frameHeight: 30 });

        //camera
        this.load.image('cam', './assets/images/ui/cameraFollow.png');

        //win - game over
        this.load.image('win', './assets/images/ui/win(1).png');
    }

    create() {

        this.input.addPointer();
        this.input.addPointer();

        mountainBg = this.add.tileSprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 'mountainBg');
        mountainBg.setScrollFactor(0);
        mountainFar = this.add.tileSprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 'mountainFar');
        mountainFar.setScrollFactor(0);
        mountain = this.add.tileSprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 'mountain');
        mountain.setScrollFactor(0);
        bgTrees = this.add.tileSprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 'bgTrees');
        bgTrees.setScrollFactor(0);
        fgTrees = this.add.tileSprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 'fgTrees');
        fgTrees.setScrollFactor(0);


        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("DirtBrick_Assets_V4", "tiles", 16, 16);
        const tileset2 = map.addTilesetImage("bloco_verde", "tiles2",16,16);

        //map layers
        const floor = map.createLayer("Floor", tileset, 0, 0);
        const decorations = map.createLayer("Camada de Tiles 2", tileset, 0, 0);
        const spikes = map.createLayer("spikes", tileset, 0, 0);
        const spikeTop = map.createLayer("SpikeTop", tileset, 0, 0);
        const win = map.createLayer("Win", tileset, 0, 0);
        const wall = map.createLayer("parede", tileset, 0, 0);
        const batLayer = map.createLayer("bats", tileset, 0, 0);
        const blocoVerde = map.createLayer("verde", tileset2, 0, 0);

        wall.setCollisionByProperty({ collides: true });
        floor.setCollisionByProperty({ collides: true });
        spikes.setCollisionByProperty({ collides: true });
        spikeTop.setCollisionByProperty({ collides: true });
        batLayer.setCollisionByProperty({ collides: true });
        win.setCollisionByProperty({ collides: true });

        //Player    
        player = this.physics.add.sprite(85, 176, 'playerIdle');
        player.body.setSize(16, 28, true);
        player.body.setOffset(5, 2);
        player.body.setGravity(0, 200);
        player.body.setDrag(500, 0);
        player.body.setMaxVelocity(200, 250);
        ckpx = 298;
        ckpy = 176;

        //score
        score = this.add.text(350, 1, "Score: " + scoreValue, {fontSize: 12, color: '#fff' });
        score.setScrollFactor(0);

        //gold coins

        let arrX = [9,11,17,32,48,60,74,82,97,114];
        let arrY = [10,10,9,5,10,7,6,4,7,6];

        coinSound = this.sound.add('coinSound');
        coinSound.setVolume(0.25);

        coins = this.physics.add.group();

        for(let i =0;i<10;i++){
            coin = this.physics.add.sprite((arrX[i]*16)+8,(arrY[i]*16)+8,'coin1');
            coin.setScale(0.25,0.25)
            coins.add(coin);
        }

        //baloes
        var balao;
        baloes1 = this.physics.add.group();
        balao = baloes1.create(456, 72, 'balaoNe');
        balao.setImmovable(true);
        balao.body.checkCollision.down = false;
        balao.body.checkCollision.left = false;
        balao.body.checkCollision.right = false;
        balao = baloes1.create(456, 136, 'balaoNe');
        balao.setImmovable(true);
        balao.body.checkCollision.down = false;
        balao.body.checkCollision.left = false;
        balao.body.checkCollision.right = false;
        balao = baloes1.create(456, 200, 'balaoNe');
        balao.setImmovable(true);
        balao.body.checkCollision.down = false;
        balao.body.checkCollision.left = false;
        balao.body.checkCollision.right = false;

        baloes1.setVelocityY(-50);

        baloes2 = this.physics.add.group();
        balao = baloes2.create(520, 72, 'balaoAr');
        //balao.setImmovable(true);
        balao.body.checkCollision.down = false;
        balao.body.checkCollision.left = false;
        balao.body.checkCollision.right = false;
        balao = baloes2.create(520, 136, 'balaoAr');
        //balao.setImmovable(true);
        balao.body.checkCollision.down = false;
        balao.body.checkCollision.left = false;
        balao.body.checkCollision.right = false;
        balao = baloes2.create(520, 200, 'balaoAr');
        //balao.setImmovable(true);
        balao.body.checkCollision.down = false;
        balao.body.checkCollision.left = false;
        balao.body.checkCollision.right = false;

        baloes2.setVelocityY(-75);

        baloes3 = this.physics.add.group();
        balao = baloes3.create(584, 72, 'balaoHe');
        balao.setImmovable(true);
        balao.body.checkCollision.down = false;
        balao.body.checkCollision.left = false;
        balao.body.checkCollision.right = false;
        balao = baloes3.create(584, 136, 'balaoHe');
        balao.setImmovable(true);
        balao.body.checkCollision.down = false;
        balao.body.checkCollision.left = false;
        balao.body.checkCollision.right = false;
        balao = baloes3.create(584, 200, 'balaoHe');
        balao.setImmovable(true);
        balao.body.checkCollision.down = false;
        balao.body.checkCollision.left = false;
        balao.body.checkCollision.right = false;

        baloes3.setVelocityY(-100);

        //Airship
        zeppelin = this.physics.add.sprite(1052, 24, 'zeppelin');
        zeppelin.flipX = true;
        zeppelin.setScale(0.5, 0.5);
        zeppelin.body.checkCollision.down = false;
        zeppelin.body.checkCollision.up = false;

        pltfrm = this.physics.add.group();
        var plat = this.physics.add.image(1024, 144, 'plataforma');
        pltfrm.add(plat);
        plat.body.checkCollision.down = false;
        plat.body.checkCollision.left = false;
        plat.body.checkCollision.right = false;
        plat.setImmovable(true);

        plat = this.physics.add.image(1088, 144, 'plataforma');
        pltfrm.add(plat);
        plat.body.checkCollision.down = false;
        plat.body.checkCollision.left = false;
        plat.body.checkCollision.right = false;
        plat.setImmovable(true);

        plat = this.physics.add.image(1088, 106, 'plataforma');
        pltfrm.add(plat);
        plat.body.checkCollision.down = false;
        plat.body.checkCollision.left = false;
        plat.body.checkCollision.right = false;
        plat.setImmovable(true);

        plat = this.physics.add.image(1024, 106, 'plataforma');
        pltfrm.add(plat);
        plat.body.checkCollision.down = false;
        plat.body.checkCollision.left = false;
        plat.body.checkCollision.right = false;
        plat.setImmovable(true);

        plat = this.physics.add.image(1056, 128, 'plataforma');
        plat.setScale(0.75, 1)
        pltfrm.add(plat);
        plat.body.checkCollision.down = false;
        plat.body.checkCollision.left = false;
        plat.body.checkCollision.right = false;
        plat.setImmovable(true);

        pltfrm.add(zeppelin);

        //console.log(pltfrm.getChildren());

        //
        var hp1 = this.add.sprite(8, 8, 'playerhp');
        hp1.setScrollFactor(0);
        hp.push(hp1);
        hp1 = this.add.sprite(24, 8, 'playerhp');
        hp1.setScrollFactor(0);
        hp.push(hp1);
        hp1 = this.add.sprite(40, 8, 'playerhp');
        hp1.setScrollFactor(0);
        hp.push(hp1);

        //Placa
        zpopup = this.add.sprite(296, 144, 'zpopup');
        zpopup.setScale(0.5, 0.5);

        //console.log(this.sys.canvas.width / 2);
        placa = this.add.image(296, this.sys.canvas.height / 2, 'placa');
        placa.setScale(0.85, 0.5);

        var txt = this.add.text(140, 6, "O elemento Hélio foi descoberto por Pierre - Jules -", { fontFamily: 'Arial', fontSize: 12, color: '#fff' });
        texto.push(txt);
        txt = this.add.text(140, 19, "César Janssen após observações do espectro de luz do", { fontFamily: 'Arial', fontSize: 12, color: '#fff' });
        texto.push(txt);
        txt = this.add.text(140, 32, "sol, o cientista percebeu a existência de um espectro", { fontFamily: 'Arial', fontSize: 12, color: '#fff' });
        texto.push(txt);
        txt = this.add.text(140, 45, "de luz que ainda não era conhecido na terra, chamando", { fontFamily: 'Arial', fontSize: 12, color: '#fff' });
        texto.push(txt);
        txt = this.add.text(140, 58, "então o novo elemento de Hélio, em referência a ", { fontFamily: 'Arial', fontSize: 12, color: '#fff' });
        texto.push(txt);
        txt = this.add.text(140, 71, "personificação divina do sol na mitologia grega, ocupa", { fontFamily: 'Arial', fontSize: 12, color: '#fff' });
        texto.push(txt);
        txt = this.add.text(140, 84, "a 2° posição na tabela periódica e é um gás nobre, ", { fontFamily: 'Arial', fontSize: 12, color: '#fff' });
        texto.push(txt);
        txt = this.add.text(140, 97, "possui uma densidade baixa em relação ao ar atmosférico,", { fontFamily: 'Arial', fontSize: 12, color: '#fff' });
        texto.push(txt);
        txt = this.add.text(140, 110, "sendo o segundo elemento mais abundante no universo,", { fontFamily: 'Arial', fontSize: 12, color: '#fff' });
        texto.push(txt);
        txt = this.add.text(140, 123, "logo após o Hidrogênio.", { fontFamily: 'Arial', fontSize: 12, color: '#fff' });
        texto.push(txt);

        placa.setVisible(false);
        for (var i of texto) {
            i.setVisible(false);
        }

        //bats
        var morcego = this.physics.add.sprite(1208, 136, 'bat');
        bats.push(morcego);
        morcego = this.physics.add.sprite(1272, 88, 'bat');
        bats.push(morcego);
        morcego = this.physics.add.sprite(1384, 136, 'bat');
        bats.push(morcego);
        morcego = this.physics.add.sprite(1448, 88, 'bat');
        bats.push(morcego);
        morcego = this.physics.add.sprite(1528, 88, 'bat');
        bats.push(morcego);
        morcego = this.physics.add.sprite(1640, 136, 'bat');
        bats.push(morcego);

        //game over e win -> devem ser as ultimas imagens adicionadas
        winimg = this.add.image(216, this.sys.canvas.height / 2, 'win');
        winimg.setVisible(false);

        //Colliders
        this.physics.add.collider(player, floor, function() {
            jump = 1;
        });
        this.physics.add.collider(player, wall);
        this.physics.add.collider(player, spikes, function() {
            die();
        });
        this.physics.add.collider(player, win, function() {
            won();
        });

        this.physics.add.collider(baloes1, spikeTop, function(baloes1) {
            baloes1.y = 216;
            baloes1.setVelocityY(-50);
        });
        this.physics.add.collider(baloes2, spikeTop, function(baloes2) {
            baloes2.y = 216;
            baloes2.setVelocityY(-75);
        });
        this.physics.add.collider(baloes3, spikeTop, function(baloes3) {
            baloes3.y = 216;
            baloes3.setVelocityY(-100);
        });

        this.physics.add.collider(player, baloes1, function() {
            jump = 1;
        });
        this.physics.add.collider(player, baloes2, function() {
            jump = 1;
        });
        this.physics.add.collider(player, baloes3, function() {
            jump = 1;
        });

        this.physics.add.collider(player, batLayer, function() {
            die();
        });

        this.physics.add.collider(player, pltfrm, function() {
            jump = 1;
        });

        this.physics.add.collider(player, win, function() {
            win();
        });

        this.physics.add.overlap(player, coins,collectCoin);

        //Animations
        //Player
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('playerIdle'),
            frameRate: 15,
            repeat: -1
        });
        player.play('idle');
        lastAnim = 0;

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('playerRun'),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNumbers('playerhp'),
            framerate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'batfly',
            frames: this.anims.generateFrameNumbers('bat'),
            framerate: 15,
            repeat: -1
        });

        for (var i = 0; i < bats.length; i++) {
            bats[i].play('batfly');
        }

        this.anims.create({
            key: 'popup',
            frames: this.anims.generateFrameNumbers('zpopup'),
            framerate: 15,
            repeat: -1
        });
        zpopup.play('popup');
        zpopup.setVisible(false);

        this.anims.create({
            key: 'coinFlip',
            frames:[
                {key:'coin1'},
                {key:'coin2'},
                {key:'coin3'},
                {key:'coin4'},
                {key:'coin5'},
                {key:'coin6'}
            ],
            framerate: 15,
            repeat: -1
        })
        let coinnss = coins.getChildren();

        for(let i in coinnss){
            coinnss[i].play('coinFlip');
        }
        //Entradas do teclado

        //joystick
        var toast = this.rexUI.add.toast({
            x:200,
            y:200,
            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0x888888),
            text: this.add.text(0, 0, '', {
                fontSize: '16px'
            }),
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
            },

            duration: {
                in: 250,
                hold: 1000,
                out: 250,
            },
        });

        toast.setScrollFactor(0);

        if(this.sys.game.device.os.android == true || this.sys.game.device.os.iOS == true){
            this.scale.startFullscreen();
            this.scale.lockOrientation('landscape-primary');

            this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
                x: 48,
                y: 170,
                radius: 20,
                base: this.add.circle(0, 0, 40, 0x888888),
                thumb: this.add.circle(0, 0, 20, 0xcccccc),
                // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
                // forceMin: 16,
                // enable: true
            })
            .on('update', this.dumpJoyStickState, this);

            this.text = this.add.text(0, 0);
            this.dumpJoyStickState();
            var cursorKeys = this.joyStick.createCursorKeys();

            //botao pular
            var expand = true;
            var buttons = this.rexUI.add.buttons({
                    x: 355,
                    y: 200,
                    width: 20,
                    orientation: 'x',

                    buttons: [
                        createButton2(this, '^'),
                        createButton2(this,'Z'),
                        createButton2(this,'Som')
                    ],
                    expand: expand
                })
                .layout()
            buttons
                .on('button.click', function(button, index, pointer, event) {
                    if (jump == 1 && index == 0) {
                        jump = 0;
                        player.body.setVelocity(player.body.velocity.x, player.body.velocity.y - 100);
                    }else if(index == 1){
                        activebox = 1;
                    }else if(index == 2){
                        if(activeSound == 0){
                            activeSound = 1;
                            toast.show('som ativado');
                            console.log('ativo');
                        }else if(activeSound == 1){
                            activeSound = 0;
                            toast.show('som desativado');
                            console.log('inativo');
                        }
                       
                    }
                })
                .on('button.over', function(button, groupName, index, pointer, event) {
                    //button.getElement('background').setStrokeStyle(1, 0xffffff);
                })
                .on('button.out', function(button, groupName, index, pointer, event) {
                    //button.getElement('background').setStrokeStyle();
                });
                
            buttons.setScrollFactor(0);     
        }

        //movimentação do player
        var space = this.input.keyboard.addKey('SPACE');
        space.on('down', function(event) {
            if (jump == 1) {
                jump = 0;
                player.body.setVelocity(player.body.velocity.x, player.body.velocity.y - 100);
            }
        });

        //placa
        var keyz = this.input.keyboard.addKey('Z');
        keyz.on('down', function(event) {
            if (canMove) {
                          
            }
        });        

        a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        //camera
        cam = this.add.sprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'cam');
        this.cameras.main.startFollow(cam);
        cam.setVisible(false);
    }

    update() {

        mountainFar.tilePositionX = this.cameras.main.scrollX * .5;
        mountain.tilePositionX = this.cameras.main.scrollX * .6;
        bgTrees.tilePositionX = this.cameras.main.scrollX * .7;
        fgTrees.tilePositionX = this.cameras.main.scrollX * .8;

        score.setText("Score:" + scoreValue);

        if (player.x > 272 && player.x < 330) {
            if(canMove && (z.isDown || activebox==1)){
                canMove = false;
                createTextBox(this, player.x-130, 100, {
                    wrapWidth: 200,
                    fixedWidth: 190,
                    fixedHeight: 45,
                })
                .start(content, 50); 
            }
        }

        if (player.x > 1032 && player.x < 1750) {
            if (player.x < 1720) {
                //console.log('na reset')
                pltfrm.setVelocityX(30);
            } else {
                //console.log('resetando');
                pltfrm.setVelocityX(0);
                resetAirship();
            }
        }

        if (player.body.velocity.x == 0) {
            if (lastAnim != 0) {
                lastAnim = 0;
                player.play('idle');
            }
        }

        if ((d.isDown || rightKeyDown == true) && canMove) {

            player.setVelocityX(80);
            if (lastAnim != 1) {
                lastAnim = 1;
                player.play('run');

            }
            if (player.flipX == true) {
                player.flipX = false;
            }

        } else if ((a.isDown || leftKeyDown == true) && canMove) {

            player.setVelocityX(-80);
            if (lastAnim != 2) {
                lastAnim = 2;
                player.play('run');
                player.flipX = true;
            }
        }
        if (player.x > 216 && player.x < 1830) {
            cam.x = player.x;
        }

        //checkpoints
        if (player.x > 296 && player.x < 320) {
            ckpx = player.x;
            ckpy = 176;
        } else if (player.x > 1000 && player.x < 1020) {
            ckpx = player.x;
            ckpy = 128;

        }
        var v = placa.visible;
        if ((player.x < 272 || player.x > 330) && v == true) {
            placa.setVisible(false);
            for (var i of texto) {
                i.setVisible(false);
            }
        }
        if ((player.x > 272 && player.x < 330)) {
            zpopup.setVisible(true);
        } else {
            zpopup.setVisible(false);
        }

        if (win) {
            this.scene.start('quiz');
        }
        if(morreu){
            morreu = false;
            //alert(morreu)
            //this.scene.pause();
            //this.scene.start('gameOver');  
            location.reload();          
        }

        //console.log(player.x)

    }
    
    dumpJoyStickState() {
        var cursorKeys = this.joyStick.createCursorKeys();
        var s = 'Key down: ';
        for (var name in cursorKeys) {
            if (cursorKeys[name].isDown) {
                s += name + ' ';
            }
        }
        leftKeyDown = this.joyStick.left;
        rightKeyDown = this.joyStick.right;
        upKeyDown = this.joyStick.up;
        downKeyDown = this.joyStick.down;
    }

}

const GetValue = Phaser.Utils.Objects.GetValue;
var createTextBox = function(scene, x, y, config) {
    var wrapWidth = GetValue(config, 'wrapWidth', 0);
    var fixedWidth = GetValue(config, 'fixedWidth', 0);
    var fixedHeight = GetValue(config, 'fixedHeight', 0);
    var textBox = scene.rexUI.add.textBox({
            x: x,
            y: y,

            background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY)
                .setStrokeStyle(2, COLOR_LIGHT),

            icon: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK),

            // text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
            text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),

            action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false),

            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
                icon: 10,
                text: 10,
            }
        })
        .setOrigin(0)
        .layout();

    textBox
        .setInteractive()
        .on('pointerdown', function() {
            var icon = this.getElement('action').setVisible(false);
            this.resetChildVisibleState(icon);
            if (this.isTyping) {
                this.stop(true);
            } else {
                this.typeNextPage();
            }
        }, textBox)
        .on('pageend', function() {
            if (this.isLastPage) {
                canMove = true;
                activebox = 0;
                this.destroy();
            }

            var icon = this.getElement('action').setVisible(true);
            this.resetChildVisibleState(icon);
            icon.y -= 30;
            var tween = scene.tweens.add({
                targets: icon,
                y: '+=30', // '+=100'
                ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 500,
                repeat: 0, // -1: infinity
                yoyo: false
            });
        }, textBox)
        //.on('type', function () {
        //})

    return textBox;
}

var getBuiltInText = function(scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.add.text(0, 0, '', {
            fontSize: '15px',
            wordWrap: {
                width: wrapWidth
            },
            maxLines: 3
        })
        .setFixedSize(fixedWidth, fixedHeight);
}

var getBBcodeText = function(scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.rexUI.add.BBCodeText(0, 0, '', {
        fixedWidth: fixedWidth,
        fixedHeight: fixedHeight,

        fontSize: '15px',
        wrap: {
            mode: 'word',
            width: wrapWidth
        },
        maxLines: 3
    })
}

var createButton2 = function(scene, text) {
    return scene.rexUI.add.label({
        width: 20,
        height: 20,
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x888888),
        text: scene.add.text(0, 0, text, {
            fontSize: 16
        }),
        space: {
            left: 15,
            right: 15,
        },
        align: 'center'
    });
}

var collectCoin = function(player,coin){
    if(activeSound == 1){
        coinSound.play();
    }
   
    coin.destroy(coin.x, coin.y);
    scoreValue+=10;
}