import { EagleEyesConfig } from "../config";
import { GameMode } from "../constants";
import Nakama from "../nakama";
export class TitleScene extends Phaser.Scene {
   gameMode: GameMode;
   constructor() {
      super({
         key: "TitleScene",
      });
   }

   preload() {

      this.load.setBaseURL("./assets/");
      this.load.image("card_back", "cards/back.png");
      this.load.image("card_e", "cards/e.png");
      this.load.image("card_a", "cards/a.png");
      this.load.image("card_g", "cards/g.png");
      this.load.image("card_l", "cards/l.png");
      this.load.image("card_y", "cards/y.png");
      this.load.image("card_s", "cards/s.png");
   }
   create() {
      Nakama.authenticate();


      this.add.text(0, 0, "Welcome to Eagle Eyes!", {
         fontSize: "48px",
         fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
      });
      const startClassicMode = this.add
         .text(400, 400, "Classic Mode", {
            fontSize: "70px",
            fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
         })
         .setInteractive()
         .on("pointerdown", () => this.startGame(GameMode.Classic));
      const startModernMode = this.add
         .text(1000, 400, "Modern Mode", {
            fontSize: "70px",
            fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
         })
         .setInteractive()
         .on("pointerdown", () => this.startGame(GameMode.Modern));
       const viewLeaderboard = this.add
          .text(1000, 700, "View Leaderboard", {
             fontSize: "70px",
             fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
          })
          .setInteractive()
          .on("pointerdown", () => this.viewLeaderboard());
          const addLeaderboard = this.add
             .text(400, 700, "Add Leaderboard", {
                fontSize: "70px",
                fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
             })
             .setInteractive()
             .on("pointerdown", () => this.addToLeaderboard());
   }
   async viewLeaderboard() {
      console.log('view leaderboard');
      var limit = 20;
      var leaderboardName = "weekly_imposter_wins";
      Nakama.viewLeaderboard();

    //  const result = await client.listLeaderboardRecords(session, leaderboardName, ownerIds: null, expiry: null, limit, cursor: null);

   //   result.records.forEach(fuction(record){
   //       console.log("%o:%o", record.owner.id, record.score);
   //   });
           /* const { data, error } = await supabase
         .from("Modern Mode Leaderboard")
         .select()
         .order("memorization_time");
      if (error) {
         console.log(`Error: ${error}`);
         return;
      }


      this.add
         .text(0, 800, "Leaderboard", {
            fontSize: "70px",
            fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
         });
      for (let rank = 0; rank < Math.min(10, data.length); rank++) {
         this.add
            .text(0, 1000 + (rank * 100), `Rank: #${rank}, Player: ${data[rank].player_name}, Memorization Time: ${data[rank].memorization_time / 1000}, Date: ${data[rank].created_at}`, {
               fontSize: "50px",
               fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
            });
      }*/
   }

   async addToLeaderboard() {
    Nakama.addToLeaderboard();
//var record = await client.writeLeaderboardRecord(session, leaderboardId, submission);
//console.log("New record username %o and score %o", record.username, record.score);

      // const player_name = "test_player_name";
      // const { error } = await supabase.from("Modern Mode Leaderboard").insert({
      //    created_at: new Date(Date.now()).toISOString(),
      //    memorization_time: 10,
      //    player_name: player_name,
      //    scrambled: "scrambled",
      // });
   }
   startGame(gameMode: GameMode) {
      this.scene.start("GameplayScene", {
         gameMode: gameMode,
         answer: EagleEyesConfig.answer,
      });
   }
}
