export function getCardsPosition(): { x: number; y: number }[] {
   const cardWidth = 196 + 5;
   const cardHeight = 306 + 5;
   const COLS = 2;
   const ROWS = 5;
   const positions = [];
   const offsetX =
      (+this.sys.game.config.width - cardWidth * COLS) / 2 + cardWidth / 2;
   const offsetY =
      (+this.sys.game.config.height - cardHeight * ROWS) / 2 + cardHeight / 2;

   let id = 0;
   for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
         positions.push({
            x: offsetX + c * cardWidth,
            y: offsetY + r * cardHeight,
            delay: ++id * 100,
         });
      }
   }
   Phaser.Utils.Array.Shuffle(positions);
   return positions;
}
