import { GameMode } from "../constants";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(
   "https://pjaythugyatlthozuark.supabase.co",
   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqYXl0aHVneWF0bHRob3p1YXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMTcwODIsImV4cCI6MjA1NzU5MzA4Mn0.nCE72HK3tQGCQj3HmY0g_WQEv7HSnZ3amIBdat0fOJM",
);
//const supabase = createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

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
      const { error } = await supabase.from("Modern Mode Leaderboard").insert({
         created_at: new Date(Date.now()).toISOString(),
         memorization_time: this.memorizationTime,
         player_name: player_name,
         scrambled: this.scrambled,
      });
      if (error) { }
   }
   async viewLeaderboard() {
      const { data, error } = await supabase
         .from("Modern Mode Leaderboard")
         .select()
         .order("memorization_time");
      if (error) { }
      console.log(data);
   }
}
