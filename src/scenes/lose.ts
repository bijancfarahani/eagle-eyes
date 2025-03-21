export class LoseScene extends Phaser.Scene {
   constructor() {
      super({
         key: "LoseScene",
      });
   }

   create() {
      this.add.text(0, 0, "You lost!", {
         fontSize: "48px",
         fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
      });
      const card_sprite = this.add.sprite(400, 400, "card_back");
      card_sprite.setInteractive().on(
         "pointerdown",
         function () {
            this.scene.start("TitleScene");
         },
         this,
      );
   }
}
