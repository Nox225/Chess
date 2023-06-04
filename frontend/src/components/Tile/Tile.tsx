import React from 'react'
import styles from './Tile.module.scss'

export interface TileProps {
    image?: string;
    number: number;
    highlight: boolean;
}

const Tile = ({image, number, highlight}: TileProps) => {
  return (
    <div className={`${styles.tile} ${!number ? styles.light : styles.dark} ${!!highlight && !!!image ? styles.highlight : !!highlight ? styles.pieceHighlight : ''}`}>
      {!!image &&
        <div 
          style={{backgroundImage: `url(${image})`, imageRendering: 'pixelated'}} 
          className={image[9] === 'b' || image[9] === 'r' ? `${styles.scaleDown} ${styles.piece}` : image[9] === 'k' || image[9] === 'q' ? `${styles.scaleUp} ${styles.piece}` : `${styles.piece}`}>
        </div>
      }
    </div>
  )
}

export default Tile