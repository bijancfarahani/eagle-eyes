export class SelectionScene extends Phaser.Scene {
   scrambled: string;

   // Typescript needs an explicit key otherwise two scenes end up having the same (default) name.
   constructor() {
      super({
        key: 'SelectionScene'
      });
    }

   preload() {
       this.load.setBaseURL("./assets/");
       this.load.image('back_card', 'cards/back.png');
       this.load.image('e_card', 'cards/e.png');
       this.load.image('a_card', 'cards/a.png');
       this.load.image('g_card', 'cards/g.png');
       this.load.image('l_card', 'cards/l.png');
       this.load.image('y_card', 'cards/y.png');
       this.load.image('s_card', 'cards/s.png');
   }

   init(data: { scrambled: string; })
   {
      this.scrambled = data.scrambled;
   }

   create() {
      class CardSprite extends Phaser.GameObjects.Sprite {
         card_key: string;
         animationConfig: {
            // Note: There are warnings for duplicates for 'e' (as expected).
            key: string; frames: { key: any; frame: number; duration: number; }[];
         };
         constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string | number) {
             super(scene, x, y, 'back_card', frame);
             scene.add.existing(this);
             this.card_key = texture;
             this.setScale(0.5);
             this.animationConfig = {
                 // Note: There are warnings for duplicates for 'e' (as expected).
                 key: "cardflip" + this.card_key,

                 frames: [
                     {
                         key: 'back_card',
                         frame: 0,
                         duration: 1000
                     },
                     {
                         key: this.card_key,
                         frame: 0,
                         duration: 1000
                     }
                 ]
             };

             scene.anims.create(this.animationConfig);
         }

         flipCard() {
             console.log('clicked: ' + this.card_key);
             this.play("cardflip" + this.card_key);
             this.removeInteractive();
         }
     }
     for (var letter_index = 0; letter_index < this.scrambled.length; ++letter_index) {
         const letter = this.scrambled[letter_index];
         const card_key = letter + '_card';

         var y_coordinate = 200;
         var x_offset = letter_index;
         if (letter_index >= this.scrambled.length / 2) {
             y_coordinate = 500;
             x_offset = this.scrambled.length - letter_index - 1;
         }

         var x_coordinate = 200 + (x_offset * 300);

         const card_sprite = new CardSprite(this, x_coordinate, y_coordinate, card_key, null);
         card_sprite.setInteractive().on(
             "pointerdown", card_sprite.flipCard
         );
     }
   }
}