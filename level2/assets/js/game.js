let hrFim;
let player, hp = [],
    mortes = 0,
    vMortes = [];
let playerWin = false,
    ckpx = 256,
    ckpy = 1920;
let cam, minCamY = 0,
    maxCamY = 0;
let a, d, z, w, s, x; //variaveis de input
let leftKeyDown, rightKeyDown, upKeyDown, downKeyDown; //variaveis de input virtual joystick
let l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11, l12, l13; // layers do parallax
let baloesAr, colidindo = false,
    baloes; // baloes que sobem
let pitstops = [1665, 1377, 1057, 737, 433, 161]; // marca em que os baloes mais pesados explodem, (1377 AR, 737 NE, 161 HE)
let onFloor = false;
let reset = false,
    activeText = false,
    canMove = true,
    danoQueda = false; // variavel para resetar os baloes
let content = `Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.`;
let coin, coins, coinSound, activeSound = true;
let scoreValue = 0,
    obstaculo = [];

class Game extends Phaser.Scene {
    constructor() {
        super({
            key: "game",
            active: false,
        });
    }

    preload() {
        console.log("loaded game");

        //placa
        this.load.scenePlugin({
            key: "rexuiplugin",
            url: "./assets/js/rexuiplugin.min.js",
            sceneKey: "rexUI",
        });
        //virtual joystick
        this.load.plugin(
            "rexvirtualjoystickplugin",
            "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js",
            true
        );

        this.load.image("nextPage", "./assets/images/arrow-down-left.png");

        //background parallax
        this.load.image("cloud1", "./assets/images/bg/cloud_lonely.png");
        this.load.image("cloudbg", "./assets/images/bg/clouds_bg.png");
        this.load.image("cloudmg1", "./assets/images/bg/clouds_mg_1.png");
        this.load.image("cloudmg2", "./assets/images/bg/clouds_mg_2.png");
        this.load.image("cloudmg3", "./assets/images/bg/clouds_mg_3.png");
        this.load.image("mountain1", "./assets/images/bg/glacial_mountains.png");
        this.load.image("sky", "./assets/images/bg/sky_lightened.png");

        //load player HP
        this.load.spritesheet("playerhp", "./assets/images/ui/playerHp.png", {
            frameWidth: 16,
            frameHeight: 16,
        });

        //load player animations ---> tamanho ideal de frame w:24 h:30
        this.load.spritesheet(
            "playerIdle",
            "./assets/images/player/playerIdle.png", {
                frameWidth: 26,
                frameHeight: 30,
            }
        );
        this.load.spritesheet("playerRun", "./assets/images/player/playerRun.png", {
            frameWidth: 26,
            frameHeight: 30,
        });

        //load baloon
        this.load.image("balaoHe", "./assets/images/items/balaoHe.png");
        this.load.image("balaoNe", "./assets/images/items/balaoNe.png");
        this.load.image("balaoAr", "./assets/images/items/balaoAr.png");

        //coin sound
        this.load.audio("coinSound", "./assets/sounds/coins2.mp3");

        //load gold coins
        this.load.image(
            "coin1",
            "./assets/images/items/GoldCoin/gold_coin_round_star_1.png"
        );
        this.load.image(
            "coin2",
            "./assets/images/items/GoldCoin/gold_coin_round_star_2.png"
        );
        this.load.image(
            "coin3",
            "./assets/images/items/GoldCoin/gold_coin_round_star_3.png"
        );
        this.load.image(
            "coin4",
            "./assets/images/items/GoldCoin/gold_coin_round_star_4.png"
        );
        this.load.image(
            "coin5",
            "./assets/images/items/GoldCoin/gold_coin_round_star_5.png"
        );
        this.load.image(
            "coin6",
            "./assets/images/items/GoldCoin/gold_coin_round_star_6.png"
        );

        //load maps
        this.load.image("tiles", "./assets/maps/tiles.png");
        this.load.tilemapTiledJSON("map", "./assets/maps/lvl2.json");

        //ui camera invisivel
        this.load.image("cam", "./assets/images/cameraFollow.png");
    }

    create() {
        console.log("create");

        //parallax
        l1 = this.add.tileSprite(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 2,
            this.sys.canvas.width,
            this.sys.canvas.height,
            "sky"
        );
        l1.setScrollFactor(0);
        l2 = this.add.tileSprite(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 2,
            this.sys.canvas.width,
            this.sys.canvas.height,
            "cloudbg"
        );
        l2.setScrollFactor(0);
        l3 = this.add.tileSprite(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 2,
            this.sys.canvas.width,
            this.sys.canvas.height,
            "mountain1"
        );
        l3.setScrollFactor(0);
        l4 = this.add.tileSprite(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 2,
            this.sys.canvas.width,
            this.sys.canvas.height,
            "cloudmg3"
        );
        l4.setScrollFactor(0);
        l5 = this.add.tileSprite(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 2,
            this.sys.canvas.width,
            this.sys.canvas.height,
            "cloudmg2"
        );
        l5.setScrollFactor(0);
        l6 = this.add.tileSprite(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 2,
            this.sys.canvas.width,
            this.sys.canvas.height,
            "cloudmg1"
        );
        l6.setScrollFactor(0);
        l7 = this.add.tileSprite(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 2 + 50,
            this.sys.canvas.width,
            this.sys.canvas.height,
            "cloudmg3"
        );
        l7.setScrollFactor(0);
        l8 = this.add.tileSprite(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 2 + 50,
            this.sys.canvas.width,
            this.sys.canvas.height,
            "cloudmg2"
        );
        l8.setScrollFactor(0);
        l9 = this.add.tileSprite(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 2 + 50,
            this.sys.canvas.width,
            this.sys.canvas.height,
            "cloudmg1"
        );
        l9.setScrollFactor(0);
        l10 = this.add.tileSprite(
            this.sys.canvas.width / 2 + 278,
            this.sys.canvas.height / 2,
            this.sys.canvas.width,
            this.sys.canvas.height,
            "cloud1"
        );
        l10.setScrollFactor(0);
        l11 = this.add.tileSprite(
            this.sys.canvas.width / 2 - 120,
            this.sys.canvas.height / 2 + 50,
            this.sys.canvas.width,
            this.sys.canvas.height,
            "cloud1"
        );
        l11.setScrollFactor(0);
        l12 = this.add.tileSprite(
            this.sys.canvas.width / 2 + 45,
            this.sys.canvas.height / 2 - 20,
            this.sys.canvas.width,
            this.sys.canvas.height,
            "cloud1"
        );
        l12.setScrollFactor(0);
        l13 = this.add.tileSprite(
            this.sys.canvas.width / 2 + 220,
            this.sys.canvas.height / 2,
            this.sys.canvas.width,
            this.sys.canvas.height,
            "cloud1"
        );
        l13.setScrollFactor(0);

        //map
        const map = this.make.tilemap({
            key: "map",
            tilewidth: 16,
            tileHeight: 16,
        });
        const tileset = map.addTilesetImage("Level2", "tiles", 16, 16);

        //map layers
        const floor = map.createLayer("CollisionLayer", tileset, 0, 0);
        const ceiling = map.createLayer("teto", tileset, 0, 0);
        const background = map.createLayer("BackgroundLayer", tileset, 0, 0);
        const fruits = map.createLayer("Fruits", tileset, 0, 0);
        const win = map.createLayer("win", tileset, 0, 0);

        floor.setCollisionByProperty({
            collides: true,
        });
        ceiling.setCollisionByProperty({
            collides: true,
        });
        win.setCollisionByProperty({
            collides: true,
        });

        //mostra os box colliders
        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        // ceiling.renderDebug(debugGraphics, {
        //     tileColor: null, // Color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
        // });

        //GameObjects
        //Player
        player = this.physics.add.sprite(256, 1920, "playerIdle");
        player.body.setSize(16, 28, true);
        player.body.setOffset(5, 2);
        player.body.setDrag(500, 0); //500,0
        player.body.setMaxVelocity(200, 250);
        player.setGravityY(80);

        // player hp
        var hp1 = this.add.sprite(8, 8, "playerhp");
        hp1.setScrollFactor(0);
        hp.push(hp1);
        hp1 = this.add.sprite(24, 8, "playerhp");
        hp1.setScrollFactor(0);
        hp.push(hp1);
        hp1 = this.add.sprite(40, 8, "playerhp");
        hp1.setScrollFactor(0);
        hp.push(hp1);

        //gold coins
        let arrX = [7, 12, 8, 19, 26, 20, 14, 8, 27];
        let arrY = [10, 20, 30, 40, 50, 60, 70, 80, 90];

        coinSound = this.sound.add("coinSound");
        coinSound.setVolume(0.25);

        coins = this.physics.add.group();

        for (let i = 0; i < 9; i++) {
            coin = this.physics.add.sprite(
                arrX[i] * 16 + 8,
                arrY[i] * 16 + 8,
                "coin1"
            );
            coin.setScale(0.25, 0.25);
            coins.add(coin);
        }

        //baloes
        //massa molar Ar atmosferico 28,96 g/mol
        //massa molar he 4g/mol
        //massa molar argonio 39,948g/mol
        //massa molar 20,179g/mol
        baloes = this.physics.add.group();
        baloesAr = this.physics.add.group();
        let j = 0;
        let y = 1970;
        let balao;
        for (let i = 0; i < 16; i++) {
            if (j == 0) {
                balao = baloes.create(90, y, "balaoHe");
                balao.body.pushable = false;
                balao.body.checkCollision.down = false;
                balao.body.checkCollision.left = false;
                balao.body.checkCollision.right = false;
                balao = baloesAr.create(200, y, "balaoAr");
                balao.body.pushable = false;
                balao.body.checkCollision.down = false;
                balao.body.checkCollision.left = false;
                balao.body.checkCollision.right = false;
                balao = baloes.create(310, y, "balaoNe");
                balao.body.pushable = false;
                balao.body.checkCollision.down = false;
                balao.body.checkCollision.left = false;
                balao.body.checkCollision.right = false;
                j++;
            } else if (j == 1) {
                let balao = baloes.create(90, y, "balaoNe");
                balao.body.pushable = false;
                balao.body.checkCollision.down = false;
                balao.body.checkCollision.left = false;
                balao.body.checkCollision.right = false;
                balao = baloes.create(200, y, "balaoHe");
                balao.body.pushable = false;
                balao.body.checkCollision.down = false;
                balao.body.checkCollision.left = false;
                balao.body.checkCollision.right = false;
                balao = baloesAr.create(310, y, "balaoAr");
                balao.body.pushable = false;
                balao.body.checkCollision.down = false;
                balao.body.checkCollision.left = false;
                balao.body.checkCollision.right = false;
                j++;
            } else {
                balao = baloesAr.create(90, y, "balaoAr");
                balao.body.pushable = false;
                balao.body.checkCollision.down = false;
                balao.body.checkCollision.left = false;
                balao.body.checkCollision.right = false;
                balao = baloes.create(200, y, "balaoNe");
                balao.body.pushable = false;
                balao.body.checkCollision.down = false;
                balao.body.checkCollision.left = false;
                balao.body.checkCollision.right = false;
                balao = baloes.create(310, y, "balaoHe");
                balao.body.pushable = false;
                balao.body.checkCollision.down = false;
                balao.body.checkCollision.left = false;
                balao.body.checkCollision.right = false;
                j = 0;
            }
            y -= 120;
        }
        baloes.setVelocityY(-60);
        baloesAr.setVelocityY(-60);

        //colisoes
        this.physics.add.collider(player, floor, function() {});

        this.physics.add.collider(player, baloes, function() {
            baloes.setVelocityY(-60);
            // console.log("colidiu")
        });

        this.physics.add.collider(player, baloesAr, function(player, balao) {

            //console.log(balao.body)
            console.log(colidindo)
            colidindo = true;

            if (balao.body.velocity.y < -10) {
                balao.setVelocityY(20)
                player.setVelocityY(20)
            }

        });

        this.physics.add.overlap(player, coins, collectCoin);

        this.physics.add.collider(baloes, ceiling, function(baloes) {
            baloes.y = 1970;
            baloes.setVelocityY(-60);
        });

        this.physics.add.collider(baloesAr, ceiling, function(baloesAr) {
            baloesAr.y = 1970;
            baloesAr.setVelocityY(-60);
        });

        this.physics.add.collider(player, ceiling, function() {
            morreu()
        });

        // falta testar com o yan esse collider se ta enviando tudo certo
        this.physics.add.collider(player, win, function() {
            if (!playerWin) {
                playerWin = true;
                hrFim = new Date();
                let h = hrFim.toISOString();
                let hh = [];
                hh = h.split("T");
                let hh2 = [];
                hh2 = hh[1].split(".");
                h = hh[0] + " " + hh2[0];
                h = h.replace("-", "/");
                h = h.replace("-", "/");
                hrFim = h;

                console.log("h': " + hrFim);
                //
                $.ajax({
                        method: "POST",
                        url: "https://apichemical.quimicotgames.com/aluno/log",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${tokenAluno}`,
                        },
                        data: JSON.stringify({
                            fase: turmaFase, //
                            detalhes: "Concluiu a fase " + turmaFase,
                            tipo: "fim da fase",
                            comeco: hrInicio, //Y-m-d H:i:s
                            fim: hrFim, //Y-m-d H:i:s
                            objeto: JSON.stringify({}),
                        }),
                    })
                    .done(function() {})
                    .fail(function(jqXHR, textStatus, msg) {
                        console.log(msg);
                    });
            }
        });

        //Animations
        //Player
        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("playerIdle"),
            frameRate: 15,
            repeat: -1,
        });
        player.play("idle");

        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("playerRun"),
            frameRate: 15,
            repeat: -1,
        });

        //hp
        this.anims.create({
            key: "death",
            frames: this.anims.generateFrameNumbers("playerhp"),
            framerate: 10,
            repeat: 0,
        });

        // coins
        this.anims.create({
            key: "coinFlip",
            frames: [
                { key: "coin1" },
                { key: "coin2" },
                { key: "coin3" },
                { key: "coin4" },
                { key: "coin5" },
                { key: "coin6" },
            ],
            framerate: 15,
            repeat: -1,
        });

        let coinnss = coins.getChildren();

        for (let i in coinnss) {
            coinnss[i].play("coinFlip");
        }

        //******************************************************************************************************************************
        //joystick
        var toast = this.rexUI.add.toast({
            x: 200,
            y: 200,
            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0x888888),
            text: this.add.text(0, 0, "", {
                fontSize: "16px",
            }),
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
            },

            duration: { in: 250, hold: 1000, out: 250 },
        });

        toast.setScrollFactor(0);

        if (
            this.sys.game.device.os.android == true ||
            this.sys.game.device.os.iOS == true
        ) {
            this.scale.startFullscreen();
            this.scale.lockOrientation("landscape-primary");

            this.joyStick = this.plugins
                .get("rexvirtualjoystickplugin")
                .add(this, {
                    x: 48,
                    y: 170,
                    radius: 20,
                    base: this.add.circle(0, 0, 40, 0x888888),
                    thumb: this.add.circle(0, 0, 20, 0xcccccc),
                    // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
                    // forceMin: 16,
                    // enable: true
                })
                .on("update", this.dumpJoyStickState, this);

            this.text = this.add.text(0, 0);
            this.dumpJoyStickState();
            var cursorKeys = this.joyStick.createCursorKeys();

            //botao pular
            var expand = true;
            var buttons = this.rexUI.add
                .buttons({
                    x: 355,
                    y: 200,
                    width: 20,
                    orientation: "x",

                    buttons: [
                        createButton2(this, "^"),
                        createButton2(this, "Z"),
                        createButton2(this, "Som"),
                    ],
                    expand: expand,
                })
                .layout();
            buttons
                .on("button.click", function(button, index, pointer, event) {
                    if (jump == 1 && index == 0) {
                        jump = 0;
                        player.body.setVelocity(
                            player.body.velocity.x,
                            player.body.velocity.y - 100
                        );
                    } else if (index == 1) {
                        activebox = 1;
                    } else if (index == 2) {
                        if (activeSound == 0) {
                            activeSound = 1;
                            toast.show("som ativado");
                            console.log("ativo");
                        } else if (activeSound == 1) {
                            activeSound = 0;
                            toast.show("som desativado");
                            console.log("inativo");
                        }
                    }
                })
                .on("button.over", function(button, groupName, index, pointer, event) {
                    //button.getElement('background').setStrokeStyle(1, 0xffffff);
                })
                .on("button.out", function(button, groupName, index, pointer, event) {
                    //button.getElement('background').setStrokeStyle();
                });

            buttons.setScrollFactor(0);
        }
        //*********************************************************************************************************************

        //teclas de movimentação
        a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A); //esquerda
        d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D); //direita
        w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W); //cima
        s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S); //baixo
        z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z); //interacao com placa
        x = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X); //reseta baloes

        let space = this.input.keyboard.addKey("SPACE");
        space.on("down", function(event) {
            if (onFloor) {
                if (player.body.velocity.y > 0) {
                    player.body.setVelocity(
                        player.body.velocity.x,
                        player.body.velocity.y - 160
                    );
                } else {
                    player.body.setVelocity(
                        player.body.velocity.x,
                        player.body.velocity.y - 80
                    );
                }

            }
        });

        //camera
        cam = this.add.sprite(256, 1920, "cam");
        this.cameras.main.startFollow(cam);
        cam.setVisible(false);
        maxCamY = 1920;
        minCamY = 128;
    }

    update() {
            //console.log(player.body.velocity.y)
            let str = player.anims.getName();
            if (player.body.velocity.x == 0 && str != "idle") {
                player.play("idle");
            }

            if (player.y >= minCamY && player.y <= maxCamY) {
                cam.y = player.y;
            }

            if (d.isDown || rightKeyDown) {
                player.setVelocityX(80);
                if (str != "run") {
                    player.play("run");
                }
                if (player.flipX == true) {
                    player.flipX = false;
                }
            } else if (a.isDown || leftKeyDown) {
                player.setVelocityX(-80);
                if (str != "run") {
                    player.play("run");
                }
                player.flipX = true;
            } else if (w.isDown || upKeyDown) {
                player.setVelocityY(-80);
            } else if (s.isDown || downKeyDown) {
                player.setVelocityY(80);
            }

            if (x.isDown && player.x > 230 && player.x < 270 && !activeText) {
                //reset = true;
                canMove = false;
                activeText = true;
                createTextBox(this, 20, 1950, {
                    wrapWidth: 200,
                    fixedWidth: 200,
                    fixedHeight: 45,
                }).start(content, 50);
            }

            //verifica se o player esta pisando em algo que possa pular
            onFloor = player.body.onFloor();

            if (player.body.velocity.y > 200) {
                danoQueda = true;
            }

            if (playerWin) {
                this.scene.start("quiz");
            }

            if (player.body.onFloor() && danoQueda) {
                morreu()
            }

            if (!colidindo) {
                baloesAr.setVelocityY(-60);
            } else {
                colidindo = false
            }
        }
        //*******************************************************************************************************************************
    dumpJoyStickState() {
            var cursorKeys = this.joyStick.createCursorKeys();
            var s = "Key down: ";
            for (var name in cursorKeys) {
                if (cursorKeys[name].isDown) {
                    s += name + " ";
                }
            }
            leftKeyDown = this.joyStick.left;
            rightKeyDown = this.joyStick.right;
            upKeyDown = this.joyStick.up;
            downKeyDown = this.joyStick.down;
        }
        //*******************************************************************************************************************************
}

function explodeBalao() {
    /*
          if(balaoHe.y <= 161){
              balaoHe.body.setEnable(false);
              balaoHe.setVisible(false);
          }
          if(balaoNe.y <= 737){
              balaoNe.body.setEnable(false);
              balaoNe.setVisible(false);
          }
          if(balaoAr.y <= 1377){
              balaoAr.body.setEnable(false);
              balaoAr.setVisible(false);
          }
          */
}

const GetValue = Phaser.Utils.Objects.GetValue;
var createTextBox = function(scene, x, y, config) {
    var wrapWidth = GetValue(config, "wrapWidth", 0);
    var fixedWidth = GetValue(config, "fixedWidth", 0);
    var fixedHeight = GetValue(config, "fixedHeight", 0);
    var textBox = scene.rexUI.add
        .textBox({
            x: x,
            y: y,

            background: scene.rexUI.add
                .roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY)
                .setStrokeStyle(2, COLOR_LIGHT),

            icon: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK),

            // text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
            text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),

            action: scene.add
                .image(0, 0, "nextPage")
                .setTint(COLOR_LIGHT)
                .setVisible(false),

            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
                icon: 10,
                text: 10,
            },
        })
        .setOrigin(0)
        .layout();

    textBox
        .setInteractive()
        .on(
            "pointerdown",
            function() {
                var icon = this.getElement("action").setVisible(false);
                this.resetChildVisibleState(icon);
                if (this.isTyping) {
                    this.stop(true);
                } else {
                    this.typeNextPage();
                }
            },
            textBox
        )
        .on(
            "pageend",
            function() {
                if (this.isLastPage) {
                    canMove = true;
                    activeText = false;
                    this.destroy();
                }

                var icon = this.getElement("action").setVisible(true);
                this.resetChildVisibleState(icon);
                icon.y -= 30;
                var tween = scene.tweens.add({
                    targets: icon,
                    y: "+=30", // '+=100'
                    ease: "Bounce", // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: 500,
                    repeat: 0, // -1: infinity
                    yoyo: false,
                });
            },
            textBox
        );
    //.on('type', function () {
    //})

    return textBox;
};

var getBuiltInText = function(scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.add
        .text(0, 0, "", {
            fontSize: "15px",
            wordWrap: {
                width: wrapWidth,
            },
            maxLines: 3,
        })
        .setFixedSize(fixedWidth, fixedHeight);
};

var getBBcodeText = function(scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.rexUI.add.BBCodeText(0, 0, "", {
        fixedWidth: fixedWidth,
        fixedHeight: fixedHeight,

        fontSize: "15px",
        wrap: {
            mode: "word",
            width: wrapWidth,
        },
        maxLines: 3,
    });
};

var createButton2 = function(scene, text) {
    return scene.rexUI.add.label({
        width: 20,
        height: 20,
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x888888),
        text: scene.add.text(0, 0, text, {
            fontSize: 16,
        }),
        space: {
            left: 15,
            right: 15,
        },
        align: "center",
    });
};

var collectCoin = function(player, coin) {
    if (activeSound) {
        coinSound.play();
    }

    coin.destroy(coin.x, coin.y);
    scoreValue += 10;
};

function morreu() {
    //console.log("Tile X: " + parseInt(player.x / 16) + "\nTile Y: " + parseInt(player.y / 16));
    let px = player.x;
    let py = player.y;

    player.x = ckpx;
    player.y = ckpy;
    player.setVelocityY(0);
    player.setVelocityX(0);

    if (danoQueda) {
        obstaculo.push("Queda");
    } else {
        obstaculo.push("spike");
    }

    if (mortes == 0) {
        hp[0].play("death");
        vMortes[0] = [px, py];
    } else if (mortes == 1) {
        hp[1].play("death");
        vMortes[1] = [px, py];
    } else if (mortes == 2) {
        hp[2].play("death");
        vMortes[2] = [px, py];

        //formatando hora da morte
        hrFim = new Date();
        let h = hrFim.toISOString();
        let hh = [];
        hh = h.split("T");
        let hh2 = [];
        hh2 = hh[1].split(".");
        h = hh[0] + " " + hh2[0];
        h = h.replace("-", "/");
        h = h.replace("-", "/");
        hrFim = h;

        console.log("h': " + hrFim);
        $.ajax({
                method: "POST",
                url: "https://apichemical.quimicotgames.com/aluno/log",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenAluno}`,
                },
                data: JSON.stringify({
                    turma_fase: turmaFase, //
                    detalhes: "morreu nas coordenadas x: " + px + ", y: " + py,
                    tipo: "morte",
                    comeco: hrInicio, //Y-m-d H:i:s
                    fim: hrFim, //Y-m-d H:i:s
                    objeto: JSON.stringify({
                        obstaculos: obstaculo,
                        coordenadas: "",
                    }),
                }),
            })
            .done(function() {
                morreu = true;
                //this.scene.start('gameOver');
            })
            .fail(function(jqXHR, textStatus, msg) {
                console.log(msg);
                morreu = true;
                //this.scene.start('gameOver');
            });
    }
    mortes++
    danoQueda = false;
}