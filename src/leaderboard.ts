import { LeaderboardRecordList } from "@heroiclabs/nakama-js";
import { NUM_LEADERBOARD_ROWS } from "./constants";
import Nakama from "./nakama";

export class LeaderboardContainer extends Phaser.GameObjects.Container {
   leaderboardRecordPointer: number = 0;
   scrollLeftButton: Phaser.GameObjects.Text;
   scrollRightButton: Phaser.GameObjects.Text;
   nearbyLeaderboard: Phaser.GameObjects.Text;
   topFiveLeaderboard: Phaser.GameObjects.Text;
   leaderboardRecords: Phaser.GameObjects.Text[];

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

   drawLeaderboardRows(leaderboardRecords: LeaderboardRecordList) {
      let lastRecordHeight = +this.scene.sys.game.config.height * 0.6;

      const numRecordsToDraw = Math.min(
         NUM_LEADERBOARD_ROWS,
         leaderboardRecords.records.length - this.leaderboardRecordPointer,
      );
      if (numRecordsToDraw == 0) {
         return;
      }
      for (let index = 0; index < numRecordsToDraw; index++) {
         const record = leaderboardRecords.records[index + this.leaderboardRecordPointer];
         const recordHeight = +this.scene.sys.game.config.height * 0.6 + index * 100;
         lastRecordHeight = recordHeight + 100;
         this.leaderboardRecords[index].setText(
            `Rank: #${record.rank}, Player: ${record.username}, Memorization Time: ${record.score / 1000}, Scramble: ${record.metadata["Shuffle"]}`,
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
      const leaderboardRecords = await Nakama.getTopFiveLeaderboard();
      if (leaderboardRecords == null) {
         this.scene.add.text(this.x, this.y, "Unable to fetch leaderboard ", {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         });
         return;
      }

      this.topFiveLeaderboard = this.scene.add
         .text(this.x, this.y, "Top 5 Leaderboard", {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         })
         .disableInteractive()
         .on("pointerdown", () => this.drawTopFiveLeaderboard());

      this.nearbyLeaderboard = this.scene.add
         .text(this.width * 0.6, this.y, "Leaderboard Near Me", {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         })
         .setInteractive()
         .setAlpha(0.5)
         .on("pointerdown", () => this.drawLeaderboardNearPlayer());

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
         .on("pointerdown", () => this.scrollLeaderboard(0));

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
         .on("pointerdown", () => this.scrollLeaderboard(1));

      this.drawLeaderboardRows(leaderboardRecords);
   }

   async scrollLeaderboard(direction: number) {
      const leaderboardRecords = await Nakama.getTopFiveLeaderboard();
      if (direction === 0) {
         if (this.leaderboardRecordPointer === 0) {
            return;
         }
         this.leaderboardRecordPointer = Math.max(
            0,
            this.leaderboardRecordPointer - NUM_LEADERBOARD_ROWS,
         );
      } else {
         if (this.leaderboardRecordPointer === leaderboardRecords.records.length - 1) {
            return;
         }
         this.leaderboardRecordPointer = Math.min(
            leaderboardRecords.records.length - 1,
            this.leaderboardRecordPointer + NUM_LEADERBOARD_ROWS,
         );
      }
      this.drawLeaderboardRows(leaderboardRecords);
   }

   async drawTopFiveLeaderboard() {
      this.nearbyLeaderboard.setAlpha(0.5).setInteractive();

      const result = await Nakama.getTopFiveLeaderboard();
      this.drawLeaderboardRows(result);
      this.topFiveLeaderboard.setAlpha(1).disableInteractive();
   }

   async drawLeaderboardNearPlayer() {
      this.topFiveLeaderboard.setAlpha(0.5).setInteractive();

      const result = await Nakama.getNearbyLeaderboard();
      this.drawLeaderboardRows(result);

      this.nearbyLeaderboard.setAlpha(1).disableInteractive();
   }
}
