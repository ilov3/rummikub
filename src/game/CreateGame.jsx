import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import GameLobbyClient from "./lobbyClient";
import {useState} from "react";
import {useHistory} from "react-router-dom"

const CreateGameForm = function () {
    const client = new GameLobbyClient()
    const history = useHistory()
    const [username, setUsername] = useState('')
    const [numPlayers, setNumPlayers] = useState('4')
    const [matchID, setMatchID] = useState('')
    const [timePerTurn, setTimePerTurn] = useState('30')

    function onGameCreate() {
        client.createGame(numPlayers, timePerTurn).then(
            (id) => {
                console.log(id)
                setMatchID(id)
                client.joinGame(id, username).then((playerCreds) => {
                    history.push(`/match/${id}`, {
                        username: username,
                        numPlayers: numPlayers,
                        creds: playerCreds,
                        playerID: '0',
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
                    <option>20</option>
                    <option>30</option>
                    <option>40</option>
                    <option>50</option>
                    <option>60</option>
                </Form.Control>
            </Form.Group>
            <Button onClick={onGameCreate} disabled={!username || !numPlayers} variant="primary">
                Create
            </Button>
            <div className="mt-1 text-success">{matchID ? `Match ID: ${matchID} created` : ''}</div>
        </Form>
    )
}

export default CreateGameForm