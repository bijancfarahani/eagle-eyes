import { createClient } from "@supabase/supabase-js";
import { EagleEyesConfig } from "../config";
import { GameMode } from "../constants";
import supabase from "../supabase";
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
      const { data, error } = await supabase
         .from("Modern Mode Leaderboard")
         .select()
         .order("memorization_time");
      console.log(data);
   }

   async addToLeaderboard() {
      const player_name = "test_player_name";
      const { error } = await supabase.from("Modern Mode Leaderboard").insert({
         created_at: new Date(Date.now()).toISOString(),
         memorization_time: 10,
         player_name: player_name,
         scrambled: "scrambled",
      });
   }
   startGame(gameMode: GameMode) {
      this.scene.start("GameplayScene", {
         gameMode: gameMode,
         answer: EagleEyesConfig.answer,
      });
   }
}
