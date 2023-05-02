import React from 'react'
import styles from './Chessboard.module.scss'
import Tile from '../Tile/Tile'
import makeid from '../../helpers/makeid'
import initialBoardSetup from '../../helpers/initialBoardSetup'

interface Piece {
  image: string;
  x: number;
  y: number;
}

const Chessboard = () => {
  const axisX = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const axisY = ['8', '7', '6', '5', '4', '3', '2', '1'];

  let board = [];

  const pieces: Piece[] = [];
  initialBoardSetup(pieces);

  let activePiece: HTMLElement | null = null;

  const grabPiece = (e: React.MouseEvent) => {
    const element = e.target as HTMLElement;

    if(element.classList.value.includes('piece')){
      // console.log('piece');
      const x = e.clientX - 50;
      const y = e.clientY - 50;
  
      element.style.position = 'absolute';
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      activePiece = element;
    }
  }

  const movePiece = (e: React.MouseEvent) => {    
    if(!!activePiece){      
      const x = e.clientX - 50;
      const y = e.clientY - 50;
  
      activePiece.style.position = 'absolute';
      activePiece.style.left = `${x}px`;
      activePiece.style.top = `${y}px`;
    }
  }

  const dropPiece = (e: React.MouseEvent) => {
    if(!!activePiece){
      activePiece = null;
    }
  }

  for(let i=0; i<axisY.length; i++){
    for(let j=0; j<axisX.length; j++){
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
    >
      {board}
    </div>
  )
}

export default Chessboard