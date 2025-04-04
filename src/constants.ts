// Each card image is 470 x 470 pixels.
export const CARD_SIZE = 470;
export const CARD_PADDING = 5;
export const ROWS = 2;
export const COLS = [5, 4];

export enum GameMode {
   Classic,
   Modern,
}

export const FOUND_GUIDE_CARD_COLOR = 0x00d11c;
export const ACTIVE_GUIDE_CARD_COLOR = 0xf5bb40;
export const LOSING_CARD_COLOR = 0xd43d3d;

export const LEADERBOARD_ID = "modern_mode";
export const LEADERBOARD_WRITE_RPC_ID = "leaderboard_record_write_id";
export const NUM_LEADERBOARD_ROWS = 5;
export const MAX_PLAYERNAME_LENGTH = 15;
