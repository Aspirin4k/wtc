import React, { Component, ReactNode } from "react";
import { ChessboardResolver } from "./ChessboardResolver";
import { Link } from "react-router-dom";
import { getStaticURL } from "../utils/static";

export type GameListProps = {
    selected_game_url?: string
}

export class GameList extends Component<GameListProps> {
    private readonly GAME_LIST = [
        {
            "url": "/chessboard/classic/metadata/game.json",
            "thumbnail": "/chessboard/classic/metadata/thumbnail.jpg",
            "title": "Umineko Classic",
        }
    ];

    render(): ReactNode {
        const {selected_game_url} = this.props;

        if (selected_game_url) {
            return <ChessboardResolver game_url={selected_game_url} />
        }

        return this.GAME_LIST.map((game) => {
            return <div key={game.url} className="game-panel">
                <Link 
                    key={game.url}
                    to={{pathname: '/chessboard', state: {selected_game_url: game.url}}}
                >
                    <div className="game-panel-thumbnail">
                        <div className="game-panel-image__container">
                            <img 
                                className="game-panel-image" 
                                src={getStaticURL(game.thumbnail)}
                                style={{
                                    maskImage: `url(${getStaticURL('/chessboard/block/Crystal1.png')})`
                                }}
                            />
                        </div>
                        <img 
                            className="game-panel-crystal" 
                            src={getStaticURL('/chessboard/block/Crystal1.png')} 
                            style={{
                                maskImage: 'radial-gradient(circle at center 55%, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, 1) 55%)'
                            }}
                        />
                    </div>
                </Link>
                <div className="game-panel-title">
                    {game.title}
                </div>
            </div>
            
            // <Link 
                
            //     key={game.url}
            //     to={{pathname: '/chessboard', state: {selected_game_url: game.url}}}
            // >
                
            // </Link>
        });
    }
};
