import React from "react";

class TurnTimer extends React.Component {
    constructor(props) {
        super(props);
        let expireKey = `${this.props.matchID}:expire`
        let timerExpireAt = localStorage.getItem(expireKey)
        if (timerExpireAt) {
            let secondsLeft = Math.round((parseInt(timerExpireAt) - Date.now()) / 1000)
            secondsLeft = secondsLeft > 1 ? secondsLeft : 1
            this.state = {secondsLeft: secondsLeft}
        } else {
            localStorage.setItem(expireKey, props.secondsLeft * 1000 + Date.now())
            this.state = {secondsLeft: props.secondsLeft};
        }
        this.timerId = null
    }

    componentDidMount() {
        this.timerId = setInterval((function () {
            this.setState((function (prevState) {
                let secondsLeft = prevState.secondsLeft - 1
                if (secondsLeft <= 0) {
                    this.props.onTimeout()
                }
                return {secondsLeft: secondsLeft}
            }).bind(this))
        }).bind(this), 1000)
    }

    componentWillUnmount() {
        this.timerId && clearInterval(this.timerId)
    }

    render() {
        return (
            <div className="ml-2">
                <p className={this.state.secondsLeft < 10 ? 'text-danger' : '' }
                    style={
                    {fontSize: 66}
                }>{this.state.secondsLeft}</p>
            </div>
        )
    }
}

export default TurnTimer