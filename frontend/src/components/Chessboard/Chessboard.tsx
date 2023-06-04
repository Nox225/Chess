import React, { useEffect, useRef, useState } from 'react'
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
  enPassant?: boolean;
  possibleMoves?: {x: number, y:number}[]
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

const GRIDSIZE = 100;

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
  
  const [showPromotionModal, setShowPromotionModal] = useState<boolean>(false);
  const [promotionPawn, setPromotionPawn] = useState<Piece>();

  const chessboardRef = useRef<HTMLDivElement>(null);
  let initialPos = useRef<number[]>([]);
  let board = [];
  let activePiece: HTMLElement | null = null;
  
  const referee = new Referee();

  const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  const updatePossibleMoves = () => {
    referee.calculateAllMoves(pieces);
  }

  useEffect(() => {
    updatePossibleMoves();
  }, [])

  const updateValidMoves = () => {
    setPieces((pieces) => {
      return pieces.map(p => {
        p.possibleMoves = referee.getValidMoves(p, pieces);
        return p;
      });
    });
  }

  const highlight = (e: React.MouseEvent) => {
    updateValidMoves();
  }  

  const grabPiece = (e: React.MouseEvent) => {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;

    if(element.classList.value.includes('piece') && !!chessboard){
      initialPos.current = [
        Math.floor((e.clientX - chessboard.offsetLeft) / GRIDSIZE), 
        Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - GRIDSIZE*8) / GRIDSIZE))
      ];
      const x = e.clientX - GRIDSIZE/2;
      const y = e.clientY - GRIDSIZE/2;
      
      element.style.position = 'absolute';
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      element.style.zIndex = '10';

      activePiece = element;
    }
  }  

  const movePiece = (e: React.MouseEvent) => {
    const chessboard = chessboardRef.current; 
    
    if(!!activePiece && !!chessboard){            
      const minX = chessboard.offsetLeft-GRIDSIZE/5;
      const minY = chessboard.offsetTop-GRIDSIZE/5;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth-(4*(GRIDSIZE/5));
      const maxY = chessboard.offsetTop + chessboard.clientHeight-(4*(GRIDSIZE/5));

      const x = e.clientX - GRIDSIZE/2;
      const y = e.clientY - GRIDSIZE/2;      
  
      activePiece.style.position = 'absolute';
      activePiece.style.left = x<minX ? `${minX}px` : x>maxX ? `${maxX}px` : `${x}px`;
      activePiece.style.top = y<minY ? `${minY}px` : y>maxY ? `${maxY}px` : `${y}px`;
    }
  }

  const dropPiece = (e: React.MouseEvent) => {
    const chessboard = chessboardRef.current;
    const [px, py] = initialPos.current;
    
    if(!!activePiece && !!chessboard){
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRIDSIZE);
      const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 8*GRIDSIZE) / GRIDSIZE));
      const currentPiece = pieces.find((p) => p.x === px && p.y === py);
      
      if(!!currentPiece){
        const isValidMove = referee.isValidMove(px, py, x, y, currentPiece.type, currentPiece.team, pieces);
        const isEnPassantMove = referee.isEnPassantMove(px, py, x, y, currentPiece.type, currentPiece.team, pieces);
        const direction = (currentPiece.team === Team.OUR) ? 1 : -1;

        if(isEnPassantMove){
          const updatedPieces = pieces.reduce((results, piece) => {
            if(piece.x === px && piece.y === py){
              piece.enPassant = false;
              piece.x = x;
              piece.y = y;
              results.push(piece);
            }else if(!(piece.x === x && piece.y === y - direction)){
              if(piece.type === PieceType.PAWN){
                piece.enPassant = false;
              }
              results.push(piece);
            }
            return results;
          }, [] as Piece[]);

          updatePossibleMoves()
          updateValidMoves()
          setPieces(updatedPieces);

        }else if(isValidMove){
          const updatedPieces = pieces.reduce((results, piece) => {
            if(piece.x === px && piece.y === py){
              piece.enPassant = Math.abs(py-y) === 2 && piece.type === PieceType.PAWN;
              piece.x = x;
              piece.y = y;

              let promotionRow = piece.team === Team.OUR ? 7 : 0;
              if(y === promotionRow && piece.type === PieceType.PAWN){
                setShowPromotionModal(true);
                setPromotionPawn(piece);
              }

              results.push(piece);
            } else if(!(piece.x === x && piece.y === y)){
                if(piece.type === PieceType.PAWN){
                  piece.enPassant = false;
                }
                results.push(piece);
            }
            return results;
          }, [] as Piece[]);
  
          updatePossibleMoves()
          updateValidMoves()
          setPieces(updatedPieces);

        }else{          
          activePiece.style.position = 'relative';
          activePiece.style.removeProperty('top');
          activePiece.style.removeProperty('left');
        }
      }
      activePiece.style.removeProperty('zIndex');
      activePiece = null;
    }
  }

  const pawnPromotion = (type: PieceType) =>{
    const updatedPieces = pieces.reduce((results, piece) => {
      if(piece.x === promotionPawn?.x && piece.y === promotionPawn?.y){        
        piece.type = type;
        const team = piece.team === Team.OUR ? 'w' : 'b';
        const pieceFirstLetter = PieceType[type][0].toLocaleLowerCase() === 'k' ? 'n' : PieceType[type][0].toLocaleLowerCase();
        piece.image = `pieces/${team}-${pieceFirstLetter}.png`        
      }
      results.push(piece);
      return results;
    }, [] as Piece[]);
    
    updatePossibleMoves()
    updateValidMoves();
    setPieces(updatedPieces);
    setShowPromotionModal(false);
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

      let grabbedPiece = pieces.find(p => p.x === initialPos.current[0] && p.y === initialPos.current[1]);
      // let grabbedPiece = !!activePiece ? pieces.find(p => p.x === initialPos.current[0] && p.y === initialPos.current[1]) : undefined;
      let highlight = !!grabbedPiece?.possibleMoves ? 
        grabbedPiece.possibleMoves.some(p => p.x === j && p.y === i) : false;

      board.push(<Tile key={makeid(7)} image={image} number={number} highlight={highlight} />);
    }
  }  

  console.log('rerender');
  

  return (
    <>
      <div
        onClick={(e)=>highlight(e)}
        onMouseDown={(e)=>grabPiece(e)}
        onMouseMove={(e)=>movePiece(e)}
        onMouseUp={(e)=>dropPiece(e)}
        className={styles.chessboardGrid}
        ref={chessboardRef}
      >
        {board}
      </div>
      {!!showPromotionModal ?
        <div className={styles.modalBackdrop}>
          <div className={styles.promotionModal}>
            <div onClick={() => {pawnPromotion(PieceType.ROOK)}} style={{backgroundImage: `url(${promotionPawn?.team === Team.OUR ? 'pieces/w-r.png' : 'pieces/b-r.png'})`}} className={styles.pieceOption2} />
            <div onClick={() => {pawnPromotion(PieceType.KNIGHT)}} style={{backgroundImage: `url(${promotionPawn?.team === Team.OUR ? 'pieces/w-n.png' : 'pieces/b-n.png'})`}} className={styles.pieceOption1} />
            <div onClick={() => {pawnPromotion(PieceType.BISHOP)}} style={{backgroundImage: `url(${promotionPawn?.team === Team.OUR ? 'pieces/w-b.png' : 'pieces/b-b.png'})`}} className={styles.pieceOption2} />
            <div onClick={() => {pawnPromotion(PieceType.QUEEN)}} style={{backgroundImage: `url(${promotionPawn?.team === Team.OUR ? 'pieces/w-q.png' : 'pieces/b-q.png'})`}} className={styles.pieceOption1} />
          </div> 
        </div> : <></>
      }
    </>
  )
}

export default Chessboard