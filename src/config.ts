import { TitleScene } from "./scenes/title";
import { MemorizationScene } from "./scenes/memorization";
import { SelectionScene } from "./scenes/selection";
import { LoseScene } from "./scenes/lose";
import { WinScene } from "./scenes/win";

export const GameConfig: Phaser.Types.Core.GameConfig = {
   title: "Eagle Eyes",
   url: "https://github.com/bijancfarahani/eagle-eyes",
   version: "0.0.1",
   width: 1280,
   height: 720,
   type: Phaser.AUTO,
   parent: "game",
   scene: [TitleScene, MemorizationScene, SelectionScene, LoseScene, WinScene],
   backgroundColor: "#0",
   render: { pixelArt: false, antialias: true },
};

export const EagleEyesConfig = {
   // Number of seconds players have to memorize the scrambled letters.
   memorizationTime: 5,
};
