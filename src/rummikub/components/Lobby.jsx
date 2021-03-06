import {useState} from "react";
import CreateGameForm from "./CreateGame";
import JoinGameForm from "./JoinGame";


export const GameLobby = function () {
    const [showCreateForm, setToggle] = useState(true)

    return (
        <div className='container'>
            <div className="justify-content-center row mt-1">
                <div>
                    <button onClick={() => setToggle(true)} className="btn btn-outline-primary mr-2">
                        Create game
                    </button>
                    <button onClick={() => setToggle(false)} className="btn btn-outline-success">
                        Join game
                    </button>
                    <div className="mt-2">
                        {showCreateForm ? <CreateGameForm/> : <JoinGameForm/>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameLobby