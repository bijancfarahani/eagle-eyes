import Card, { getCardsPosition } from "../card";
import { EagleEyesConfig } from "../config";
import { GameMode } from "../constants";

export class GameplayScene extends Phaser.Scene {
   gameMode: GameMode;

   // Array of the deck of cards.
   cards: Card[] = [];

   // The index into the answer string of the next correct letter to choose by flipping a card.
   target_index: number;

   // Timer for the length of time the player can look and memorization the cards before they are
   // turned face down.
   classicModeTimer: Phaser.Time.TimerEvent;

   // These are only used for Modern mode.
   timeText: Phaser.GameObjects.Text;
   isPlayerMemorizing: boolean;
   memorizationRuntime: number;

   // Typescript needs an explicit key otherwise two scenes end up having the same (default) name.
   constructor() {
      super({
         key: "GameplayScene",
      });
   }

   init(data: { gameMode: GameMode }) {
      this.gameMode = data.gameMode;
   }

   create() {
      this.createCards();
      this.start();
   }

   showCards() {
      this.cards.forEach((card) => {
         card.move();
      });
   }

   closeCards() {
      this.cards.forEach((card) => {
         card.closeCard();
         card.setInteractive();
      });
   }

   start() {
      this.target_index = 0;
      this.memorizationRuntime = 0;
      this.initCards();
      this.showCards();

      switch (this.gameMode) {
         case GameMode.Classic: {
            this.classicModeTimer = this.time.addEvent({
               delay: EagleEyesConfig.memorizationTime * 1000, // ms
               callback: this.closeCards,
               callbackScope: this,
               loop: false,
            });
            this.timeText = this.add.text(
               0,
               0,
               `Time Remaining: ${this.classicModeTimer.getRemainingSeconds()}`,
               {
                  fontSize: "48px",
                  fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
               },
            );
            break;
         }
         case GameMode.Modern: {
            this.isPlayerMemorizing = true;
            this.timeText = this.add.text(0, 0, "Time Spent Memorizing: 0", {
               fontSize: "48px",
               fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
            });
            this.input.once("pointerdown", () => {
               this.isPlayerMemorizing = false;
               this.closeCards();
            });
            break;
         }
      }
   }

   // Update the memorization time remaining or elapsed display.
   update(time: number, _delta: number): void {
      switch (this.gameMode) {
         case GameMode.Classic: {
            this.timeText.setText(
               `Time Remaining: ${Math.floor(this.classicModeTimer.getRemainingSeconds())}`,
            );
            break;
         }
         case GameMode.Modern: {
            if (!this.isPlayerMemorizing) {
               return;
            }
            this.memorizationRuntime = time - this.time.startTime;
            this.timeText.setText(
               `Memorization Time: ${Math.floor(this.memorizationRuntime / 1000)}`,
            );
            break;
         }
      }
   }

   createCards() {
      // Clear out cards from previous game attempts.
      this.cards = [];

      for (const letter of EagleEyesConfig.answer) {
         this.cards.push(new Card(this, letter));
      }
      this.input.on("gameobjectdown", this.onCardClicked, this);
   }

   initCards() {
      const positions = getCardsPosition(
         +this.sys.game.config.width,
         +this.sys.game.config.height,
      );

      this.cards.forEach((card) => {
         const position = positions.pop();
         card.init(position?.x, position?.y, position?.delay);
      });
   }

   onCardClicked(pointer: { x: number; y: number }, card: Card) {
      // NO-OP if the player tries to flip a card they already flipped.
      if (card.isOpened) {
         return false;
      }
      // Reveal the selected card.
      card.openCard();
      const target_letter = EagleEyesConfig.answer[this.target_index];

      // The player flipped over the wrong letter and lost the game.
      if (card.letter != target_letter) {
         this.scene.start("LoseScene");
      }

      // The player correctly selected the next letter.
      ++this.target_index;
      // The last card was flipped and the player won the game.
      if (this.target_index == EagleEyesConfig.answer.length) {
         this.scene.start("WinScene");
      }
   }
}
