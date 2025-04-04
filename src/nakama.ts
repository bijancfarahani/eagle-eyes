import { Client, Session, LeaderboardRecordList } from "@heroiclabs/nakama-js";
import { v4 as uuidv4 } from "uuid";
import {
   LEADERBOARD_ID,
   LEADERBOARD_WRITE_RPC_ID,
   MAX_PLAYERNAME_LENGTH,
} from "./constants";

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
      } catch (error) {}
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
            5,
            cursor,
         );
      } catch (error) {}
   }

   public async getNearbyLeaderboard(): Promise<LeaderboardRecordList> {
      if (!this.isAuthenticated) {
         return;
      }
      try {
         return this.client.listLeaderboardRecordsAroundOwner(
            this.session,
            LEADERBOARD_ID,
            this.deviceId,
            5,
         );
      } catch (error) {}
   }

   public async addToLeaderboard(
      memorizationTime: number,
      username: string,
      shuffle: string,
   ): Promise<boolean> {
      const numStr = String(memorizationTime);
      const [integerPart, decimalPart] = numStr.split(".");
      const [score, subscore] = [
         parseInt(integerPart, 10),
         parseInt(decimalPart || "0", 10),
      ];
      // Sanitize username input.
      username = username.trim().substring(0, MAX_PLAYERNAME_LENGTH);

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
         return false;
      }
   }
}
export default Nakama.getInstance();
