interface Piece {
    image: string;
    x: number;
    y: number;
  }

export default function initialBoardSetup(pieces: Piece[]){
    for(let i=0; i<8; i++){
        pieces.push({image: 'pieces/w-p.png', x: i, y: 1})
        pieces.push({image: 'pieces/b-p.png', x: i, y: 6})
      }
    
      pieces.push({image: 'pieces/b-r.png', x: 0, y: 7})
      pieces.push({image: 'pieces/b-r.png', x: 7, y: 7})
      pieces.push({image: 'pieces/w-r.png', x: 0, y: 0})
      pieces.push({image: 'pieces/w-r.png', x: 7, y: 0})
      
      pieces.push({image: 'pieces/b-n.png', x: 1, y: 7})
      pieces.push({image: 'pieces/b-n.png', x: 6, y: 7})
      pieces.push({image: 'pieces/w-n.png', x: 1, y: 0})
      pieces.push({image: 'pieces/w-n.png', x: 6, y: 0})
    
      pieces.push({image: 'pieces/b-b.png', x: 2, y: 7})
      pieces.push({image: 'pieces/b-b.png', x: 5, y: 7})
      pieces.push({image: 'pieces/w-b.png', x: 2, y: 0})
      pieces.push({image: 'pieces/w-b.png', x: 5, y: 0})
    
      pieces.push({image: 'pieces/b-q.png', x: 3, y: 7})
      pieces.push({image: 'pieces/b-k.png', x: 4, y: 7})
      pieces.push({image: 'pieces/w-q.png', x: 3, y: 0})
      pieces.push({image: 'pieces/w-k.png', x: 4, y: 0})
}