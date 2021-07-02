import React from 'react'
import {Navbar} from "react-bootstrap";

const GameNavbar = () => {
    return (
        <Navbar className='game-navbar' bg="light" expand="lg">
            <Navbar.Brand href="/">Rummikub</Navbar.Brand>
        </Navbar>
    )
}

export default GameNavbar