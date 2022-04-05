import React  from "react";

export default class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item
        }
    }
    render() {
        return(
            <div className="messages">
                <span>Address: {this.state.item.from} </span>
                <span>Message: {this.state.item.message} </span>
                <span>Time: {this.state.item.timestamp.toNumber()}</span>
            </div>
        )
    }
}