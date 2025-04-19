import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import GameLobbyClient from "../lobbyClient";
import {useState} from "react";
import {useNavigate} from "react-router-dom"
import {FRONTEND_PORT, IS_DEV, LOBBY_SERVER_HOST, LOBBY_SERVER_PROTO} from "../constants";
import {copyToClipboard} from "../util";

const CreateGameForm = function () {
    const client = new GameLobbyClient()
    const navigate = useNavigate()
    const [username, setUsername] = useState(IS_DEV ? 'test' : '')
    const [numPlayers, setNumPlayers] = useState(IS_DEV ? '2' : '4')
    const [matchID, setMatchID] = useState('')
    const [timePerTurn, setTimePerTurn] = useState(IS_DEV ? '10' : '30')

    function onGameCreate(event) {
        event.preventDefault();
        client.createGame(numPlayers, timePerTurn).then(
            (id) => {
                let hostAddr = `${LOBBY_SERVER_HOST}:${FRONTEND_PORT}`
                let matchLink = `${LOBBY_SERVER_PROTO}://${hostAddr}/join-match/${id}`
                copyToClipboard(matchLink)
                console.debug(id)
                setMatchID(id)
                client.joinGame(id, username).then((playerCreds) => {
                    navigate(`/match/${id}`, {
                        state: {
                            username: username,
                            numPlayers: numPlayers,
                            creds: playerCreds,
                            playerID: '0',
                        }
                    })
                })
            }
        )
    }

    return (
        <Form>
            <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }}
                    type="text"
                    placeholder="Enter username"/>
            </Form.Group>

            <Form.Group controlId="formNumPlayers">
                <Form.Label>Number of players</Form.Label>
                <Form.Control
                    value={numPlayers}
                    onChange={(e) => {
                        setNumPlayers(e.target.value)
                    }}
                    as="select">
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="timePerTurn">
                <Form.Label>Time per turn, in seconds</Form.Label>
                <Form.Control
                    value={timePerTurn}
                    onChange={(e) => {
                        setTimePerTurn(e.target.value)
                    }}
                    as="select">
                    <option>10</option>
                    <option>20</option>
                    <option>30</option>
                    <option>40</option>
                    <option>50</option>
                    <option>60</option>
                </Form.Control>
            </Form.Group>
            <Button onClick={onGameCreate}
                    disabled={!username || !numPlayers}
                    type={"submit"}
                    variant="primary">
                Create
            </Button>
            <div className="mt-1 text-success">{matchID ? `Match ID: ${matchID} created` : ''}</div>
        </Form>
    )
}

export default CreateGameForm