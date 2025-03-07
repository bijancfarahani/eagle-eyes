import { EagleEyesConfig } from "../config";

export class MemorizationScene extends Phaser.Scene {

   // Typescript needs an explicit key otherwise two scenes end up having the same (default) name.
   constructor() {
      super({
        key: 'MemorizationScene'
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

   create() {
       const answer = 'eagleeyes';
       const answer_chars = answer.split("");
       answer_chars.sort(() => 0.5 - Math.random());
       const scrambled = answer_chars.join("");
       //this.game.scrambled = scrambled;
       for (var letter_index = 0; letter_index < scrambled.length; ++letter_index) {
           const letter = scrambled[letter_index];
           const card_key = letter + '_card';
           var y_coordinate = 200;
           var x_offset = letter_index;
           var left_alignment = 150;
           if (letter_index >= scrambled.length / 2) {
               y_coordinate = 500;
               x_offset = scrambled.length - letter_index - 1;
               left_alignment = 250;
           }

           var x_coordinate = left_alignment + (x_offset * 250);
           var card_sprite = this.add.sprite(x_coordinate, y_coordinate, card_key);
           card_sprite.setScale(0.5);
       }

       // Proceed to the card selection scene and pass along the
       // scrambled letters.
       function on_memorization_timer_expire() {
           this.scene.start("SelectionScene", {scrambled: scrambled});
       }

       var timer = this.time.addEvent({
           delay: EagleEyesConfig.memorizationTime * 1000, // ms
           callback: on_memorization_timer_expire,
           callbackScope: this,
           loop: false,
       });

   }
}