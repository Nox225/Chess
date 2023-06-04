import { PieceType, Team, Piece } from "../components/Chessboard/Chessboard";

export default class Referee {
    tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean{        
        return boardState.some((piece) => piece.x === x && piece.y === y);
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

    calculateAllMoves(pieces: Piece[]){        
        for(const piece of pieces){
            piece.possibleMoves = this.getValidMoves(piece, pieces);
        }
        this.checkKingMoves(pieces);
    }

    checkKingMoves(pieces: Piece[]){
        let kingPossibleMoves: {x: number, y: number}[] = [];
        const king = pieces.find((p => p.type === PieceType.KING && p.team === Team.OPPONENT));        
        if(king?.possibleMoves === undefined) return;

        const initialKingPos = {x: king.x, y: king.y}        

        for(const move of king.possibleMoves){
            let simulatedBoard = pieces;


            const pieceAtTarget = simulatedBoard.find(p => p.x === move.x && p.y === move.y)
            if(!!pieceAtTarget){
                simulatedBoard = simulatedBoard.filter(p => p.x !== move.x && p.y !== move.y)
            }

            // king.x = move.x;
            // king.y = move.y;
            const simulatedKing = simulatedBoard.find(p => p.type === PieceType.KING && p.team === Team.OPPONENT)
            if(!!simulatedKing){
                simulatedKing!.x = move.x
                simulatedKing!.y = move.y
            }

            for(const enemy of simulatedBoard.filter(p => p.team === Team.OUR)){
                enemy.possibleMoves = this.getValidMoves(enemy, simulatedBoard);
            }

            let safe = true;

            for(const p of simulatedBoard){
                if(p.team === Team.OPPONENT) continue;
                if(p.type === PieceType.PAWN){
                    const possiblePawnMoves = this.getValidMoves(p, simulatedBoard);
                    if(possiblePawnMoves?.some((pos: any) => pos.x !== p.x && pos.x === move.x && pos.y === move.y)){                    
                        safe = false;
                        break;
                    }
                }
                // console.log(p.type, p.possibleMoves);
                else if(p.possibleMoves?.some((pos: any) => pos.x === move.x && pos.y === move.y)){                    
                    safe = false;
                    break;
                }
            }
            if(!safe){    
                // console.log('not safe');         
                // console.log(king.possibleMoves, 'before');
                // console.log(move);

                king.possibleMoves = king.possibleMoves.filter((m) => (m.x !== move.x || m.y !== move.y))
                kingPossibleMoves = king.possibleMoves.filter((m) => (m.x !== move.x || m.y !== move.y))
                // console.log(king.possibleMoves, 'after');                
            }            
        }

        king.x = initialKingPos.x;
        king.y = initialKingPos.y;
        // console.log(king.possibleMoves);
        return kingPossibleMoves
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
                let multiplierX = x < px ? -1 : 1;
                let multiplierY = y < py ? -1 : 1;
                let passedPosition = {x: px+(i * multiplierX), y: py+(i*multiplierY)}
                if(passedPosition.x === x && passedPosition.y === y){
                    if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                        return true;
                    }
                } else if(this.tileIsOccupied(passedPosition.x, passedPosition.y, boardState)){                            
                    break;
                }
            }
        }

        else if(type === PieceType.ROOK){
            for(let i=1; i<8; i++){
                let multiplierX = x < px ? -1 : x > px ? 1 : 0;
                let multiplierY = y < py ? -1 : y > py ? 1 : 0;
                let passedPosition = {x: px+(i*multiplierX), y: py+(i*multiplierY)}
                if(passedPosition.x === x && passedPosition.y === y){
                    if(this.tileIsEmptyOrOccupiedByOpponent(x, y, boardState, team)){
                        return true;
                    }
                }else if(this.tileIsOccupied(passedPosition.x, passedPosition.y, boardState)){
                    break;
                } 
            }
        }

        else if(type === PieceType.QUEEN){
            for(let i=1; i<8; i++){
                let multiplierX = x < px ? -1 : x > px ? 1 : 0;
                let multiplierY = y < py ? -1 : y > py ? 1 : 0;
                let passedPosition = {x: px+(i*multiplierX), y: py+(i*multiplierY)}
                if(passedPosition.x === x && passedPosition.y === y){
                    if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition.x, passedPosition.y, boardState, team)){
                        return true;
                    }
                } else if(this.tileIsOccupied(passedPosition.x, passedPosition.y, boardState)){                            
                    break;
                }
            }
        }

        else if(type === PieceType.KING){            
            if(Math.abs(x-px) <= 1 && Math.abs(y-py) <= 1 && !this.tileIsOccupiedByPlayer(x, y, boardState, team)){
                return true;
            }
        }
    }

    getValidMoves(piece: Piece, boardState: Piece[]){
        const { x, y, type, team } = piece;
        const possibleMoves: {x: number, y: number}[] = [];

        if(type === PieceType.PAWN){
            const direction = (team === Team.OUR) ? 1 : -1;
            const firstRow = (team === Team.OUR) ? 1 : 6;
            if(!this.tileIsOccupied(x, y+direction, boardState)){
                possibleMoves.push({x: x, y: y+direction});
                if(y === firstRow && !this.tileIsOccupied(x, y+2*direction, boardState)){
                    possibleMoves.push({x: x, y: y+(2*direction)});
                }
            }
            if(this.tileIsOccupiedByOpponent(x-1, y+direction, boardState, team)){
                possibleMoves.push({x: x-1, y: y+direction});
            }else if(!this.tileIsOccupied(x-1, y+direction, boardState)){
                const enPassantPawn = boardState.find((p) => p.x === x-1 && p.y === y);
                if(!!enPassantPawn?.enPassant){
                    possibleMoves.push({x: x-1, y: y+direction})
                } 
            }
            if(this.tileIsOccupiedByOpponent(x+1, y+direction, boardState, team)){
                possibleMoves.push({x: x+1, y: y+direction});
            }else if(!this.tileIsOccupied(x+1, y+direction, boardState)){
                const enPassantPawn = boardState.find((p) => p.x === x+1 && p.y === y);
                if(!!enPassantPawn?.enPassant){
                    possibleMoves.push({x: x+1, y: y+direction})
                } 
            }
        }

        if(type === PieceType.KNIGHT){
            for(let i=-1; i<2; i+=2){
                for(let j=-1; j<2; j+=2){
                    if(this.tileIsEmptyOrOccupiedByOpponent(x+i, y+2*j, boardState, team)){
                        possibleMoves.push({x: x+i, y: y+2*j})
                    }
                    if(this.tileIsEmptyOrOccupiedByOpponent(x+2*i, y+j, boardState, team)){
                        possibleMoves.push({x: x+2*i, y: y+j})
                    }
                }
            }
        }

        if(type === PieceType.BISHOP){
            for(let i = 1; i < 8; i++){
                const destination = {x: x+i, y: y+i};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
            for(let i = 1; i < 8; i++){
                const destination = {x: x-i, y: y+i};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
            for(let i = 1; i < 8; i++){
                const destination = {x: x+i, y: y-i};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
            for(let i = 1; i < 8; i++){
                const destination = {x: x-i, y: y-i};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
        }

        if(type === PieceType.ROOK){
            for(let i = 1; i < 8; i++){
                const destination = {x: x, y: y+i};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
            for(let i = 1; i < 8; i++){
                const destination = {x: x, y: y-i};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
            for(let i = 1; i < 8; i++){
                const destination = {x: x+i, y: y};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
            for(let i = 1; i < 8; i++){
                const destination = {x: x-i, y: y};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
        }

        if(type === PieceType.QUEEN){
            for(let i = 1; i < 8; i++){
                const destination = {x: x+i, y: y+i};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
            for(let i = 1; i < 8; i++){
                const destination = {x: x-i, y: y+i};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
            for(let i = 1; i < 8; i++){
                const destination = {x: x+i, y: y-i};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
            for(let i = 1; i < 8; i++){
                const destination = {x: x-i, y: y-i};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }

            for(let i = 1; i < 8; i++){
                const destination = {x: x, y: y+i};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
            for(let i = 1; i < 8; i++){
                const destination = {x: x, y: y-i};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
            for(let i = 1; i < 8; i++){
                const destination = {x: x+i, y: y};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
            for(let i = 1; i < 8; i++){
                const destination = {x: x-i, y: y};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
        }

        if(type === PieceType.KING){
            for(let i = 1; i < 2; i++){
                const destination = {x: x+i, y: y+i};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
            for(let i = 1; i < 2; i++){
                const destination = {x: x-i, y: y+i};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
            for(let i = 1; i < 2; i++){
                const destination = {x: x+i, y: y-i};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
            for(let i = 1; i < 2; i++){
                const destination = {x: x-i, y: y-i};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }

            for(let i = 1; i < 2; i++){
                const destination = {x: x, y: y+i};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
            for(let i = 1; i < 2; i++){
                const destination = {x: x, y: y-i};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
            for(let i = 1; i < 2; i++){
                const destination = {x: x+i, y: y};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
            for(let i = 1; i < 2; i++){
                const destination = {x: x-i, y: y};

                if(!this.tileIsOccupied(destination.x, destination.y, boardState)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                }else if(this.tileIsOccupiedByOpponent(destination.x, destination.y, boardState, team)){
                    possibleMoves.push({x: destination.x, y: destination.y});
                    break;
                }else{
                    break;
                }
            }
        }

        return possibleMoves.filter((move) => move.x >=0 && move.x <= 7 && move.y >= 0 && move.y <= 7);
    }
}