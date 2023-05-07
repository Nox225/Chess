import { PieceType, Team } from "../components/Chessboard/Chessboard";

export default class Referee {
    isValidMove(px: number, py: number, x: number, y: number, type: PieceType, team: Team){
        console.log(px, py, x, y, type, team);
        
        if(type === PieceType.PAWN){
            if(team === Team.OUR){
                if(py === 1){
                    if(px === x && ((y-py) === 2 || (y-py) === 1)){
                        return true;
                    }
                }else{
                    if(px === x && (y-py) === 1){
                        return true;
                    }
                }
            }
        }
        return false;
    }
}