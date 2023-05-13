import React, { useRef, useState } from 'react'
import styles from './Chessboard.module.scss'
import Tile from '../Tile/Tile'
import makeid from '../../helpers/makeid'
import Referee from '../../referee/Referee'

export interface Piece {
  image: string;
  x: number;
  y: number;
  type: PieceType;
  team: Team;
}

export enum PieceType {
  PAWN,
  BISHOP,
  KNIGHT,
  ROOK,
  QUEEN,
  KING
}

export enum Team {
  OPPONENT,
  OUR
}

const initialBoardSetup: Piece[] = [];

for(let i=0; i<8; i++){
  initialBoardSetup.push({image: 'pieces/w-p.png', x: i, y: 1, type: PieceType.PAWN, team: Team.OUR})
  initialBoardSetup.push({image: 'pieces/b-p.png', x: i, y: 6, type: PieceType.PAWN, team: Team.OPPONENT})
}

initialBoardSetup.push({image: 'pieces/b-r.png', x: 0, y: 7, type: PieceType.ROOK, team: Team.OPPONENT})
initialBoardSetup.push({image: 'pieces/b-r.png', x: 7, y: 7, type: PieceType.ROOK, team: Team.OPPONENT})
initialBoardSetup.push({image: 'pieces/w-r.png', x: 0, y: 0, type: PieceType.ROOK, team: Team.OUR})
initialBoardSetup.push({image: 'pieces/w-r.png', x: 7, y: 0, type: PieceType.ROOK, team: Team.OUR})

initialBoardSetup.push({image: 'pieces/b-n.png', x: 1, y: 7, type: PieceType.KNIGHT, team: Team.OPPONENT})
initialBoardSetup.push({image: 'pieces/b-n.png', x: 6, y: 7, type: PieceType.KNIGHT, team: Team.OPPONENT})
initialBoardSetup.push({image: 'pieces/w-n.png', x: 1, y: 0, type: PieceType.KNIGHT, team: Team.OUR})
initialBoardSetup.push({image: 'pieces/w-n.png', x: 6, y: 0, type: PieceType.KNIGHT, team: Team.OUR})

initialBoardSetup.push({image: 'pieces/b-b.png', x: 2, y: 7, type: PieceType.BISHOP, team: Team.OPPONENT})
initialBoardSetup.push({image: 'pieces/b-b.png', x: 5, y: 7, type: PieceType.BISHOP, team: Team.OPPONENT})
initialBoardSetup.push({image: 'pieces/w-b.png', x: 2, y: 0, type: PieceType.BISHOP, team: Team.OUR})
initialBoardSetup.push({image: 'pieces/w-b.png', x: 5, y: 0, type: PieceType.BISHOP, team: Team.OUR})

initialBoardSetup.push({image: 'pieces/b-q.png', x: 3, y: 7, type: PieceType.QUEEN, team: Team.OPPONENT})
initialBoardSetup.push({image: 'pieces/b-k.png', x: 4, y: 7, type: PieceType.KING, team: Team.OPPONENT})
initialBoardSetup.push({image: 'pieces/w-q.png', x: 3, y: 0, type: PieceType.QUEEN, team: Team.OUR})
initialBoardSetup.push({image: 'pieces/w-k.png', x: 4, y: 0, type: PieceType.KING, team: Team.OUR})


const Chessboard = () => {
  const [pieces, setPieces] = useState<Piece[]>(initialBoardSetup);

  const chessboardRef = useRef<HTMLDivElement>(null);
  let initialPos = useRef<number[]>([]);

  const referee = new Referee();

  let board = [];

  const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  let activePiece: HTMLElement | null = null;
  
  const grabPiece = (e: React.MouseEvent) => {
    const element = e.target as HTMLElement;
    
    const chessboard = chessboardRef.current;
    if(element.classList.value.includes('piece') && !!chessboard){
      initialPos.current = [
        Math.floor((e.clientX - chessboard.offsetLeft) / 100), 
        Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100))
      ];
      const x = e.clientX - 50;
      const y = e.clientY - 50;
  
      element.style.position = 'absolute';
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      activePiece = element;
    }
  }  

  const movePiece = (e: React.MouseEvent) => {
    const chessboard = chessboardRef.current; 
    
    if(!!activePiece && !!chessboard){            
      const minX = chessboard.offsetLeft-20;
      const minY = chessboard.offsetTop-20;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth-80;
      const maxY = chessboard.offsetTop + chessboard.clientHeight-80;

      const x = e.clientX - 50;
      const y = e.clientY - 50;      
  
      activePiece.style.position = 'absolute';
      activePiece.style.left = x<minX ? `${minX}px` : x>maxX ? `${maxX}px` : `${x}px`;
      activePiece.style.top = y<minY ? `${minY}px` : y>maxY ? `${maxY}px` : `${y}px`;
    }
  }

  const dropPiece = (e: React.MouseEvent) => {
    const chessboard = chessboardRef.current;
    const [px, py] = initialPos.current
    
    if(!!activePiece && !!chessboard){
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
      const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));

      const currentPiece = pieces.find((p) => p.x === px && p.y === py);
      // const attackedPiece = pieces.find((p) => p.x === x && p.y === y);
      
      if(!!currentPiece){
        const isValidMove = referee.isValidMove(px, py, x, y, currentPiece.type, currentPiece.team, pieces);

        if(isValidMove){
          const updatedPieces = pieces.reduce((results, piece) => {
            if(piece.x === currentPiece.x && piece.y === currentPiece.y){
              piece.x = x;
              piece.y = y;
              results.push(piece);
            } else if(!(piece.x === x && piece.y === y)){
              results.push(piece);
            }
            return results;
          }, [] as Piece[])
  
            setPieces(updatedPieces);
            
        }else{
          console.log('reset');
          
          activePiece.style.position = 'relative';
          activePiece.style.removeProperty('top');
          activePiece.style.removeProperty('left');
        }
      }

      // setPieces(value => {
      //   const pieces = value.map((p) => {
      //     if(p.x===initialPos.current[0] && p.y===initialPos.current[1]){
      //       if(referee.isValidMove(px, py, x, y, p.type, p.team, value)){
      //         p.x=x;
      //         p.y=y;
      //       } else{
      //         if(!!activePiece){
      //           activePiece.style.position = 'relative';
      //           activePiece.style.removeProperty('top');
      //           activePiece.style.removeProperty('left');
      //         }
      //       }
      //     }
      //       return p;
      //     })
      //     return pieces;
      //   })
      activePiece = null;
    }
  }

  for(let i=verticalAxis.length-1; i>=0; i--){
    for(let j=0; j<horizontalAxis.length; j++){
      let number = (i+j)%2;
      let image = undefined;

      pieces.forEach(piece => {
        if(piece.x === j && piece.y === i){
          image = piece.image;
        }
      })
      board.push(<Tile key={makeid(7)} image={image} number={number} />);
    }
  }

  return (
    <div 
      onMouseDown={(e)=>grabPiece(e)}
      onMouseMove={(e)=>movePiece(e)}
      onMouseUp={(e)=>dropPiece(e)}
      className={styles.chessboardGrid}
      ref={chessboardRef}
    >
      {board}
    </div>
  )
}

export default Chessboard