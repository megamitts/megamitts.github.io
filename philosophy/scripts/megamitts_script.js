//https://rexrainbow.github.io/phaser3-rex-notes/docs/site/shatter-image/#live-demos

class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'examples'
        })
    }

    preload() {
        this.load.plugin('rexshatterimageplugin', 'https://raw.githubusercontent.com/megamitts/phaser3-rex-notes/master/dist/rexshatterimageplugin.min.js', true); 
      
        this.load.image('manliness', 'https://megamitts.github.io/philosophy/fortress_of_manliness.jpg')
    }

    create() {
        var image = this.add.rexShatterImage(400, 300, 'manliness')
        //.shatter()

        // this.debug = this.add.graphics();
        // image.setDebug(this.debug);

        this.input
            .on('pointerdown', function (pointer) {
                if (image.task) {
                    image.task.stop();
                    image.task = null;
                }
                image.shatter(pointer.x, pointer.y);
            })
            .on('pointerup', function () {
                image.task = this.tweens.add({
                    targets: image.faces,
                    alpha: 0,
                    angle: function () { return -90 + Math.random() * 180; },
                    y: '-=0.5',
                    ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: 1000,
                    delay: this.tweens.stagger(20),
                    repeat: 0,            // -1: infinity
                    yoyo: false,
                    onComplete: function () {
                        image
                            .stopUpdate()
                            window.location.replace("index.html");
                            //.resetImage()
                    }
                });
                image.startUpdate();
            }, this)
      
        //this.add.text(0,600,'Click then release', {color:'red'}).setOrigin(0, 1);
    }

    update() {
        //this.debug.clear();
        //this.debug.lineStyle(1, 0x00ff00);
    }
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: Demo
};

var game = new Phaser.Game(config);
