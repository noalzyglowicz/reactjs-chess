import React, { Component } from "react";
import "./ChessBoard.css";
import Node from "../Node/Node";
import King from "../Node/Pieces/King";
import Rook from "../Node/Pieces/Rook";
import Pawn from "../Node/Pieces/Pawn";
import Queen from "../Node/Pieces/Queen";
import Bishop from "../Node/Pieces/Bishop";
import Knight from "../Node/Pieces/Knight";
import BlankSquare from "../Node/Pieces/BlankSquare";
import Modal from "react-modal";
import whiteQueen from "../Node/Pieces/whiteQueen.svg";
import whiteKnight from "../Node/Pieces/whiteKnight.svg";

export default class ChessBoard extends Component {
  constructor(props) {
    super(props);
    this.knight = React.createRef();
    this.pawn = React.createRef();
    this.king = React.createRef();
    this.queen = React.createRef();
    this.bishop = React.createRef();
    this.rook = React.createRef();
    this.textInput = null;
    this.setTextInputRef = (element) => {
      this.textInput = element;
    };
    this.state = {
      grid: [],
      mouseIsPressed: false,
      turn: "white",
      isSelected: false,
      selectedNode: undefined,
      selectedPieceName: undefined,
      moves: [],
      blackCanCastleKingSide: true,
      whiteCanCastleKingSide: true,
      blackCanCastleQueenSide: true,
      whiteCanCastleQueenSide: true,
      selectedRow: undefined,
      selectedCol: undefined,
      pawnPromotionCoordinates: undefined,
      pawnPromotionModalOpen: false,
      blackEnPassant: [
        [false, false],
        [false, false],
        [false, false],
        [false, false],
        [false, false],
        [false, false],
        [false, false],
        [false, false],
      ],
      whiteEnPassant: [
        [false, false],
        [false, false],
        [false, false],
        [false, false],
        [false, false],
        [false, false],
        [false, false],
        [false, false],
      ],
    };
  }

  checkMoves(selectedRow, selectedCol, row, col, moves) {
    if (this.isSameColor(selectedRow, selectedCol, row, col)) {
      moves.splice(this.indexOfMove(row, col, moves), 1);
    }
    let enPassantMoves = undefined;
    if (this.getPieceName(selectedRow, selectedCol) === "Pawn") {
      moves = this.checkPawnTake(
        selectedRow,
        selectedCol,
        moves,
        this.getPieceColor(selectedRow, selectedCol)
      );
      //this.updateEnPassantState(selectedRow, selectedCol, row, col);
      enPassantMoves = this.addEnPassantMoves(
        selectedRow,
        selectedCol,
        this.getPieceColor(selectedRow, selectedCol)
      );
    }

    // if (this.ifCastle(row, col)) {
    //   this.setSelectedMovesWhite(this.state.moves, false);
    //   this.setState({ isSelected: false });
    //   return false;
    // }

    moves = this.removeInvalidMoves(
      selectedRow,
      selectedCol,
      moves,
      this.getPieceName(selectedRow, selectedCol)
    );

    // if (moves === []) {
    //   return false;
    // }

    // let randMove = undefined;
    // if (this.state.turn === "black") {
    //   if (moves.length !== 0) {
    //     let num = this.getRandomInt(moves.length);
    //     randMove = moves[num];
    //     row = randMove[0];
    //     col = randMove[1];
    //   }
    // }

    // let validMove = false;
    // if (this.containsMove(row, col, moves)) {
    //   validMove = true;
    // }
    // if (!validMove) {
    //   return false;
    // } else {
    //   return true;
    // }

    return moves;
  }

  isValidMove(row, col, moves) {
    if (moves === []) {
      return false;
    }
    let validMove = false;
    if (this.containsMove(row, col, moves)) {
      validMove = true;
    }
    if (!validMove) {
      return false;
    } else {
      return true;
    }
  }

  deepCopyGrid(array) {
    let newCopy = [];
    for (let i = 0; i < array.length; i++) {
      newCopy.push(array[i].slice());
    }
    return newCopy;
  }

  move(selectedRow, selectedCol, row, col, moves, grid) {
    console.log(this.getPieceName(row, col));
    //this.checkMoves(selectedRow, selectedCol, row, col, moves);

    // if (enPassantMoves !== undefined) {
    //   let newBlankPiece = <BlankSquare></BlankSquare>;
    //   if (this.containsMove(row, col, enPassantMoves)) {
    //     newGrid[selectedRow][col] = this.createChessSquare(
    //       selectedRow,
    //       col,
    //       this.createNode(selectedRow, col, newBlankPiece, false)
    //     );
    //     validMove = true;
    //   }
    // }
    // if (!validMove) {
    //   return false;
    // }
    let newBlankPiece = <BlankSquare></BlankSquare>;
    this.setState({ isSelected: false });
    this.updateEnPassantState(selectedRow, selectedCol, row, col);
    this.updatePawnPromotionState(row, col);
    this.checkRookUpdatesCastle(selectedRow, selectedCol);
    let pieceToMove = this.getPiece(selectedRow, selectedCol);
    this.setSelectedMovesWhite(moves, false);
    grid[row][col] = this.createChessSquare(
      row,
      col,
      this.createNode(row, col, pieceToMove, false)
    );
    grid[selectedRow][selectedCol] = this.createChessSquare(
      selectedRow,
      selectedCol,
      this.createNode(selectedRow, selectedCol, newBlankPiece, false)
    );
    //this.setState({ grid: newGrid });
    if (this.state.turn === "white") {
      this.setState({ turn: "black" });
    } else {
      //this.updatePiece(randMove[0], randMove[1]);
      this.setState({ turn: "white" });
    }
    return grid;
  }

  checkRookUpdatesCastle(selectedRow, selectedCol) {
    if (this.getPieceName(selectedRow, selectedCol) === "Rook") {
      if (this.getPieceColor(selectedRow, selectedCol) === "black") {
        if (selectedRow === 7 && selectedCol === 7) {
          this.setState({
            blackCanCastleKingSide: false,
          });
        } else if (selectedRow === 7 && selectedCol === 0) {
          this.setState({
            blackCanCastleQueenSide: false,
          });
        }
      } else {
        if (selectedRow === 0 && selectedCol === 7) {
          this.setState({
            whiteCanCastleKingSide: false,
          });
        } else if (selectedRow === 0 && selectedCol === 0) {
          this.setState({
            whiteCanCastleQueenSide: false,
          });
        }
      }
    }
  }

  selectPiece(row, col) {
    this.setState({
      selectedRow: row,
      selectedCol: col,
      selectedPieceName: this.getPieceName(row, col),
      selctedNode: this.getNode(row, col),
      mouseIsPressed: true,
      isSelected: true,
    });
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  blacksTurn() {
    let spacesWithBlackPieces = [];
    for (let i = 0; i <= 7; i++) {
      for (let j = 0; j <= 7; j++) {
        if (this.getPieceColor(i, j) === "black") {
          spacesWithBlackPieces.push([i, j]);
        }
      }
    }
    let coordinates =
      spacesWithBlackPieces[this.getRandomInt(spacesWithBlackPieces.length)];
    let chosenPiece = this.getPiece(coordinates[0], coordinates[1]);
    //let someMoves = chosenPiece.getMoves(coordinates[0], coordinates[1]);
  }

  handleMouseDown(row, col) {
    //this.child = this.getPiece(row, col);
    // if (this.getPieceName(row, col) !== "BlankSquare") {
    //   this.getPiece(row, col).ref.current.getMoves(row, col);
    // }
    //this.child.current.getAlert();
    if (this.state.isSelected) {
      if (this.state.selectedNode !== this.getNode(row, col)) {
        if (!this.isEmptySquare(row, col)) {
          this.selectPiece(row, col);
          this.setSelectedMovesWhite(this.state.moves, false);
        }
      }
      let moves = this.state.moves;
      moves = this.checkMoves(
        this.state.selectedRow,
        this.state.selectedCol,
        row,
        col,
        moves
      );
      if (this.isValidMove(row, col, moves)) {
        this.move(
          this.state.selectedRow,
          this.state.selectedCol,
          row,
          col,
          moves,
          this.state.grid
        );
      }
      if (!this.isDifferentSquare(row, col)) {
        this.setState({ isSelected: false });
      }
    } else {
      if (!this.isEmptySquare(row, col)) {
        this.selectPiece(row, col);
      }
    }
    this.updatePiece(row, col);
  }

  componentDidUpdate() {
    // if (this.state.turn === "black") {
    //   let blackPieces = [];
    //   for (let i = 0; i < 8; i++) {
    //     for (let j = 0; j < 8; j++) {
    //       if (this.getPieceName(i, j) !== "BlankSquare") {
    //         if (this.getPieceColor(i, j) !== "white") {
    //           blackPieces.push([i, j]);
    //         }
    //       }
    //     }
    //   }
    //   let successfulMove = false;                 //old random picked move code starts here
    //   //while (!successfulMove) {
    //   let randPiece = blackPieces[this.getRandomInt(blackPieces.length)];
    //   let possibleMoves = [];
    //   if (this.getPieceName(randPiece[0], randPiece[1]) === "Pawn") {
    //     possibleMoves = this.getPiece(
    //       randPiece[0],
    //       randPiece[1]
    //     ).props.getMoves(
    //       randPiece[0],
    //       randPiece[1],
    //       this.getPieceColor(randPiece[0], randPiece[1]),
    //       this.getPiece(randPiece[0], randPiece[1]).props.isInStartingState
    //     );
    //   } else {
    //     possibleMoves = this.getPiece(
    //       randPiece[0],
    //       randPiece[1]
    //     ).props.getMoves(randPiece[0], randPiece[1]);
    //   }
    //   possibleMoves = this.removeInvalidMoves(
    //     randPiece[0],
    //     randPiece[1],
    //     possibleMoves,
    //     this.getPieceName(randPiece[0], randPiece[1])
    //   );
    //   if (possibleMoves.length > 0) {
    //     let num = this.getRandomInt(possibleMoves.length);
    //     let randMove = possibleMoves[num];
    //     possibleMoves = this.checkMoves(
    //       randPiece[0],
    //       randPiece[1],
    //       randMove[0],
    //       randMove[1],
    //       possibleMoves
    //     );
    //     if (this.isValidMove(randMove[0], randMove[1], possibleMoves)) {
    //       if (
    //         this.move(
    //           randPiece[0],
    //           randPiece[1],
    //           randMove[0],
    //           randMove[1],
    //           possibleMoves
    //         )
    //       ) {
    //         successfulMove = true;
    //       }
    //     }
    //   }
    //   //}
    //   return false;
    // }
    // if (this.state.turn === "black") {
    //   let bestScore = -Infinity;
    //   let bestMove = [];
    //   for (let i = 0; i < 8; i++) {
    //     for (let j = 0; j < 8; j++) {
    //       if (this.getPieceName(i, j) !== "BlankSquare") {
    //         if (this.getPieceColor(i, j) === "black") {
    //           let moves = this.getPiece(i, j).props.getMoves(
    //             i,
    //             j,
    //             this.getPieceColor(i, j),
    //             this.getPiece(i, j).props.isInStartingState
    //           );
    //           let score;
    //           for (let k = 0; k < moves.length; k++) {
    //             score = this.minimax(this.state.grid, 1, 0, false);
    //           }
    //           if (score > bestScore) {
    //             bestScore = score;
    //             bestMove = [i, j];
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
  }

  minimax(board, depth, pointValue, isMaximizing) {
    if (depth === 3) {
      //if we run out of depth as specified, that score is the final score we want
      return pointValue;
    }

    if (isMaximizing) {
      let maxScore = -Infinity;
      let score;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          let moves = this.getPiece(i, j).props.getMoves(
            i,
            j,
            this.getPieceColor(i, j),
            this.getPiece(i, j).props.isInStartingState
          );
          moves = this.checkMoves(moves);
          for (let k = 0; k < moves.length; k++) {
            //find the new point value of the move to [moves[k][0], moves[k][1]] from piece at [i, j]
            //create variable for some new board and make the move on that board
            let newBoard = this.deepCopyGrid(board);
            if (this.isValidMove(moves[k][0], moves[k][1], moves)) {
              newBoard = this.move(
                i,
                j,
                moves[k][0],
                moves[k][1],
                moves,
                newBoard
              );
              pointValue =
                pointValue + this.getPointValue(moves[k][0], moves[k][1]);
              score = this.minimax(newBoard, depth + 1, pointValue, false); //pass new point value in.
            } else {
              score = maxScore;
            }
          }
          //or minus 1 depth depending on designation of direction
          maxScore = Math.max(score, maxScore);
        }
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      let score;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          let moves = this.getPiece(i, j).props.getMoves(
            i,
            j,
            this.getPieceColor(i, j),
            this.getPiece(i, j).props.isInStartingState
          );
          moves = this.checkMoves(moves);
          for (let k = 0; k < moves.length; k++) {
            let newBoard = this.deepCopyGrid(board);
            if (this.isValidMove(moves[k][0], moves[k][1], moves)) {
              newBoard = this.move(
                i,
                j,
                moves[k][0],
                moves[k][1],
                moves,
                newBoard
              );
            }
            pointValue =
              pointValue - this.getPointValue(moves[k][0], moves[k][1]);
            score = this.minimax(board, depth + 1, pointValue, true);
          }
          minScore = Math.min(score, minScore);
        }
      }
      return minScore;
    }
  }

  getPointValue(row, col) {
    let pointValues = {
      Pawn: 1,
      Knight: 3,
      Bishop: 3,
      Rook: 5,
      Queen: 9,
      King: 100,
      BlankSquare: 0,
    };
    return pointValues[this.getPieceName(row, col)];
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.state.pawnPromotionModalOpen}>
          <div>
            <img
              src={whiteQueen}
              alt=""
              width="50"
              height="50"
              onClick={() =>
                this.pawnPromote(this.state.pawnPromotionCoordinates, "Queen")
              }
            ></img>
          </div>
          <div>
            <img
              src={whiteKnight}
              alt=""
              width="50"
              height="50"
              onClick={() =>
                this.pawnPromote(this.state.pawnPromotionCoordinates, "Knight")
              }
            ></img>
          </div>
        </Modal>
        <div className="grid">
          {this.state.grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node) => {
                  const { Node } = node;
                  return Node;
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid: grid });
  }

  getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 8; row++) {
      const currentRow = [];
      for (let col = 0; col < 8; col++) {
        let piece = this.getStartingPiece(row, col);
        let chessNode = this.createNode(row, col, piece, false);
        currentRow.push(this.createChessSquare(row, col, chessNode));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  removeInvalidMoves(selectedRow, selectedCol, moves, selectedPieceName) {
    for (let i = 0; i < moves.length; i++) {
      if (!this.isValidCoordinates(moves[i][0], moves[i][1])) {
        moves.splice(i, 1);
        i = i - 1;
      } else if (
        this.isSameColor(selectedRow, selectedCol, moves[i][0], moves[i][1])
      ) {
        // console.log(
        //   "removing same color move",
        //   "randMove",
        //   selectedRow,
        //   selectedCol,
        //   row,
        //   col
        // );
        // console.log("moves", moves);
        //moves.splice(this.indexOfMove(row, col, moves), 1);
        // console.log("moves after splice", moves);
        moves.splice(i, 1);
        i = i - 1;
      }
    }
    if (selectedPieceName !== "Knight") {
      moves = this.isIllegalSlant(selectedRow, selectedCol, moves);

      if (selectedPieceName !== "Bishop") {
        moves = this.isIllegalStraight(selectedRow, selectedCol, moves);
      }
    }
    return moves;
  }

  containsMove(row, col, moves) {
    let containsMove = false;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i][0] === row && moves[i][1] === col) {
        containsMove = true;
      }
    }
    return containsMove;
  }

  indexOfMove(row, col, moves) {
    let i = 0;
    for (i; i < moves.length; i++) {
      if (moves[i][0] === row && moves[i][1] === col) {
        return i;
      }
    }
    return -1;
  }

  checkPawnTake(selectedRow, selectedCol, moves, color) {
    if (color === "black") {
      if (this.isValidCoordinates(selectedRow - 1, selectedCol + 1)) {
        if (!this.isEmptySquare(selectedRow - 1, selectedCol + 1)) {
          if (
            !this.isSameColor(
              selectedRow,
              selectedCol,
              selectedRow - 1,
              selectedCol + 1,
              this.state
            )
          ) {
            moves.push([selectedRow - 1, selectedCol + 1]);
          }
        }
      }
      if (this.isValidCoordinates(selectedRow - 1, selectedCol - 1)) {
        if (!this.isEmptySquare(selectedRow - 1, selectedCol - 1)) {
          if (
            !this.isSameColor(
              selectedRow,
              selectedCol,
              selectedRow - 1,
              selectedCol - 1,
              this.state
            )
          ) {
            moves.push([selectedRow - 1, selectedCol - 1]);
          }
        }
      }
      if (!this.isEmptySquare(selectedRow - 1, selectedCol)) {
        moves.splice(0, 1); //removes vertical take of pawn if piece ahead
      }
    } else {
      if (this.isValidCoordinates(selectedRow + 1, selectedCol + 1)) {
        if (!this.isEmptySquare(selectedRow + 1, selectedCol + 1)) {
          if (
            !this.isSameColor(
              selectedRow,
              selectedCol,
              selectedRow + 1,
              selectedCol + 1,
              this.state
            )
          ) {
            moves.push([selectedRow + 1, selectedCol + 1]);
          }
        }
      }
      if (this.isValidCoordinates(selectedRow + 1, selectedCol - 1)) {
        if (!this.isEmptySquare(selectedRow + 1, selectedCol - 1)) {
          if (
            !this.isSameColor(
              selectedRow,
              selectedCol,
              selectedRow + 1,
              selectedCol - 1,
              this.state
            )
          ) {
            moves.push([selectedRow + 1, selectedCol - 1]);
          }
        }
      }
      if (!this.isEmptySquare(selectedRow + 1, selectedCol)) {
        moves.splice(0, 1); //removes vertical take of pawn if piece ahead
      }
    }
    this.setState({ moves: moves });
    return moves;
  }

  castle(row, col, color, side) {
    let newGrid = this.state.grid.slice();
    if (color === "black") {
      if (side === "kingSide") {
        if (row === 7 && col === 6) {
          if (this.isEmptySquare(7, 5) && this.isEmptySquare(7, 6)) {
            newGrid[7][6] = this.createChessSquare(
              7,
              6,
              this.createNode(7, 6, this.createKing(7, 6, "black"), false)
            );
            newGrid[7][5] = this.createChessSquare(
              7,
              5,
              this.createNode(7, 5, this.createRook(7, 5, "black"))
            );
            newGrid[7][4] = this.createChessSquare(
              7,
              5,
              this.createNode(7, 4, this.createBlankSquare(7, 4))
            );
            newGrid[7][7] = this.createChessSquare(
              7,
              7,
              this.createNode(7, 7, this.createBlankSquare(7, 7))
            );
            this.setState({
              blackCanCastleKingSide: false,
              blackCanCastleQueenSide: false,
            });
            return true;
          }
        }
      } else {
        if (row === 7 && col === 2) {
          if (
            this.isEmptySquare(7, 1) &&
            this.isEmptySquare(7, 2) &&
            this.isEmptySquare(7, 3)
          ) {
            newGrid[7][2] = this.createChessSquare(
              7,
              2,
              this.createNode(7, 2, this.createKing(7, 2, "black"), false)
            );
            newGrid[7][3] = this.createChessSquare(
              7,
              3,
              this.createNode(7, 3, this.createRook(7, 3, "black"))
            );
            newGrid[7][0] = this.createChessSquare(
              7,
              0,
              this.createNode(7, 0, this.createBlankSquare(7, 0))
            );
            newGrid[7][4] = this.createChessSquare(
              7,
              4,
              this.createNode(7, 4, this.createBlankSquare(7, 4))
            );
            this.setState({
              blackCanCastleKingSide: false,
              blackCanCastleQueenSide: false,
            });
            return true;
          }
        }
      }
    } else {
      if (side === "kingSide") {
        if (row === 0 && col === 6) {
          if (this.isEmptySquare(0, 5) && this.isEmptySquare(0, 6)) {
            newGrid[0][6] = this.createChessSquare(
              0,
              6,
              this.createNode(0, 6, this.createKing(7, 6, "white"), false)
            );
            newGrid[0][5] = this.createChessSquare(
              0,
              5,
              this.createNode(0, 5, this.createRook(0, 5, "white"))
            );
            newGrid[0][4] = this.createChessSquare(
              0,
              4,
              this.createNode(0, 4, this.createBlankSquare(0, 4))
            );
            newGrid[0][7] = this.createChessSquare(
              0,
              7,
              this.createNode(0, 7, this.createBlankSquare(0, 7))
            );
            this.setState({
              whiteCanCastleKingSide: false,
              whiteCanCastleQueenSide: false,
            });
            return true;
          }
        }
      } else {
        if (row === 0 && col === 2) {
          if (
            this.isEmptySquare(0, 1) &&
            this.isEmptySquare(0, 2) &&
            this.isEmptySquare(0, 3)
          ) {
            newGrid[0][2] = this.createChessSquare(
              0,
              2,
              this.createNode(0, 2, this.createKing(0, 2, "white"), false)
            );
            newGrid[0][3] = this.createChessSquare(
              0,
              3,
              this.createNode(0, 3, this.createRook(0, 3, "white"))
            );
            newGrid[0][0] = this.createChessSquare(
              0,
              0,
              this.createNode(0, 0, this.createBlankSquare(0, 0))
            );
            newGrid[0][4] = this.createChessSquare(
              0,
              4,
              this.createNode(0, 4, this.createBlankSquare(0, 4))
            );
            this.setState({
              whiteCanCastleKingSide: false,
              whiteCanCastleQueenSide: false,
            });
            return true;
          }
        }
      }
    }
    this.setState({ grid: newGrid });
  }

  updatePawnPromotionState(row, col) {
    if (this.state.selectedPieceName === "Pawn") {
      if (row === 0 || row === 7) {
        this.setState({
          pawnPromotionCoordinates: [row, col],
          pawnPromotionModalOpen: true,
        });
      }
    }
  }

  ifCastle(row, col) {
    if (this.state.selectedPieceName === "King") {
      if (
        this.checkCastleState(
          this.getPieceColor(this.state.selectedRow, this.state.selectedCol),
          this.determineCastleSide(row, col)
        )
      ) {
        if (
          this.castle(
            row,
            col,
            this.getPieceColor(this.state.selectedRow, this.state.selectedCol),
            this.determineCastleSide(row, col)
          )
        ) {
          return true;
        }
      }
    }
    return false;
  }

  addEnPassantMoves(row, col, color) {
    let enPassantMoves = [];
    if (color === "black") {
      let currentEnPassant = this.state.whiteEnPassant;
      if (this.isValidCoordinates(row, col - 1)) {
        if (currentEnPassant[col - 1][1] === true) {
          enPassantMoves.push([row - 1, col - 1]);
        }
      }
      if (this.isValidCoordinates(row, col + 1)) {
        if (currentEnPassant[col + 1][0] === true) {
          enPassantMoves.push([row - 1, col + 1]);
        }
      }
    } else {
      let currentEnPassant = this.state.blackEnPassant;
      if (this.isValidCoordinates(row, col - 1)) {
        if (currentEnPassant[col - 1][1] === true) {
          enPassantMoves.push([row + 1, col - 1]);
        }
      }
      if (this.isValidCoordinates(row, col + 1)) {
        if (currentEnPassant[col + 1][0] === true) {
          enPassantMoves.push([row + 1, col + 1]);
        }
      }
    }
    return enPassantMoves;
  }

  updateEnPassantState(selectedRow, selectedCol, row, col) {
    if (this.getPieceColor(selectedRow, selectedCol) === "black") {
      if (Math.abs(selectedRow - row) === 2) {
        let currentEnPassant = this.state.blackEnPassant;
        if (this.isValidCoordinates(4, col - 1)) {
          if (!this.isEmptySquare(4, col - 1)) {
            currentEnPassant[col][0] = true;
          }
        }
        if (this.isValidCoordinates(4, col + 1)) {
          if (!this.isEmptySquare(4, col + 1)) {
            currentEnPassant[col][1] = true;
          }
        }
        this.setState({ blackEnPassant: currentEnPassant });
      }
      if (selectedRow === 4) {
        let currentEnPassant = this.state.blackEnPassant;
        currentEnPassant[col] = [false, false];
        this.setState({ blackEnPassant: currentEnPassant });
      }
    } else {
      if (Math.abs(selectedRow - row) === 2) {
        let currentEnPassant = this.state.whiteEnPassant;
        if (this.isValidCoordinates(3, col - 1)) {
          if (!this.isEmptySquare(3, col - 1)) {
            currentEnPassant[col][0] = true;
          }
        }
        if (this.isValidCoordinates(3, col + 1)) {
          if (!this.isEmptySquare(3, col + 1)) {
            currentEnPassant[col][1] = true;
          }
        }
        this.setState({ whiteEnPassant: currentEnPassant });
      }
      if (this.state.selectedRow === 3) {
        let currentEnPassant = this.state.whiteEnPassant;
        currentEnPassant[col] = [false, false];
        this.setState({ whiteEnPassant: currentEnPassant });
      }
    }
  }

  pawnPromote(pawnPromotionCoordinates, pieceName) {
    if (pawnPromotionCoordinates[0] === 0) {
      var color = "black";
    } else {
      color = "white";
    }
    let newGrid = this.state.grid.slice();
    if (pieceName === "Queen") {
      var createPieceFunc = this.createQueen(
        pawnPromotionCoordinates[0],
        pawnPromotionCoordinates[1],
        color
      );
    } else {
      createPieceFunc = this.createKnight(
        pawnPromotionCoordinates[0],
        pawnPromotionCoordinates[1],
        color
      );
    }
    newGrid[pawnPromotionCoordinates[0]][
      pawnPromotionCoordinates[1]
    ] = this.createChessSquare(
      pawnPromotionCoordinates[0],
      pawnPromotionCoordinates[1],
      this.createNode(
        pawnPromotionCoordinates[0],
        pawnPromotionCoordinates[1],
        createPieceFunc,
        false
      )
    );
    this.setState({ grid: newGrid, pawnPromotionModalOpen: false });
  }

  isIllegalStraight(selectedRow, selectedCol, moves) {
    let isIllegalJump = false;
    for (let i = 1; i <= 7; i++) {
      if (isIllegalJump) {
        let idx = this.indexOfMove(selectedRow, selectedCol + i, moves);
        if (idx !== -1) {
          moves.splice(idx, 1);
        }
      }
      if (this.isValidCoordinates(selectedRow, selectedCol + i)) {
        if (!this.isEmptySquare(selectedRow, selectedCol + i)) {
          isIllegalJump = true;
        }
      }
    }
    isIllegalJump = false;
    for (let i = 1; i <= 7; i++) {
      if (isIllegalJump) {
        let idx = this.indexOfMove(selectedRow, selectedCol - i, moves);
        if (idx !== -1) {
          moves.splice(idx, 1);
        }
      }
      if (this.isValidCoordinates(selectedRow, selectedCol - i)) {
        if (!this.isEmptySquare(selectedRow, selectedCol - i)) {
          isIllegalJump = true;
        }
      }
    }
    isIllegalJump = false;
    for (let i = 1; i <= 7; i++) {
      if (isIllegalJump) {
        let idx = this.indexOfMove(selectedRow + i, selectedCol, moves);
        if (idx !== -1) {
          moves.splice(idx, 1);
        }
      }
      if (this.isValidCoordinates(selectedRow + i, selectedCol)) {
        if (!this.isEmptySquare(selectedRow + i, selectedCol)) {
          isIllegalJump = true;
        }
      }
    }
    isIllegalJump = false;
    for (let i = 1; i <= 7; i++) {
      if (isIllegalJump) {
        let idx = this.indexOfMove(selectedRow - i, selectedCol, moves);
        if (idx !== -1) {
          moves.splice(idx, 1);
        }
      }
      if (this.isValidCoordinates(selectedRow - i, selectedCol)) {
        if (!this.isEmptySquare(selectedRow - i, selectedCol)) {
          isIllegalJump = true;
        }
      }
    }
    return moves;
  }

  isIllegalSlant(selectedRow, selectedCol, moves) {
    let isIllegalJump = false;
    for (let i = 1; i <= 7; i++) {
      if (isIllegalJump) {
        let idx = this.indexOfMove(selectedRow + i, selectedCol + i, moves);
        if (idx !== -1) {
          moves.splice(idx, 1);
        }
      }
      if (this.isValidCoordinates(selectedRow + i, selectedCol + i)) {
        if (!this.isEmptySquare(selectedRow + i, selectedCol + i)) {
          isIllegalJump = true;
        }
      }
    }
    isIllegalJump = false;
    for (let i = 1; i <= 7; i++) {
      if (isIllegalJump) {
        let idx = this.indexOfMove(selectedRow + i, selectedCol - i, moves);
        if (idx !== -1) {
          moves.splice(idx, 1);
        }
      }
      if (this.isValidCoordinates(selectedRow + i, selectedCol - i)) {
        if (!this.isEmptySquare(selectedRow + i, selectedCol - i)) {
          isIllegalJump = true;
        }
      }
    }
    isIllegalJump = false;
    for (let i = 1; i <= 7; i++) {
      if (isIllegalJump) {
        let idx = this.indexOfMove(selectedRow - i, selectedCol + i, moves);
        if (idx !== -1) {
          moves.splice(idx, 1);
        }
      }
      if (this.isValidCoordinates(selectedRow - i, selectedCol + i)) {
        if (!this.isEmptySquare(selectedRow - i, selectedCol + i)) {
          isIllegalJump = true;
        }
      }
    }
    isIllegalJump = false;
    for (let i = 1; i <= 7; i++) {
      if (isIllegalJump) {
        let idx = this.indexOfMove(selectedRow - i, selectedCol - i, moves);
        if (idx !== -1) {
          moves.splice(idx, 1);
        }
      }
      if (this.isValidCoordinates(selectedRow - i, selectedCol - i)) {
        if (!this.isEmptySquare(selectedRow - i, selectedCol - i)) {
          isIllegalJump = true;
        }
      }
    }
    return moves;
  }

  checkCastleState(color, castleSide) {
    if (color === "black") {
      if (castleSide === "kingSide") {
        if (this.state.blackCanCastleKingSide === true) {
          return true;
        }
      } else {
        if (this.state.blackCanCastleQueenSide === true) {
          return true;
        }
      }
    } else {
      if (castleSide === "kingSide") {
        if (this.state.whiteCanCastleKingSide === true) {
          return true;
        }
      } else {
        if (this.state.whiteCanCastleQueenSide === true) {
          return true;
        }
      }
    }
    return false;
  }

  determineCastleSide(row, col) {
    if (col === 6 && (row === 7 || row === 0)) {
      var side = "kingSide";
    } else {
      side = "queenSide";
    }
    return side;
  }

  isDifferentSquare(row, col) {
    let isDifferentSquare = true;
    if (row === this.state.selectedRow && col === this.state.selectedCol) {
      isDifferentSquare = false;
    }
    return isDifferentSquare;
  }

  isEmptySquare(row, col) {
    if (this.getPieceName(row, col) === "BlankSquare") {
      return true;
    }
    return false;
  }

  isSameColor(selectedRow, selectedCol, row, col) {
    if (!this.isEmptySquare(row, col)) {
      if (
        this.state.grid[row][col].Node.props.piece.props.color ===
        this.state.grid[selectedRow][selectedCol].Node.props.piece.props.color
      ) {
        return true;
      }
    }
  }

  createChessSquare(row, col, Node) {
    return {
      row,
      col,
      Node,
    };
  }

  createNode(row, col, piece, clicked) {
    return (
      <Node
        key={col}
        row={row}
        col={col}
        piece={piece}
        clicked={clicked}
        onMouseDown={() => this.handleMouseDown(row, col)}
        onMouseUp={() => this.handleMouseUp(row, col)}
      ></Node>
    );
  }

  updatePiece(row, col) {
    let piece = this.state.grid[row][col].Node.props.piece;
    let newPiece = undefined;
    if (this.getPieceName(row, col) === "Pawn") {
      newPiece = this.createPawn(row, col, piece.props.color, false);
    } else if (this.getPieceName(row, col) === "Rook") {
      newPiece = this.createRook(row, col, piece.props.color);
    } else if (this.getPieceName(row, col) === "Knight") {
      newPiece = this.createKnight(row, col, piece.props.color);
    } else if (this.getPieceName(row, col) === "Bishop") {
      newPiece = this.createBishop(row, col, piece.props.color);
    } else if (this.getPieceName(row, col) === "Queen") {
      newPiece = this.createQueen(row, col, piece.props.color);
    } else if (this.getPieceName(row, col) === "King") {
      newPiece = this.createKing(row, col, piece.props.color);
    } else {
      newPiece = this.createBlankSquare();
    }
    let newGrid = this.state.grid.slice();
    newGrid[row][col] = this.createChessSquare(
      row,
      col,
      this.createNode(row, col, newPiece, false)
    );
    this.setState({ grid: newGrid });
  }

  getStartingPiece(row, col) {
    let piece = undefined;
    if (row === 1) {
      piece = this.createPawn(row, col, "white", true);
    } else if (row === 0 && (col === 0 || col === 7)) {
      piece = this.createRook(row, col, "white");
    } else if (row === 0 && (col === 1 || col === 6)) {
      piece = this.createKnight(row, col, "white");
    } else if (row === 0 && (col === 2 || col === 5)) {
      piece = this.createBishop(row, col, "white");
    } else if (row === 0 && col === 3) {
      piece = this.createQueen(row, col, "white");
    } else if (row === 0 && col === 4) {
      piece = this.createKing(row, col, "white");
    } else if (row === 6) {
      piece = this.createPawn(row, col, "black", true);
    } else if (row === 7 && (col === 0 || col === 7)) {
      piece = this.createRook(row, col, "black");
    } else if (row === 7 && (col === 1 || col === 6)) {
      piece = this.createKnight(row, col, "black");
    } else if (row === 7 && (col === 2 || col === 5)) {
      piece = this.createBishop(row, col, "black");
    } else if (row === 7 && col === 3) {
      piece = this.createQueen(row, col, "black");
    } else if (row === 7 && col === 4) {
      piece = this.createKing(row, col, "black");
    } else {
      piece = this.createBlankSquare();
    }
    return piece;
  }

  createPawn(row, col, color, isInStartingState) {
    return (
      <Pawn
        id={"pawn"}
        row={row}
        col={col}
        color={color}
        getMoves={(row, col, color, isInStartingState) => {
          let moves = [];
          if (color === "black") {
            moves.push([row - 1, col]);
            if (isInStartingState) {
              moves.push([row - 2, col]);
            }
          } else {
            moves.push([row + 1, col]);
            if (isInStartingState) {
              moves.push([row + 2, col]);
            }
          }
          return moves;
        }}
        changeMoves={this.changeMoves.bind(this)}
        isInStartingState={isInStartingState}
        ref={this.setTextInputRef}
      ></Pawn>
    );
  }

  createKnight(row, col, color) {
    return (
      <Knight
        row={row}
        col={col}
        color={color}
        getMoves={(row, col) => {
          let moves = [];
          moves.push([row + 2, col + 1]);
          moves.push([row + 2, col - 1]);
          moves.push([row - 2, col + 1]);
          moves.push([row - 2, col - 1]);
          moves.push([row + 1, col + 2]);
          moves.push([row - 1, col + 2]);
          moves.push([row + 1, col - 2]);
          moves.push([row - 1, col - 2]);

          return moves;
        }}
        changeMoves={this.changeMoves.bind(this)}
        ref={this.knight}
      ></Knight>
    );
  }

  createBishop(row, col, color) {
    return (
      <Bishop
        row={row}
        col={col}
        color={color}
        getMoves={(row, col) => {
          let moves = [];
          for (let i = 0; i <= 7; i++) {
            moves.push([row + i, col + i]);
            moves.push([row + i, col - i]);
            moves.push([row - i, col + i]);
            moves.push([row - i, col - i]);
          }
          return moves;
        }}
        changeMoves={this.changeMoves.bind(this)}
        ref={this.bishop}
      ></Bishop>
    );
  }

  createRook(row, col, color) {
    return (
      <Rook
        row={row}
        col={col}
        color={color}
        getMoves={(row, col) => {
          let moves = [];
          for (let i = 0; i <= 7; i++) {
            moves.push([row, i]);
            moves.push([i, col]);
          }
          return moves;
        }}
        changeMoves={this.changeMoves.bind(this)}
        ref={this.rook}
      ></Rook>
    );
  }

  createQueen(row, col, color) {
    return (
      <Queen
        row={row}
        col={col}
        color={color}
        getMoves={(row, col) => {
          let moves = [];
          for (let i = 0; i <= 7; i++) {
            moves.push([row, i]);
            moves.push([i, col]);
            moves.push([row + i, col + i]);
            moves.push([row + i, col - i]);
            moves.push([row - i, col + i]);
            moves.push([row - i, col - i]);
          }
          return moves;
        }}
        changeMoves={this.changeMoves.bind(this)}
        ref={this.queen}
      ></Queen>
    );
  }

  createKing(row, col, color) {
    return (
      <King
        row={row}
        col={col}
        color={color}
        getMoves={(row, col) => {
          let moves = [];
          moves.push([row + 1, col]);
          moves.push([row - 1, col]);
          moves.push([row, col - 1]);
          moves.push([row, col + 1]);
          moves.push([row + 1, col + 1]);
          moves.push([row - 1, col - 1]);
          moves.push([row + 1, col - 1]);
          moves.push([row - 1, col + 1]);
          return moves;
        }}
        changeMoves={this.changeMoves.bind(this)}
        ref={this.king}
      ></King>
    );
  }

  createBlankSquare() {
    return <BlankSquare></BlankSquare>;
  }

  isValidCoordinates(row, col) {
    if (row <= 7 && row >= 0 && col <= 7 && col >= 0) {
      return true;
    }
  }

  updateCastleMoves(moves) {
    let color = this.getPieceColor(
      this.state.selectedRow,
      this.state.selectedCol
    );
    if (this.checkCastleState(color, "kingSide")) {
      if (color === "black") {
        if (this.isEmptySquare(7, 5) && this.isEmptySquare(7, 6)) {
          moves.push([7, 6]);
        }
      } else {
        if (this.isEmptySquare(0, 5) && this.isEmptySquare(0, 6)) {
          moves.push([0, 6]);
        }
      }
    }
    if (this.checkCastleState(color, "queenSide")) {
      if (color === "black") {
        if (
          this.isEmptySquare(7, 1) &&
          this.isEmptySquare(7, 2) &&
          this.isEmptySquare(7, 3)
        ) {
          moves.push([7, 2]);
        }
      } else {
        if (
          this.isEmptySquare(0, 1) &&
          this.isEmptySquare(0, 2) &&
          this.isEmptySquare(0, 3)
        ) {
          moves.push([0, 2]);
        }
      }
    }
    return moves;
  }

  setSelectedMovesWhite(moves, bool) {
    let newGrid = this.state.grid.slice();
    for (let i = 0; i < moves.length; i++) {
      if (this.isValidCoordinates(moves[i][0], moves[i][1])) {
        if (!this.isEmptySquare(moves[i][0], moves[i][1])) {
          if (
            this.isSameColor(
              this.state.selectedRow,
              this.state.selectedCol,
              moves[i][0],
              moves[i][1]
            )
          ) {
            moves.splice(i, 1);
            i = i - 1;
          }
        }
      }
    }
    moves = this.removeInvalidMoves(
      this.state.selectedRow,
      this.state.selectedCol,
      moves,
      this.state.selectedPieceName
    );
    if (this.state.selectedPieceName === "Pawn") {
      moves = this.checkPawnTake(
        this.state.selectedRow,
        this.state.selectedCol,
        moves,
        this.getPieceColor(this.state.selectedRow, this.state.selectedCol)
      );
      let enPassantMoves = this.addEnPassantMoves(
        this.state.selectedRow,
        this.state.selectedCol,
        this.getPieceColor(this.state.selectedRow, this.state.selectedCol)
      );
      for (let i = 0; i < enPassantMoves.length; i++) {
        moves.push(enPassantMoves[i]);
      }
    }
    if (this.state.selectedPieceName === "King") {
      moves = this.updateCastleMoves(moves);
    }
    for (let i = 0; i < moves.length; i++) {
      if (this.isValidCoordinates(moves[i][0], moves[i][1])) {
        let pieceAtMove = this.getPiece(moves[i][0], moves[i][1]);
        newGrid[moves[i][0]][moves[i][1]] = this.createChessSquare(
          moves[i][0],
          moves[i][1],
          this.createNode(moves[i][0], moves[i][1], pieceAtMove, bool)
        );
      }
    }
    let piece = this.getPiece(this.state.selectedRow, this.state.selectedCol);
    newGrid[this.state.selectedRow][
      this.state.selectedCol
    ] = this.createChessSquare(
      this.state.selectedRow,
      this.state.selectedCol,
      this.createNode(
        this.state.selectedRow,
        this.state.selectedCol,
        piece,
        bool
      )
    );
  }

  changeMoves(moves) {
    if (this.state.isSelected) {
      this.setSelectedMovesWhite(moves, true);
    }
    if (!this.state.isSelected) {
      this.setSelectedMovesWhite(moves, false);
    }
    this.setState({ moves: moves });
  }

  getNode(row, col) {
    return this.state.grid[row][col].Node;
  }

  getPiece(row, col) {
    return this.state.grid[row][col].Node.props.piece;
  }

  getSelectedCoordinates() {
    return [this.state.selectedRow, this.state.selectedCol];
  }

  getPieceName(row, col) {
    return this.state.grid[row][col].Node.props.piece.type.name;
  }

  getPieceColor(row, col) {
    return this.state.grid[row][col].Node.props.piece.props.color;
  }
}
