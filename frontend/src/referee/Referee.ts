import { PieceType, Team, Piece } from "../components/Chessboard/Chessboard";

export default class Referee {
    tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean{        
        return boardState.some((piece) => piece.x === x && piece.y === y);
        // return !!boardState.find((p) => p.x === x && p.y === y);
    }

    tileIsOccupiedByOpponent(x: number, y: number, boardState: Piece[], team: Team): boolean{
        return !!boardState.find((piece) => piece.x === x && piece.y === y && piece.team !== team);
    }
    
    tileIsOccupiedByPlayer(x: number, y: number, boardState: Piece[], team: Team): boolean{
        return !!boardState.find((piece) => piece.x === x && piece.y === y && piece.team === team);
    }

    tileIsEmptyOrOccupiedByOpponent(x: number, y: number, boardState: Piece[], team: Team): boolean{
        return !this.tileIsOccupied(x, y, boardState) || this.tileIsOccupiedByOpponent(x, y, boardState, team);
    }

    isEnPassantMove(
        px: number, 
        py: number, 
        x: number, 
        y: number, 
        type: PieceType, 
        team: Team,
        boardState: Piece[]
    ): boolean{
        const direction = (team === Team.OUR) ? 1 : -1;

        if(type === PieceType.PAWN){
            if((x - px === -1 || x - px === 1) && y - py === direction){
                const piece = boardState.find((p) => 
                    p.x === x && p.y === y - direction && !!p.enPassant
                );
                if(!!piece){
                    return true;
                }
            }
        }
        return false;
    }

    isValidMove(
        px: number, 
        py: number, 
        x: number, 
        y: number, 
        type: PieceType, 
        team: Team,
        boardState: Piece[]
    ){
        if(type === PieceType.PAWN){
            const firstRow = (team === Team.OUR) ? 1 : 6;
            const direction = (team === Team.OUR) ? 1 : -1;

            if(px === x && py === firstRow && y-py === direction*2){
                if(!this.tileIsOccupied(x, y, boardState) && 
                !this.tileIsOccupied(x, y-direction, boardState)){
                 return true;
             }
            }else if(px === x && (y-py) === direction){
                    return !this.tileIsOccupied(x, y, boardState)
                }  
            else if(x - px === -1 && y - py === direction){
                return this.tileIsOccupiedByOpponent(x, y, boardState, team);
            }else if(x - px === 1 && y - py === direction){
                return this.tileIsOccupiedByOpponent(x, y, boardState, team);
            }
        }

        else if(type === PieceType.KNIGHT){
            for(let i=-1; i<2; i+=2){
                for(let j=-1; j<2; j+=2){
                    if(y - py === 2*i){
                        if(x - px === j){
                            if(this.tileIsEmptyOrOccupiedByOpponent(x, y, boardState, team)){
                                return true;
                            }
                        }
                    }
                    if(x - px === 2*i){
                        if(y - py === -j){
                            if(this.tileIsEmptyOrOccupiedByOpponent(x, y, boardState, team)){
                                return true;
                            }
                        }
                    }
                }
            }
        }

        else if(type === PieceType.BISHOP){            
            for(let i = 1; i < 8; i++){
                if(x > px && y > py){
                    let passedPosition = {x: px+i, y: py+i}
                    if(passedPosition.x === x && passedPosition.y === y){
                        if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                                return true;
                        }
                    } else{
                        if(this.tileIsOccupied(passedPosition.x, passedPosition.y, boardState)){                            
                            break;
                        }
                    }
                }
                if(x > px && y < py){
                    let passedPosition = {x: px+i, y: py-i}
                    if(passedPosition.x === x && passedPosition.y === y){
                        if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                                return true;
                        }
                    } else{
                        if(this.tileIsOccupied(passedPosition.x, passedPosition.y, boardState)){                            
                            break;
                        }
                    }
                }
                if(x < px && y < py){
                    let passedPosition = {x: px-i, y: py-i}
                    if(passedPosition.x === x && passedPosition.y === y){
                        if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                            return true;
                        }
                    } else{
                        if(this.tileIsOccupied(passedPosition.x, passedPosition.y, boardState)){                            
                            break;
                        }
                    }
                }
                if(x < px && y > py){
                    let passedPosition = {x: px-i, y: py+i}
                    if(passedPosition.x === x && passedPosition.y === y){
                        if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                                return true;
                        }
                    } else{
                        if(this.tileIsOccupied(passedPosition.x, passedPosition.y, boardState)){                            
                            break;
                        }
                    }
                }
            }
        }

        else if(type === PieceType.ROOK){
            if(x === px && y !== py){
                for(let i=1; i<8; i++){
                    if(y < py){
                        let passedPosition = {x: px, y: py-i}
                        if(passedPosition.x === x && passedPosition.y === y){
                            if(this.tileIsEmptyOrOccupiedByOpponent(x, y, boardState, team)){
                                return true;
                            }
                        }else{
                            if(this.tileIsOccupied(passedPosition.x, passedPosition.y, boardState)){
                                break;
                            } 
                        }
                    }
                    else if(y > py){
                        let passedPosition = {x: px, y: py+i}
                        if(passedPosition.x === x && passedPosition.y === y){
                            if(this.tileIsEmptyOrOccupiedByOpponent(x, y, boardState, team)){
                                return true;
                            }
                        }else if(this.tileIsOccupied(passedPosition.x, passedPosition.y, boardState)){
                            break;
                        }                         
                    }
                }
            }
            else if(x !== px && y === py){
                for(let i=1; i<8; i++){
                    if(x < px){
                        let passedPosition = {x: px-i, y: py}
                        if(passedPosition.x === x && passedPosition.y === y){
                            if(this.tileIsEmptyOrOccupiedByOpponent(x, y, boardState, team)){
                                return true;
                            }
                        }else if(this.tileIsOccupied(passedPosition.x, passedPosition.y, boardState)){
                            break;
                        }                              
                    }
                    else if(x > px){
                        let passedPosition = {x: px+i, y: py}
                        if(passedPosition.x === x && passedPosition.y === y){
                            if(this.tileIsEmptyOrOccupiedByOpponent(x, y, boardState, team)){
                                return true;
                            }
                        }else if(this.tileIsOccupied(passedPosition.x, passedPosition.y, boardState)){
                            break;
                        }                          
                    }
                }            
            }
        }
    }
}