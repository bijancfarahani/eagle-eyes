import { Client } from "@heroiclabs/nakama-js";
import { v4 as uuidv4 } from "uuid";
import { LEADERBOARD_ID, LEADERBOARD_WRITE_RPC_ID } from "./constants";

class Nakama {
   client: any;
   session: any;
   socket: any;
   matchID: any;

   async authenticate() {
      this.client = new Client("defaultkey", "192.168.68.63", "7350", false);
      let deviceId = localStorage.getItem("deviceId");
      if (!deviceId) {
         deviceId = uuidv4();
         localStorage.setItem("deviceId", deviceId);
      }
      try {
         this.session = await this.client.authenticateDevice(deviceId, true);
         localStorage.setItem("user_id", this.session.user_id);
         console.log("Successfully authenticated user.");
      } catch (err) {
         console.log(
            "Error authenticating device: %o:%o",
            err.statusCode,
            err.message,
         );
      }
   }

   async viewLeaderboard(): Promise<any> {
      if (this.session == null) {
         return;
      }
      try {
         this.client.listLeaderboardRecords(this.session, LEADERBOARD_ID);
      } catch (err) {
         console.log(
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
      scrambled: string,
   ) {
      try {
         var payload = {
            score: score,
            subscore: subscore,
            username: username,
            scrambled: scrambled,
         };
         var response = await this.client.rpc(
            this.session,
            LEADERBOARD_WRITE_RPC_ID,
            payload,
         );
         return response;
      } catch (error) {
         console.log("Error adding to leaderboard: %o", error.message);
      }
   }
}
export default new Nakama();
