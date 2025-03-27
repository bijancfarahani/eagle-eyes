import { Client } from "@heroiclabs/nakama-js";
import { v4 as uuidv4 } from "uuid";
import { LEADERBOARD_ID, LEADERBOARD_WRITE_RPC_ID } from "./constants";

class Nakama {
   client: any;
   session: any;
   deviceId: string;
   isAuthenticated: boolean;

   async authenticate() {
      this.client = new Client("defaultkey", "192.168.68.63", "7350", false);
      this.deviceId = localStorage.getItem("deviceId");
      if (!this.deviceId) {
         this.deviceId = uuidv4();
         localStorage.setItem("deviceId", this.deviceId);
      }
      try {
         this.session = await this.client.authenticateDevice(
            this.deviceId,
            true,
         );
         localStorage.setItem("user_id", this.session.user_id);
         this.isAuthenticated = true;
      } catch (err) {
         console.error(
            "Error authenticating device: %o:%o",
            err.statusCode,
            err.message,
         );
      }
   }

   async getTopFiveLeaderboard(): Promise<any> {
      if (!this.isAuthenticated) {
         console.error("Not authenticated.");
         return null;
      }
      try {
         return this.client.listLeaderboardRecords(
            this.session,
            LEADERBOARD_ID,
         );
      } catch (err) {
         console.error(
            "Error fetching leaderboard: %o:%o",
            err.statusCode,
            err.message,
         );
      }
   }

   async getNearbyLeaderboard(): Promise<any> {
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
         console.error(
            "Error fetching leaderboard: %o:%o",
            err.statusCode,
            err.message,
         );
      }
   }

   async addToLeaderboard(
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
export default new Nakama();
