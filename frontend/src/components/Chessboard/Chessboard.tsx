import React from 'react'
import styles from './Chessboard.module.scss'

const Chessboard = () => {
  const axisX = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] 
  const axisY = ['8', '7', '6', '5', '4', '3', '2', '1'] 

  let board = []

  for(let i=0; i<axisY.length; i++){
    for(let j=0; j<axisX.length; j++){
      board.push(<span className={`${styles.tile} ${(i+j)%2 === 0 ? styles.light : styles.dark}`}>{axisX[j]}{axisY[i]}</span>)
    }
  }
  return (
    <div className={styles.chessboardGrid}>{board}</div>
  )
}

export default Chessboard