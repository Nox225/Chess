import { PieceType, Team, Piece } from "../components/Chessboard/Chessboard";

export default class Referee {
    tileIsOccupied(x: number, y: number, boardState: Piece[]){        
        return boardState.some((piece) => piece.x === x && piece.y === y);
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
        // console.log(px, py, x, y, type, team);

        if(type === PieceType.PAWN){
            const firstRow = (team === Team.OUR) ? 1 : 6;
            const direction = (team === Team.OUR) ? 1 : -1;

            if(px === x && y === firstRow && y-py === direction*2){
                if(!this.tileIsOccupied(x, y, boardState) && 
                !this.tileIsOccupied(x, y-direction, boardState)){
                 return true;
             }
            }else{
                if(px === x && (y-py) === direction){
                    if(!this.tileIsOccupied(x, y, boardState)){
                        return true;
                    }
                }  
            }
        }
    }
}