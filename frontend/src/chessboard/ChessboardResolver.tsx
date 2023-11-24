import React, { Component } from "react";
import {Chessboard} from "./Chessboard";
import {isClient} from "../utils/version";

interface ChessboardResolverProps {

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
            this.Chessboard = <Chessboard />
        }
    }

    render() {
        const {Chessboard} = this;

        return Chessboard;
    }
}

export { ChessboardResolver }