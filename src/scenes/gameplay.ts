import { Deck, Card, getCardsPosition, getAnswerCardsPosition, RowLayout } from "../card";
import { EagleEyesConfig } from "../config";
import {
   ACTIVE_GUIDE_CARD_COLOR,
   CARD_OPEN_EVENT,
   FOUND_GUIDE_CARD_COLOR,
   GameMode,
   LOSING_CARD_COLOR,
} from "../constants";

export class GameplayScene extends Phaser.Scene {
   // Array of the deck of cards.
   deck: Deck;

   // Array of images which spell out the answer with the players progression.
   guideCards: Phaser.GameObjects.Image[];

   // The index into the answer string of the next correct letter to choose by flipping a card.
   target_index: number;

   // Flag for when the player is spending time memorizing the card positions.
   isPlayerMemorizing: boolean;

   // Timer for the length of time the player can look and memorization the cards before they are
   // turned face up.
   classicModeTimer: Phaser.Time.TimerEvent;

   // These are only used for Modern mode.
   timeText: Phaser.GameObjects.Text;
   memorizationRuntime: number;
   layoutToggle: Phaser.GameObjects.Text;
   private _sceneParams: { gameMode: GameMode; answer: string; deckLayout: RowLayout };

   // Typescript needs an explicit key otherwise two scenes end up having the same (default) name.
   constructor() {
      super({
         key: "GameplayScene",
      });
      this.deck = new Deck();
   }

   init(data: { gameMode: GameMode; answer: string; deckLayout: RowLayout | null }) {
      this._sceneParams = data;
      const deckLayoutPreference = localStorage.getItem("deckLayoutPreference");
      if (deckLayoutPreference == null) {
         this._sceneParams.deckLayout = RowLayout.Double;
      } else {
         this._sceneParams.deckLayout = parseInt(deckLayoutPreference, 10);
      }
   }

   create() {
      this.createCards();

      this.layoutToggle = this.add
         .text(
            +this.sys.game.config.width * 0.99,
            +this.sys.game.config.height * 0.1,
            "Toggle Display",
            {
               fontSize: "75px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
               align: "right",
            },
         )
         .setInteractive()
         .setOrigin(1, 0.5)
         .on("pointerup", () => this.onLayoutToggle());

      this.start();
   }
   onLayoutToggle() {
      if (this._sceneParams.deckLayout == RowLayout.Single) {
         this._sceneParams.deckLayout = RowLayout.Double;
      } else {
         this._sceneParams.deckLayout = RowLayout.Single;
      }
      localStorage.setItem(
         "deckLayoutPreference",
         this._sceneParams.deckLayout.valueOf().toString(),
      );
      this.scene.start("GameplayScene", { data: this._sceneParams });
   }

   showCards() {
      this.deck.cards.forEach((card) => {
         card.move();
      });
   }

   closeCards() {
      this.isPlayerMemorizing = false;
      this.deck.cards.forEach((card) => {
         card.closeCard();
         card.setInteractive();
      });
      this.timeText.setVisible(false);
      this.drawCardGuide();
   }

   start() {
      this.target_index = 0;
      this.memorizationRuntime = 0;
      this.isPlayerMemorizing = true;
      this.initCards();
      this.showCards();

      switch (this._sceneParams.gameMode) {
         case GameMode.Classic: {
            this.classicModeTimer = this.time.addEvent({
               delay: EagleEyesConfig.memorizationTime * 1000, // ms
               callback: this.closeCards,
               callbackScope: this,
               loop: false,
            });
            this.timeText = this.add
               .text(
                  +this.sys.game.config.width * 0.01,
                  +this.sys.game.config.height * 0.15,
                  `Time Remaining: ${this.classicModeTimer.getRemainingSeconds() + 1}`,
                  {
                     fontSize: "200px",
                     fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
                  },
               )
               .setOrigin(0, 0.5);
            break;
         }
         case GameMode.Modern: {
            this.timeText = this.add.text(0, 30, "Time Spent Memorizing: 0", {
               fontSize: "150px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            });
            this.input.once("pointerup", () => {
               this.closeCards();
            });
            break;
         }
      }
   }

   // Update the memorization time remaining or elapsed display.
   update(time: number): void {
      if (!this.isPlayerMemorizing) {
         return;
      }
      this.updateClock(time);
   }
   updateClock(time: number) {
      var modeTimer: number;
      var timerText: string;
      switch (this._sceneParams.gameMode) {
         case GameMode.Classic: {
            timerText = "Time Remaining";
            modeTimer = Math.floor(this.classicModeTimer.getRemainingSeconds() + 1);
            break;
         }
         case GameMode.Modern: {
            timerText = "Memorization Time";
            this.memorizationRuntime = time - this.time.startTime;
            modeTimer = Math.floor(this.memorizationRuntime / 1000);
            break;
         }
      }
      this.timeText.setText(`${timerText}: ${modeTimer}`);
   }

   createCards() {
      // Clear out cards from previous game attempts.
      this.deck.cards = [];

      for (const letter of this._sceneParams.answer) {
         let card = new Card(this, letter);
         card.on(CARD_OPEN_EVENT, this.onCardClicked, this);
         this.deck.cards.push(card);
      }
   }

   initCards() {
      const positions = getCardsPosition(
         +this.sys.game.config.width,
         +this.sys.game.config.height,
         this._sceneParams.deckLayout,
      );
      this.deck.shuffleDeck();
      this.deck.cards
         .slice()
         .reverse()
         .forEach((card) => {
            const position = positions.pop();
            card.init(position?.x, position?.y, position?.delay);
         });
   }

   onCardClicked(card: Card) {
      const target_letter = this._sceneParams.answer[this.target_index];

      // The player flipped over the wrong letter and lost the game.
      if (card.letter != target_letter) {
         card.setTint(LOSING_CARD_COLOR);
         this.guideCards[this.target_index].setTint(LOSING_CARD_COLOR);
         this.onPlayerLoss();
         return;
      }

      // The player correctly selected the next letter.
      card.setTint(FOUND_GUIDE_CARD_COLOR);
      setFoundGuideCard(this.guideCards[this.target_index]);
      ++this.target_index;
      // The last card was flipped and the player won the game.
      if (this.target_index == this._sceneParams.answer.length) {
         const shuffle = this.deck.shuffle();
         this.scene.start("WinScene", {
            gameMode: this._sceneParams.gameMode,
            answer: this._sceneParams.answer,
            shuffle: shuffle,
            memorizationTime: this.memorizationRuntime,
         });
      } else {
         setActiveGuideCard(this.guideCards[this.target_index]);
      }

      function setFoundGuideCard(card: Phaser.GameObjects.Image) {
         card.setScale(0.5);
         card.setTint(FOUND_GUIDE_CARD_COLOR);
      }
   }
   onPlayerLoss() {
      this.deck.cards.forEach((card) => {
         card.disableInteractive();
         card.openCard();
         card.setAlpha(0.3);
      });

      this.add
         .text(
            +this.sys.game.config.width * 0.99,
            +this.sys.game.config.height * 0.6,
            "Replay",
            {
               fontSize: "150px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
               align: "right",
            },
         )
         .setOrigin(1, 0.5)
         .setInteractive()
         .on("pointerup", () => this.scene.restart());

      this.add
         .text(
            +this.sys.game.config.width * 0.99,
            +this.sys.game.config.height * 0.7,
            "Title Screen",
            {
               fontSize: "150px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
               align: "right",
            },
         )
         .setInteractive()
         .setOrigin(1, 0.5)
         .on("pointerup", () => {
            this.scene.start("TitleScene");
         });
   }

   drawCardGuide() {
      const positions = getAnswerCardsPosition(
         +this.sys.game.config.width,
         this._sceneParams.answer,
      );
      this.guideCards = [];
      for (
         var letter_index = 0;
         letter_index < this._sceneParams.answer.length;
         ++letter_index
      ) {
         var card = this.add.image(
            positions[letter_index].x,
            positions[letter_index].y,
            `card_${this._sceneParams.answer[letter_index]}`,
         );
         card.setScale(0.5);
         card.setAlpha(0.3);
         this.guideCards.push(card);
      }
      // Detail the first target card.
      setActiveGuideCard(this.guideCards[0]);
   }
}
function setActiveGuideCard(cardImage: Phaser.GameObjects.Image) {
   cardImage.setAlpha(1);
   cardImage.setScale(0.6);
   cardImage.setTint(ACTIVE_GUIDE_CARD_COLOR);
}
