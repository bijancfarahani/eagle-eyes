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
        this.client = new Client("defaultkey", "localhost", "7350", true);

        let deviceId = localStorage.getItem("deviceId");
        if (!deviceId) {
            deviceId = uuidv4();
            localStorage.setItem("deviceId", deviceId);
        }

        this.session = await this.client.authenticateDevice(deviceId, true);
        localStorage.setItem("user_id", this.session.user_id);

        const trace = false;
        this.socket = this.client.createSocket(this.useSSL, trace);
        await this.socket.connect(this.session);

    }   useSSL(useSSL: any, trace: boolean): any {
      throw new Error("Method not implemented.");
   }
}
export default new Nakama()

