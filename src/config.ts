import { TitleScene } from "./scenes/title";
import { GameplayScene } from "./scenes/gameplay";
import { WinScene } from "./scenes/win";

export const GameConfig: Phaser.Types.Core.GameConfig = {
   title: "Eagle Eyes",
   url: "https://github.com/bijancfarahani/eagle-eyes",
   version: "0.0.1",
   width: 2560,
   height: 1440,

   scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
   },
   type: Phaser.AUTO,
   parent: "game",
   scene: [TitleScene, GameplayScene, WinScene],
   backgroundColor: "#3a7063",
   render: {
      pixelArt: false,
      antialias: true,
   },
};

export const EagleEyesConfig = {
   // Number of seconds players have to memorize the shuffle letters.
   memorizationTime: 6,
   answer: "eagleeyes",
};
