import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import GameLobbyClient from "../lobbyClient";
import {IS_DEV} from "../constants";

const JoinGameForm = function () {
    const client = new GameLobbyClient()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [matchID, setMatchID] = useState('')
    const [seats, setSeats] = useState([])

    function onMatchIDChange(matchID) {
        setMatchID(matchID)
        client.listSeats(matchID).then((matchData) => {
            console.debug(matchData.players)
            setSeats(matchData.players)
        }, (value) => {
            setSeats([])
        })
    }

    function onJoinMatch(event) {
        event.preventDefault();
        client.listSeats(matchID).then(matchData => {
            let seat = 0
            console.debug(matchData)
            for (let playerSeat of matchData.players) {
                if (!playerSeat.name) {
                    seat = playerSeat.id
                    break
                }
            }
            client.joinGame(matchID, username, seat).then((playerCreds) => {
                navigate(`/match/${matchID}`, {
                    state: {
                        username: username,
                        numPlayers: matchData.players.length,
                        creds: playerCreds,
                        playerID: seat,
                    },
                })
            })
        }, error => {
            console.debug(error)
        })
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
                    placeholder="Enter username"
                />
            </Form.Group>
            <Form.Group controlId="formMatchID">
                <Form.Label>Match ID</Form.Label>
                <Form.Control
                    value={matchID}
                    onChange={(e) => {
                        onMatchIDChange(e.target.value)
                    }}
                    type="text"
                    placeholder="Enter match ID"
                />
            </Form.Group>

            <Button
                onClick={onJoinMatch}
                variant="success"
                type={"submit"}
                disabled={!username || !matchID || (seats.length && seats.every(seat => seat.name))}>
                Join
            </Button>
            <div className="mt-2">
                {seats.length ? seats.map((seat) => {
                    return <div key={seat.id} className="text-info">
                        {seat.name ? `Player ${seat.name} has joined` : `${seat.id + 1} player place vacant`}
                    </div>
                }) : <span className="text-warning">Match not found</span>}
            </div>
            {(seats.length && seats.every(seat => seat.name)) ? <div className="text-danger">No slots left</div> : ''}
        </Form>
    )
}

export default JoinGameForm