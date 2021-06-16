import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useState, useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import GameLobbyClient from "./lobbyClient";

const JoinGamePage = function () {
    let {matchID} = useParams();
    const client = new GameLobbyClient()
    const history = useHistory()
    const [username, setUsername] = useState('')
    const [seats, setSeats] = useState([])

    useEffect(function () {
        client.listSeats(matchID).then((matchData) => {
            console.log(matchData.players)
            setSeats(matchData.players)
        }, (value) => {
            setSeats([])
        })
    }, [matchID])

    function onJoinMatch() {
        client.listSeats(matchID).then(matchData => {
            let seat = 0
            console.log(matchData)
            for (let playerSeat of matchData.players) {
                if (!playerSeat.name) {
                    seat = playerSeat.id
                    break
                }
            }
            client.joinGame(matchID, username, seat).then((playerCreds) => {
                history.push(`/match/${matchID}`, {
                    username: username,
                    numPlayers: matchData.players.length,
                    creds: playerCreds,
                    playerID: seat,
                })
            })
        }, error => {
            console.log(error)
        })
    }

    return (
        <div className='container'>
            <div className="justify-content-center row mt-lg-5 mt-sm-5">
                <div className="col-lg-4 col-md-4 col-sm-8">
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
                        <Button
                            onClick={onJoinMatch}
                            variant="success"
                            disabled={!username || seats.every(seat => seat.name)}>
                            Join
                        </Button>
                        <div className="mt-2">
                            {seats.length ? seats.map((seat) => {
                                return <div key={seat.id} className="text-info">
                                    {seat.name ? `Player ${seat.name} has joined` : `${seat.id + 1} player place vacant`}
                                </div>
                            }) : <span className="text-warning">Match not found</span>}
                        </div>
                        {seats.every(seat => seat.name) ? <div className="text-danger">No slots left</div> : ''}
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default JoinGamePage