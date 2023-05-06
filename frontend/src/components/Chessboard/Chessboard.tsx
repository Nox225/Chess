import React, { useRef, useState } from 'react'
import styles from './Chessboard.module.scss'
import Tile from '../Tile/Tile'
import makeid from '../../helpers/makeid'
// import initialBoardSetup from '../../helpers/initialBoardSetup'

interface Piece {
  image: string;
  x: number;
  y: number;
}

const initialBoardSetup: Piece[] = [];

for(let i=0; i<8; i++){
  initialBoardSetup.push({image: 'pieces/w-p.png', x: i, y: 1})
  initialBoardSetup.push({image: 'pieces/b-p.png', x: i, y: 6})
}

initialBoardSetup.push({image: 'pieces/b-r.png', x: 0, y: 7})
initialBoardSetup.push({image: 'pieces/b-r.png', x: 7, y: 7})
initialBoardSetup.push({image: 'pieces/w-r.png', x: 0, y: 0})
initialBoardSetup.push({image: 'pieces/w-r.png', x: 7, y: 0})

initialBoardSetup.push({image: 'pieces/b-n.png', x: 1, y: 7})
initialBoardSetup.push({image: 'pieces/b-n.png', x: 6, y: 7})
initialBoardSetup.push({image: 'pieces/w-n.png', x: 1, y: 0})
initialBoardSetup.push({image: 'pieces/w-n.png', x: 6, y: 0})

initialBoardSetup.push({image: 'pieces/b-b.png', x: 2, y: 7})
initialBoardSetup.push({image: 'pieces/b-b.png', x: 5, y: 7})
initialBoardSetup.push({image: 'pieces/w-b.png', x: 2, y: 0})
initialBoardSetup.push({image: 'pieces/w-b.png', x: 5, y: 0})

initialBoardSetup.push({image: 'pieces/b-q.png', x: 3, y: 7})
initialBoardSetup.push({image: 'pieces/b-k.png', x: 4, y: 7})
initialBoardSetup.push({image: 'pieces/w-q.png', x: 3, y: 0})
initialBoardSetup.push({image: 'pieces/w-k.png', x: 4, y: 0})


const Chessboard = () => {
  const [pieces, setPieces] = useState<Piece[]>(initialBoardSetup);
  // const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  // const [pieceX, setPieceX] = useState<number>(0);
  // const [pieceY, setPieceY] = useState<number>(0);

  const chessboardRef = useRef<HTMLDivElement>(null);
  let initialPos = useRef<number[]>([]);

  let board = [];

  const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  let activePiece: HTMLElement | null = null;
  
  const grabPiece = (e: React.MouseEvent) => {
    const element = e.target as HTMLElement;
    
    const chessboard = chessboardRef.current;
    if(element.classList.value.includes('piece') && !!chessboard){
      // setPieceX(Math.floor((e.clientX - chessboard.offsetLeft) / 100))
      // setPieceY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100)));
      initialPos.current = [Math.floor((e.clientX - chessboard.offsetLeft) / 100), Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100))];
      const x = e.clientX - 50;
      const y = e.clientY - 50;
  
      element.style.position = 'absolute';
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      // setActivePiece(element);
      activePiece = element;
    }
  }  

  const movePiece = (e: React.MouseEvent) => {
    const chessboard = chessboardRef.current; 
    
    if(!!activePiece && !!chessboard){ 
      console.log(activePiece);
           
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
    
    if(!!activePiece && !!chessboard){
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
      const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));

      setPieces(value => {
        const pieces = value.map((p) => {
          if(p.x===initialPos.current[0] && p.y===initialPos.current[1]){
            p.x=x;
            p.y=y;
          }
          return p;
        })
        return pieces;
      })

      // setActivePiece(null);
      // activePiece = null;
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