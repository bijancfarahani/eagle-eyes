export class TitleScene extends Phaser.Scene {
   constructor() {
      super({
         key: "TitleScene",
      });
   }

   preload() {
      this.load.setBaseURL("./assets/");
      this.load.image("back_card", "cards/back.png");
      this.load.image("e_card", "cards/e.png");
      this.load.image("a_card", "cards/a.png");
      this.load.image("g_card", "cards/g.png");
      this.load.image("l_card", "cards/l.png");
      this.load.image("y_card", "cards/y.png");
      this.load.image("s_card", "cards/s.png");
   }
   create() {
      this.add.text(0, 0, "Welcome to Eagle Eyes!", {
         fontSize: "48px",
         fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      });
      const card_sprite = this.add.sprite(400, 400, "back_card");
      card_sprite.setInteractive().on(
         "pointerdown",
         function () {
            this.scene.start("MemorizationScene");
         },
         this,
      );
   }
}
