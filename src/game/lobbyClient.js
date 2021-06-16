import {LobbyClient} from 'boardgame.io/client';
import {GAME_NAME, LOBBY_SERVER_HOST, LOBBY_SERVER_PORT, LOBBY_SERVER_PROTO} from "./constants";

class GameLobbyClient {
    constructor() {
        this.client = new LobbyClient({server: `${LOBBY_SERVER_PROTO}://${LOBBY_SERVER_HOST}:${LOBBY_SERVER_PORT}`});
    }

    async createGame(playersCount, timePerTurn) {
        const result = await this.client.createMatch(GAME_NAME, {
            numPlayers: parseInt(playersCount),
            setupData: {timePerTurn: parseInt(timePerTurn)},
        });
        return result.matchID
    }

    async joinGame(matchID, username, seat) {
        if (seat === undefined) {
            seat = 0
        }
        const result = await this.client.joinMatch(GAME_NAME, matchID, {
            playerID: seat.toString(),
            playerName: username
        })
        return result.playerCredentials
    }

    async listSeats(matchID) {
        const result = await this.client.getMatch(GAME_NAME, matchID)
        return result
    }
}

export default GameLobbyClient