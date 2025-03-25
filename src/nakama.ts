import { Client } from "@heroiclabs/nakama-js";
import { v4 as uuidv4 } from "uuid";

class Nakama {
    client: any;
    session: any;
    socket: any;
    matchID: any;
    constructor() {
        this.client
        this.session
        this.socket
        this.matchID
    }

    async authenticate() {
        const useSSL = false;
        this.client = new Client("defaultkey", "192.168.68.64", "7350", false);
        let deviceId = localStorage.getItem("deviceId");
        if (!deviceId) {
            deviceId = uuidv4();
            localStorage.setItem("deviceId", deviceId);
        }
        console.log("DEVICE ID: " + deviceId);

        this.session = await this.client.authenticateDevice(deviceId, true);
        localStorage.setItem("user_id", this.session.user_id);



    }
    async viewLeaderboard(): Promise<any>{
        return this.client.listLeaderboardRecords(this.session, "modern_mode");
    }
    async addToLeaderboard(): Promise<any>{
        try {
            var payload = { score: 205, subscore:50, username: "test user"};
            var response = await this.client.rpc(this.session, "LeaderboardRecordWrite", payload);
            console.log("leaderboard add success equipped successfully", response);
        }
        catch (error) {
            console.log("Error: %o", error.message);
        }



       // return this.client.writeLeaderboardRecord(this.session, leaderboardId, submission);
    }
   }

export default new Nakama()

