import React, { Component } from "react";
import {Chessboard} from "./Chessboard";

interface ChessboardResolverProps {

}

interface ChessboardResolverState {

}

class ChessboardResolver extends Component<ChessboardResolverProps, ChessboardResolverState> {
    render() {
        if (typeof window !== "undefined") {
            return <Chessboard />
        } else {
            return null;
        }
    }
}

export { ChessboardResolver }