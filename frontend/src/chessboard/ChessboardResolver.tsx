import React, { Component } from "react";

interface ChessboardResolverProps {
    game_url: string,
}

interface ChessboardResolverState {

}

class ChessboardResolver extends Component<ChessboardResolverProps, ChessboardResolverState> {
    private Chessboard;

    constructor(props) {
        super(props);

        // @ts-ignore
        if (SERVER) {
            this.Chessboard = null;
        } else {
            const Chessboard = require('./Chessboard').Chessboard;
            this.Chessboard = <Chessboard game_url={this.props.game_url} />
        }
    }

    render() {
        const {Chessboard} = this;

        return Chessboard;
    }
}

export { ChessboardResolver }