import { GameMode } from "../constants";
import Nakama from "../nakama";

export class WinScene extends Phaser.Scene {
   gameMode: GameMode;
   answer: string;
   scrambled: string;
   memorizationTime: number;
   constructor() {
      super({
         key: "WinScene",
      });
   }

   init(data: {
      gameMode: GameMode;
      answer: string;
      scrambled: string;
      memorizationTime: number;
   }) {
      this.gameMode = data.gameMode;
      this.answer = data.answer;
      this.scrambled = data.scrambled;
      this.memorizationTime = data.memorizationTime;
   }

   create() {
      this.add.text(0, 0, "You won!!!", {
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
      /* if (this.gameMode == GameMode.Modern) {
          const startClassicMode = this.add
             .text(400, 1000, "Add to Leaderboard!", {
                fontSize: "70px",
                fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
             })
             .setInteractive()
             .on("pointerdown", () => this.addToLeaderboard());
          const startModernMode = this.add
             .text(1000, 400, "View Leaderboard", {
                fontSize: "70px",
                fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
             })
             .setInteractive()
             .on("pointerdown", () => this.viewLeaderboard());
       }*/
   }
   async addToLeaderboard() {
      const player_name = "test_player_name";
      console.log("Adding to leaderboard:" + this.memorizationTime);
      // const { error } = await supabase.from("Modern Mode Leaderboard").insert({
      //    created_at: new Date(Date.now()).toISOString(),
      //    memorization_time: this.memorizationTime,
      //    player_name: player_name,
      //    scrambled: this.scrambled,
      // });
      // if (error) { }
   }
   async viewLeaderboard() {
      // const { data, error } = await supabase
      //    .from("Modern Mode Leaderboard")
      //    .select()
      //    .order("memorization_time");
      // if (error) { }
      // console.log(data);
   }
}
