import React, { Component } from "react";
import {Chessboard} from "./Chessboard";
import {isClient} from "../utils/version";

interface ChessboardResolverProps {

}

interface ChessboardResolverState {

}

class ChessboardResolver extends Component<ChessboardResolverProps, ChessboardResolverState> {
    render() {
        if (isClient()) {
            return <Chessboard />
        } else {
            return null;
        }
    }
}

export { ChessboardResolver }