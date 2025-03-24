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
        this.client = new Client("defaultkey", "localhost", "7350", false);
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
        var leaderboardId = "weekly_leaderboard";
        var result = this.client.listLeaderboardRecords(this.session, leaderboardId);
       // if(result.records == null) {return;}
        result.records.forEach(function(record){
            console.log("record username %o and score %o", record.username, record.score);
        })
    }
    async addToLeaderboard(): Promise<any>{
        var leaderboardId = "weekly_leaderboard";
        var submission = {score: 202};
        var result = this.client.writeLeaderboardRecord(this.session, leaderboardId, submission);
        console.log("record username %o and score %o", result.username, result.score);
    }
   }

export default new Nakama()

