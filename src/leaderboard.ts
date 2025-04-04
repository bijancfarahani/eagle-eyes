import { LeaderboardRecord } from "@heroiclabs/nakama-js";
import { MAX_PLAYERNAME_LENGTH, NUM_LEADERBOARD_ROWS } from "./constants";
import Nakama from "./nakama";

export class LeaderboardContainer extends Phaser.GameObjects.Container {
   scrollLeftButton: Phaser.GameObjects.Text;
   scrollRightButton: Phaser.GameObjects.Text;
   nearbyLeaderboard: Phaser.GameObjects.Text;
   topFiveLeaderboard: Phaser.GameObjects.Text;
   leaderboardRecords: Phaser.GameObjects.Text[];
   next_cursor: string;
   prev_cursor: string;

   constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
      super(scene, x, y);
      this.width = width;
      this.height = height;

      this.leaderboardRecords = new Array(NUM_LEADERBOARD_ROWS);

      // Add leaderboard row objects.
      for (let index = 0; index < NUM_LEADERBOARD_ROWS; index++) {
         const recordHeight = +scene.game.config.height * 0.6 + index * 100;
         this.leaderboardRecords[index] = scene.add
            .text(+scene.game.config.width * 0.01, recordHeight, `Index: ${index}`, {
               fontSize: "50px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            })
            .setVisible(false);
      }
   }

   drawLeaderboardRows(leaderboardRecords: Array<LeaderboardRecord>) {
      let lastRecordHeight = +this.scene.sys.game.config.height * 0.6;

      const numRecordsToDraw = Math.min(NUM_LEADERBOARD_ROWS, leaderboardRecords.length);
      if (numRecordsToDraw == 0) {
         return;
      }
      for (let index = 0; index < numRecordsToDraw; index++) {
         const record = leaderboardRecords[index];
         const recordHeight = +this.scene.sys.game.config.height * 0.6 + index * 100;
         lastRecordHeight = recordHeight + 100;
         const displayScore = (
            parseFloat(`${record.score.toString()}.${record.subscore.toString()}`) / 1000
         ).toFixed(3);
         const displayRank = `${record.rank}:`.padEnd(3);
         this.leaderboardRecords[index].setText(
            `#${displayRank} ${record.username.padEnd(MAX_PLAYERNAME_LENGTH - 1, " ")} Memorization Time: ${displayScore.padEnd(6)}    Shuffle: ${record.metadata["Shuffle"]}`,
         );
         this.leaderboardRecords[index].setVisible(true);
      }
      const numRecordsToHide = NUM_LEADERBOARD_ROWS - numRecordsToDraw;
      if (numRecordsToHide == NUM_LEADERBOARD_ROWS) {
         return;
      }
      for (
         let index = NUM_LEADERBOARD_ROWS - numRecordsToHide;
         index < numRecordsToHide + 1;
         index++
      ) {
         this.leaderboardRecords[index].setVisible(false);
      }

      this.scrollLeftButton.setY(lastRecordHeight);
      this.scrollRightButton.setY(lastRecordHeight);
   }

   async drawLeaderboard() {
      if (this.leaderboardRecords == null) {
         this.scene.add.text(this.x, this.y, "Unable to fetch leaderboard ", {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         });
         return;
      }

      // Create UI objects to draw on.
      this.topFiveLeaderboard = this.scene.add
         .text(this.width * 0.05, this.y, "Top 5 Leaderboard", {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         })
         .disableInteractive()
         .on("pointerup", () => this.drawTopFiveLeaderboard());

      this.nearbyLeaderboard = this.scene.add
         .text(this.width * 0.75, this.y, "Leaderboard Near Me", {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         })
         .disableInteractive()
         .setAlpha(0.5)
         .setVisible(false)
         .on("pointerup", () => this.drawLeaderboardNearPlayer());

      this.scrollLeftButton = this.scene.add
         .text(
            +this.scene.sys.game.config.width * 0.1,
            +this.scene.sys.game.config.height * 0.55,
            "<<",
            {
               fontSize: "70px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         )
         .setInteractive()
         .on("pointerup", () => this.scrollLeaderboard(-1));

      this.scrollRightButton = this.scene.add
         .text(
            +this.scene.sys.game.config.width * 0.15,
            +this.scene.sys.game.config.height * 0.55,
            ">>",
            {
               fontSize: "70px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         )
         .setInteractive()
         .on("pointerup", () => this.scrollLeaderboard(1));

      // Draw on the UI elements that were created above.
      this.drawTopFiveLeaderboard();
   }

   private async scrollLeaderboard(direction: number) {
      let leaderboardRecords = null;
      switch (direction) {
         case -1: {
            if (this.prev_cursor == null) {
               return;
            }
            leaderboardRecords = await Nakama.getTopFiveLeaderboard(this.prev_cursor);
            break;
         }
         case 1: {
            if (this.next_cursor == null) {
               return;
            }
            leaderboardRecords = await Nakama.getTopFiveLeaderboard(this.next_cursor);
            break;
         }
         default: {
            return;
         }
      }

      if (leaderboardRecords == null) {
         return;
      }

      this.prev_cursor = leaderboardRecords.prev_cursor;
      this.next_cursor = leaderboardRecords.next_cursor;
      this.drawLeaderboardRows(leaderboardRecords.records.slice());
   }

   async drawTopFiveLeaderboard() {
      this.nearbyLeaderboard.setAlpha(0.5).setInteractive();
      this.topFiveLeaderboard.setAlpha(1).disableInteractive();

      const result = await Nakama.getTopFiveLeaderboard();
      if (result == null) {
         return;
      }

      this.next_cursor = result.next_cursor;
      this.drawLeaderboardRows(result.records.slice());
   }

   async drawLeaderboardNearPlayer() {
      this.topFiveLeaderboard.setAlpha(0.5).setInteractive();
      this.nearbyLeaderboard.setAlpha(1).disableInteractive();

      const result = await Nakama.getNearbyLeaderboard();
      if (result == null) {
         return;
      }

      this.prev_cursor = result.prev_cursor;
      this.next_cursor = result.next_cursor;

      this.drawLeaderboardRows(result.records.slice());
   }
}
