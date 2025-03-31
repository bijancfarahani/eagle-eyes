import { Client, Session, LeaderboardRecordList } from "@heroiclabs/nakama-js";
import { v4 as uuidv4 } from "uuid";
import { LEADERBOARD_ID, LEADERBOARD_WRITE_RPC_ID } from "./constants";

class Nakama {
   client: Client;
   session: Session;
   deviceId: string;
   isAuthenticated: boolean;
   private static instance: Nakama | null = null;

   // Private constructor to enforce singleton pattern.
   private constructor() {}

   public static getInstance(): Nakama {
      if (!Nakama.instance) {
         Nakama.instance = new Nakama();
      }
      return Nakama.instance;
   }

   public async authenticateDevice() {
      if (!this.client) {
         this.client = new Client(
            process.env.NAKAMA_KEY,
            process.env.NAKAMA_URL,
            "", // Reverse proxy handles the port
            true,
         );
      }
      this.deviceId = localStorage.getItem("deviceId");
      if (!this.deviceId) {
         this.deviceId = uuidv4();
         localStorage.setItem("deviceId", this.deviceId);
      }
      try {
         this.session = await this.client.authenticateDevice(this.deviceId, true);
         localStorage.setItem("user_id", this.session.user_id);
         this.isAuthenticated = true;
      } catch (err) {
         console.error("Error authenticating device: %o:%o", err.statusCode, err.message);
      }
   }

   public async getTopFiveLeaderboard(
      cursor: string | null = null,
   ): Promise<LeaderboardRecordList> {
      if (!this.isAuthenticated) {
         await this.authenticateDevice();
      }
      try {
         return await this.client.listLeaderboardRecords(
            this.session,
            LEADERBOARD_ID,
            null,
            10,
            cursor,
         );
      } catch (err) {
         console.error("Error fetching leaderboard: %o:%o", err.statusCode, err.message);
      }
   }

   public async getNearbyLeaderboard(): Promise<any> {
      if (!this.isAuthenticated) {
         console.error("Not authenticated.");
         return;
      }
      try {
         return this.client.listLeaderboardRecordsAroundOwner(
            this.session,
            LEADERBOARD_ID,
            this.deviceId,
            5,
         );
      } catch (err) {
         console.error("Error fetching leaderboard: %o:%o", err.statusCode, err.message);
      }
   }

   public async addToLeaderboard(
      score: number,
      subscore: number,
      username: string,
      shuffle: string,
   ): Promise<boolean> {
      try {
         const payload = {
            score: score,
            subscore: subscore,
            username: username,
            shuffle: shuffle,
         };
         await this.client.rpc(this.session, LEADERBOARD_WRITE_RPC_ID, payload);
         return true;
      } catch (error) {
         console.error("Error adding to leaderboard: %o", error.message);
         return false;
      }
   }
}
export default Nakama.getInstance();
