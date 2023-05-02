import React from 'react'
import styles from './Chessboard.module.scss'
import Tile from '../Tile/Tile'
import makeid from '../../helpers/makeid'

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

  for(let i=0; i<axisX.length; i++){
    pieces.push({image: 'pieces/w-p.png', x: i, y: 6})
    pieces.push({image: 'pieces/b-p.png', x: i, y: 1})
  }

  pieces.push({image: 'pieces/b-r.png', x: 0, y: 0})
  pieces.push({image: 'pieces/b-r.png', x: 7, y: 0})
  pieces.push({image: 'pieces/w-r.png', x: 0, y: 7})
  pieces.push({image: 'pieces/w-r.png', x: 7, y: 7})
  
  pieces.push({image: 'pieces/b-n.png', x: 1, y: 0})
  pieces.push({image: 'pieces/b-n.png', x: 6, y: 0})
  pieces.push({image: 'pieces/w-n.png', x: 1, y: 7})
  pieces.push({image: 'pieces/w-n.png', x: 6, y: 7})

  pieces.push({image: 'pieces/b-b.png', x: 2, y: 0})
  pieces.push({image: 'pieces/b-b.png', x: 5, y: 0})
  pieces.push({image: 'pieces/w-b.png', x: 2, y: 7})
  pieces.push({image: 'pieces/w-b.png', x: 5, y: 7})

  pieces.push({image: 'pieces/b-q.png', x: 3, y: 0})
  pieces.push({image: 'pieces/b-k.png', x: 4, y: 0})
  pieces.push({image: 'pieces/w-q.png', x: 3, y: 7})
  pieces.push({image: 'pieces/w-k.png', x: 4, y: 7})
  


  for(let i=0; i<axisY.length; i++){
    for(let j=0; j<axisX.length; j++){
      let number = (i+j)%2;
      let image = undefined;

      pieces.forEach(piece => {
        if(piece.x === j && piece.y === i){
          image = piece.image;
        }
      })
      // board.push(<span className={`${styles.tile} ${(i+j)%2 === 0 ? styles.light : styles.dark}`}>{axisX[j]}{axisY[i]}</span>)
      board.push(<Tile key={makeid(7)} image={image} number={number} />);
    }
  }
  return (
    // <div className={styles.chessboardGrid}>{board}</div>
    <div className={styles.chessboardGrid}>{board}</div>
  )
}

export default Chessboard