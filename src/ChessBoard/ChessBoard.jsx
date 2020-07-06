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
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      turn: "white",
      isSelected: false,
      selectedNode: undefined,
      selectedPieceName: undefined,
      availableMoves: [],
      blackCanCastle: true,
      whiteCanCastle: true,
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

  move(row, col) {
    let newGrid = this.state.grid.slice();
    let currentAvailableMoves = this.state.availableMoves;
    let enPassantMoves = undefined;
    if (this.state.selectedPieceName === "Pawn") {
      this.updateEnPassantState(row, col);
      enPassantMoves = this.addEnPassantMoves(
        this.state.selectedRow,
        this.state.selectedCol,
        this.getPieceColor(this.state.selectedRow, this.state.selectedCol)
      );
    }
    this.ifCastle(row, col);
    if (this.state.availableMoves == []) {
      return false;
    }
    //console.log(currentAvailableMoves);
    currentAvailableMoves = this.isValidMove(currentAvailableMoves);
    //if (!this.isValidMove(row, col, currentAvailableMoves)) {
    let validMove = false;
    // if (enPassantMoves == undefined) {
    //   return false;
    // }
    //console.log(currentAvailableMoves);
    console.log(this.state.selectedPieceName);
    if (this.containsMove(row, col, currentAvailableMoves)) {
      validMove = true;
    }
    if (!(enPassantMoves == undefined)) {
      if (this.containsMove(row, col, enPassantMoves)) {
        let newPiece = <BlankSquare></BlankSquare>;
        newGrid[this.state.selectedRow][col] = this.createChessSquare(
          this.state.selectedRow,
          col,
          this.createNode(this.state.selectedRow, col, newPiece, false)
        );
        validMove = true;
      }
    }
    //console.log()
    if (!validMove) {
      //console.log("invalid move");
      return false;
    }
    //}
    this.setState({ isSelected: false });
    this.updatePawnPromotionState(row, col);

    let pieceToMove = this.getPiece(
      this.state.selectedRow,
      this.state.selectedCol
    );
    this.setSelectedMovesWhite(this.state.availableMoves, false);
    newGrid[row][col] = this.createChessSquare(
      row,
      col,
      this.createNode(row, col, pieceToMove, false)
    );

    let newPiece = <BlankSquare></BlankSquare>;
    newGrid[this.state.selectedRow][
      this.state.selectedCol
    ] = this.createChessSquare(
      this.state.selectedRow,
      this.state.selectedCol,
      this.createNode(
        this.state.selectedRow,
        this.state.selectedCol,
        newPiece,
        false
      )
    );
    this.setState({ grid: newGrid });
    return true;
  }

  handleMouseDown(row, col) {
    if (this.state.isSelected) {
      if (!(this.state.selectedNode === this.getNode(row, col))) {
        if (!this.isEmptySquare(row, col)) {
          this.setSelectedNodeWhite(
            this.state.selectedRow,
            this.state.selectedCol,
            false
          );
          if (
            this.getPieceColor(
              this.state.selectedRow,
              this.state.selectedCol
            ) !== this.getPieceColor(row, col)
          ) {
            this.setState({
              selectedRow: row,
              selectedCol: col,
              selectedPieceName: this.getPieceName(row, col),
              selctedNode: this.getNode(row, col),
              mouseIsPressed: true,
              isSelected: true,
            });
          } else {
            this.setState(
              {
                selectedRow: row,
                selectedCol: col,
                selectedPieceName: this.getPieceName(row, col),
                selctedNode: this.getNode(row, col),
                mouseIsPressed: true,
                isSelected: true,
              },
              () => this.setSelectedNodeWhite(row, col, true)
            );
          }
          this.setSelectedMovesWhite(this.state.availableMoves, false);
        }
      }
      this.move(row, col);
      this.setState({
        mouseIsPressed: true,
      });
      if (!this.isDifferentSquare(row, col)) {
        this.setState({ isSelected: false }, () =>
          this.setSelectedNodeWhite(row, col, false)
        );
      }
    } else {
      if (!this.isEmptySquare(row, col)) {
        this.setState(
          {
            selectedRow: row,
            selectedCol: col,
            selectedPieceName: this.getPieceName(row, col),
            selctedNode: this.getNode(row, col),
            mouseIsPressed: true,
            isSelected: true,
          },
          () => this.setSelectedNodeWhite(row, col, true)
        );
      }
    }
    this.updatePiece(row, col);
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  render() {
    const { grid } = this.state;
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
                this.pawnPromoteQueen(this.state.pawnPromotionCoordinates)
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
                this.pawnPromoteKnight(this.state.pawnPromotionCoordinates)
              }
            ></img>
          </div>
        </Modal>
        <div className="grid">
          {grid.map((row, rowIdx) => {
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
    this.setState({ grid });
  }

  getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 8; row++) {
      const currentRow = [];
      for (let col = 0; col < 8; col++) {
        let piece = this.getStartingPiece(row, col);
        Node = this.createNode(row, col, piece, false);
        currentRow.push(this.createChessSquare(row, col, Node));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  isValidMove(availableMoves) {
    //let containsMove = this.containsMove(row, col, availableMoves);
    //let isSameColor = this.isSameColor(row, col);
    // if (this.isSameColor(row, col)) {
    //   let i = this.indexOfMove(row, col, availableMoves);
    //   availableMoves.splice(i, 1);
    // }
    for (let i = 0; i < availableMoves.length; i++) {
      if (
        !this.isValidCoordinates(availableMoves[i][0], availableMoves[i][1])
      ) {
        availableMoves.splice(i, 1);
        i = i - 1;
      }
    }
    if (
      !(
        this.state.selectedPieceName === "Knight" ||
        this.state.selectedPieceName === "Pawn"
      )
    ) {
      // let isIllegalSlant = this.isIllegalSlant(row, col);
      // let isIllegalStraight = this.isIllegalStraight(row, col);
      //console.log(availableMoves);
      console.log(availableMoves);
      availableMoves = this.isIllegalSlant(availableMoves);
      console.log(availableMoves);
      //console.log(availableMoves);
      if (!(this.state.selectedPieceName === "Bishop")) {
        availableMoves = this.isIllegalStraight(availableMoves);
      }
      // if (isIllegalSlant || isIllegalStraight) {
      //   return false;
      // }
    }
    // if (containsMove && !isSameColor) {
    //   this.setState({ isSelected: false });
    //   return true;
    // } else {
    //   return false;
    // }
    return availableMoves;
  }

  containsMove(row, col, availableMoves) {
    let containsMove = false;
    for (let i = 0; i < availableMoves.length; i++) {
      if (availableMoves[i][0] == row && availableMoves[i][1] == col) {
        containsMove = true;
      }
    }
    return containsMove;
  }

  indexOfMove(row, col, availableMoves) {
    let i = 0;
    for (i; i < availableMoves.length; i++) {
      if (availableMoves[i][0] == row && availableMoves[i][1] == col) {
        return i;
      }
    }
    return -1;
  }

  checkPawnTake(row, col, availableMoves, color) {
    if (color === "black") {
      if (this.isValidCoordinates(row - 1, col + 1)) {
        if (!this.isEmptySquare(row - 1, col + 1)) {
          if (!this.isSameColor(row - 1, col + 1, this.state)) {
            availableMoves.push([row - 1, col + 1]);
          }
        }
      }
      if (this.isValidCoordinates(row - 1, col - 1)) {
        if (!this.isEmptySquare(row - 1, col - 1)) {
          if (!this.isSameColor(row - 1, col - 1, this.state)) {
            availableMoves.push([row - 1, col - 1]);
          }
        }
      }
      if (!this.isEmptySquare(row - 1, col)) {
        availableMoves.splice(0, 1); //removes vertical take of pawn if piece ahead
      }
    } else {
      if (this.isValidCoordinates(row + 1, col + 1)) {
        if (!this.isEmptySquare(row + 1, col + 1)) {
          if (!this.isSameColor(row + 1, col + 1, this.state)) {
            availableMoves.push([row + 1, col + 1]);
          }
        }
      }
      if (this.isValidCoordinates(row + 1, col - 1)) {
        if (!this.isEmptySquare(row + 1, col - 1)) {
          if (!this.isSameColor(row + 1, col - 1, this.state)) {
            availableMoves.push([row + 1, col - 1]);
          }
        }
      }
      if (!this.isEmptySquare(row + 1, col)) {
        availableMoves.splice(0, 1); //removes vertical take of pawn if piece ahead
      }
    }
    this.setState({ availableMoves: availableMoves });
    return availableMoves;
  }

  castle(color, side) {
    let newGrid = this.state.grid.slice();
    if (color === "black") {
      if (side === "kingSide") {
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
          this.setState({ blackCanCastle: false });
        }
      } else {
        if (
          this.isEmptySquare(0, 1) &&
          this.isEmptySquare(0, 2) &&
          this.isEmptySquare(0, 3)
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
          this.setState({ blackCanCastle: false });
        }
      }
    } else {
      if (side === "kingSide") {
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
          this.setState({ whiteCanCastle: false });
        }
      } else {
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
          this.setState({ whiteCanCastle: false });
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
          this.getPieceColor(this.state.selectedRow, this.state.selectedCol)
        )
      ) {
        this.castle(
          this.getPieceColor(this.state.selectedRow, this.state.selectedCol),
          this.determineCastleSide(row, col)
        );
      }
    }
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

  updateEnPassantState(row, col) {
    if (
      this.getPieceColor(this.state.selectedRow, this.state.selectedCol) ==
      "black"
    ) {
      if (Math.abs(this.state.selectedRow - row) == 2) {
        let currentEnPassant = this.state.blackEnPassant;
        if (this.isValidCoordinates(4, col - 1)) {
          if (!this.isEmptySquare(4, col - 1)) {
            currentEnPassant[col][0] = true;
          }
        }
        if (this.isValidCoordinates(3, col + 1)) {
          if (!this.isEmptySquare(3, col + 1)) {
            currentEnPassant[col][1] = true;
          }
        }
        this.setState({ blackEnPassant: currentEnPassant });
      }
      if (this.state.selectedRow === 4) {
        let currentEnPassant = this.state.blackEnPassant;
        currentEnPassant[col] = [false, false];
        this.setState({ blackEnPassant: currentEnPassant });
      }
    } else {
      if (Math.abs(this.state.selectedRow - row) == 2) {
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

  pawnPromoteQueen(pawnPromotionCoordinates) {
    if (pawnPromotionCoordinates[0] === 0) {
      var color = "black";
    } else {
      color = "white";
    }
    let newGrid = this.state.grid.slice();
    newGrid[pawnPromotionCoordinates[0]][
      pawnPromotionCoordinates[1]
    ] = this.createChessSquare(
      pawnPromotionCoordinates[0],
      pawnPromotionCoordinates[1],
      this.createNode(
        pawnPromotionCoordinates[0],
        pawnPromotionCoordinates[1],
        this.createQueen(
          pawnPromotionCoordinates[0],
          pawnPromotionCoordinates[1],
          color
        ),
        false
      )
    );
    this.setState({ grid: newGrid, pawnPromotionModalOpen: false });
  }

  pawnPromoteKnight(pawnPromotionCoordinates) {
    if (pawnPromotionCoordinates[0] === 0) {
      var color = "black";
    } else {
      color = "white";
    }
    let newGrid = this.state.grid.slice();
    newGrid[pawnPromotionCoordinates[0]][
      pawnPromotionCoordinates[1]
    ] = this.createChessSquare(
      pawnPromotionCoordinates[0],
      pawnPromotionCoordinates[1],
      this.createNode(
        pawnPromotionCoordinates[0],
        pawnPromotionCoordinates[1],
        this.createKnight(
          pawnPromotionCoordinates[0],
          pawnPromotionCoordinates[1],
          color
        ),
        false
      )
    );
    this.setState({ grid: newGrid, pawnPromotionModalOpen: false });
  }

  isIllegalStraight(availableMoves) {
    let isIllegalJump = false;
    for (let i = 1; i <= 7; i++) {
      if (isIllegalJump) {
        let idx = this.indexOfMove(
          this.state.selectedRow,
          this.state.selectedCol + i,
          availableMoves
        );
        if (idx !== -1) {
          availableMoves.splice(idx, 1);
        }
      }
      if (
        this.isValidCoordinates(
          this.state.selectedRow,
          this.state.selectedCol + i
        )
      ) {
        if (
          !this.isEmptySquare(
            this.state.selectedRow,
            this.state.selectedCol + i
          )
        ) {
          isIllegalJump = true;
        }
      }
    }
    isIllegalJump = false;
    for (let i = 1; i <= 7; i++) {
      if (isIllegalJump) {
        let idx = this.indexOfMove(
          this.state.selectedRow,
          this.state.selectedCol - i,
          availableMoves
        );
        if (idx !== -1) {
          availableMoves.splice(idx, 1);
        }
      }
      if (
        this.isValidCoordinates(
          this.state.selectedRow,
          this.state.selectedCol - i
        )
      ) {
        if (
          !this.isEmptySquare(
            this.state.selectedRow,
            this.state.selectedCol - i
          )
        ) {
          isIllegalJump = true;
        }
      }
    }
    isIllegalJump = false;
    for (let i = 1; i <= 7; i++) {
      if (isIllegalJump) {
        let idx = this.indexOfMove(
          this.state.selectedRow + i,
          this.state.selectedCol,
          availableMoves
        );
        if (idx !== -1) {
          availableMoves.splice(idx, 1);
        }
      }
      if (
        this.isValidCoordinates(
          this.state.selectedRow + i,
          this.state.selectedCol
        )
      ) {
        if (
          !this.isEmptySquare(
            this.state.selectedRow + i,
            this.state.selectedCol
          )
        ) {
          isIllegalJump = true;
        }
      }
    }
    isIllegalJump = false;
    for (let i = 1; i <= 7; i++) {
      if (isIllegalJump) {
        let idx = this.indexOfMove(
          this.state.selectedRow - i,
          this.state.selectedCol,
          availableMoves
        );
        if (idx !== -1) {
          availableMoves.splice(idx, 1);
        }
      }
      if (
        this.isValidCoordinates(
          this.state.selectedRow - i,
          this.state.selectedCol
        )
      ) {
        if (
          !this.isEmptySquare(
            this.state.selectedRow - i,
            this.state.selectedCol
          )
        ) {
          isIllegalJump = true;
        }
      }
    }
    return availableMoves;
  }

  isIllegalSlant(availableMoves) {
    let isIllegalJump = false;
    for (let i = 1; i <= 7; i++) {
      if (isIllegalJump) {
        let idx = this.indexOfMove(
          this.state.selectedRow + i,
          this.state.selectedCol + i,
          availableMoves
        );
        if (idx !== -1) {
          availableMoves.splice(idx, 1);
        }
      }
      if (
        this.isValidCoordinates(
          this.state.selectedRow + i,
          this.state.selectedCol + i
        )
      ) {
        if (
          !this.isEmptySquare(
            this.state.selectedRow + i,
            this.state.selectedCol + i
          )
        ) {
          isIllegalJump = true;
        }
      }
    }
    isIllegalJump = false;
    for (let i = 1; i <= 7; i++) {
      if (isIllegalJump) {
        let idx = this.indexOfMove(
          this.state.selectedRow + i,
          this.state.selectedCol - i,
          availableMoves
        );
        if (idx !== -1) {
          availableMoves.splice(idx, 1);
        }
      }
      if (
        this.isValidCoordinates(
          this.state.selectedRow + i,
          this.state.selectedCol - i
        )
      ) {
        if (
          !this.isEmptySquare(
            this.state.selectedRow + i,
            this.state.selectedCol - i
          )
        ) {
          isIllegalJump = true;
        }
      }
    }
    isIllegalJump = false;
    for (let i = 1; i <= 7; i++) {
      if (isIllegalJump) {
        let idx = this.indexOfMove(
          this.state.selectedRow - i,
          this.state.selectedCol + i,
          availableMoves
        );
        if (idx !== -1) {
          availableMoves.splice(idx, 1);
        }
      }
      if (
        this.isValidCoordinates(
          this.state.selectedRow - i,
          this.state.selectedCol + i
        )
      ) {
        if (
          !this.isEmptySquare(
            this.state.selectedRow - i,
            this.state.selectedCol + i
          )
        ) {
          isIllegalJump = true;
        }
      }
    }
    isIllegalJump = false;
    for (let i = 1; i <= 7; i++) {
      if (isIllegalJump) {
        let idx = this.indexOfMove(
          this.state.selectedRow - i,
          this.state.selectedCol - i,
          availableMoves
        );
        if (idx !== -1) {
          availableMoves.splice(idx, 1);
        }
      }
      if (
        this.isValidCoordinates(
          this.state.selectedRow - i,
          this.state.selectedCol - i
        )
      ) {
        if (
          !this.isEmptySquare(
            this.state.selectedRow - i,
            this.state.selectedCol - i
          )
        ) {
          isIllegalJump = true;
        }
      }
    }
    return availableMoves;
  }

  checkCastleState(color) {
    if (color === "black") {
      if (this.state.blackCanCastle === true) {
        return true;
      }
    } else {
      if (this.state.whiteCanCastle === true) {
        return true;
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

  setSelectedNodeWhite(row, col, bool) {
    let newGrid = this.state.grid.slice();
    let piece = this.getPiece(row, col);
    newGrid[row][col] = this.createChessSquare(
      row,
      col,
      this.createNode(row, col, piece, bool)
    );
    this.setState({ grid: newGrid });
  }

  isDifferentSquare(row, col) {
    let isDifferentSquare = true;
    if (row == this.state.selectedRow && col == this.state.selectedCol) {
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

  isSameColor(row, col) {
    if (!this.isEmptySquare(row, col)) {
      if (
        this.state.grid[row][col].Node.props.piece.props.color ===
        this.state.grid[this.state.selectedRow][this.state.selectedCol].Node
          .props.piece.props.color
      ) {
        return true;
      }
    }
  }

  createChessSquare = (row, col, Node) => {
    return {
      row,
      col,
      Node,
    };
  };

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
    if (this.getPieceName(row, col) === "Pawn") {
      var newPiece = this.createPawn(row, col, piece.props.color, false, false);
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
    if (row === 1) {
      var piece = this.createPawn(row, col, "white", true, false);
    } else if (row === 0 && (col === 0 || col === 7)) {
      var piece = this.createRook(row, col, "white");
    } else if (row === 0 && (col === 1 || col === 6)) {
      var piece = this.createKnight(row, col, "white");
    } else if (row === 0 && (col === 2 || col === 5)) {
      var piece = this.createBishop(row, col, "white");
    } else if (row === 0 && col === 3) {
      var piece = this.createQueen(row, col, "white");
    } else if (row === 0 && col === 4) {
      var piece = this.createKing(row, col, "white");
    } else if (row === 6) {
      var piece = this.createPawn(row, col, "black", true, false);
    } else if (row === 7 && (col === 0 || col === 7)) {
      var piece = this.createRook(row, col, "black");
    } else if (row === 7 && (col === 1 || col === 6)) {
      var piece = this.createKnight(row, col, "black");
    } else if (row === 7 && (col === 2 || col === 5)) {
      var piece = this.createBishop(row, col, "black");
    } else if (row === 7 && col === 3) {
      var piece = this.createQueen(row, col, "black");
    } else if (row === 7 && col === 4) {
      var piece = this.createKing(row, col, "black");
    } else {
      var piece = this.createBlankSquare();
    }
    return piece;
  }

  createPawn(row, col, color, isInStartingState, canBeEnPassanted) {
    return (
      <Pawn
        row={row}
        col={col}
        color={color}
        changeAvailableMoves={this.changeAvailableMoves.bind(this)}
        isInStartingState={isInStartingState}
        canBeEnPassanted={canBeEnPassanted}
      ></Pawn>
    );
  }

  createKnight(row, col, color) {
    return (
      <Knight
        row={row}
        col={col}
        color={color}
        changeAvailableMoves={this.changeAvailableMoves.bind(this)}
      ></Knight>
    );
  }

  createBishop(row, col, color) {
    return (
      <Bishop
        row={row}
        col={col}
        color={color}
        changeAvailableMoves={this.changeAvailableMoves.bind(this)}
      ></Bishop>
    );
  }

  createRook(row, col, color) {
    return (
      <Rook
        row={row}
        col={col}
        color={color}
        changeAvailableMoves={this.changeAvailableMoves.bind(this)}
      ></Rook>
    );
  }

  createQueen(row, col, color) {
    return (
      <Queen
        row={row}
        col={col}
        color={color}
        changeAvailableMoves={this.changeAvailableMoves.bind(this)}
      ></Queen>
    );
  }

  createKing(row, col, color) {
    return (
      <King
        row={row}
        col={col}
        color={color}
        changeAvailableMoves={this.changeAvailableMoves.bind(this)}
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
    if (this.checkCastleState(color)) {
      if (color === "black") {
        if (this.isEmptySquare(7, 5) && this.isEmptySquare(7, 6)) {
          moves.push([7, 6]);
        } else if (
          this.isEmptySquare(7, 1) &&
          this.isEmptySquare(7, 2) &&
          this.isEmptySquare(7, 3)
        ) {
          moves.push([7, 1]);
        }
      } else {
        if (this.isEmptySquare(0, 5) && this.isEmptySquare(0, 6)) {
          moves.push([0, 6]);
        } else if (
          this.isEmptySquare(0, 1) &&
          this.isEmptySquare(0, 2) &&
          this.isEmptySquare(0, 3)
        ) {
          moves.push([0, 1]);
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
          if (this.isSameColor(moves[i][0], moves[i][1])) {
            moves.splice(i, 1);
            i = i - 1;
          }
        }
      }
    }
    //console.log(moves);
    moves = this.isValidMove(moves);
    //console.log(moves);
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
    //console.log(moves);
    for (let i = 0; i < moves.length; i++) {
      if (this.isValidCoordinates(moves[i][0], moves[i][1])) {
        let piece = this.getPiece(moves[i][0], moves[i][1]);
        newGrid[moves[i][0]][moves[i][1]] = this.createChessSquare(
          moves[i][0],
          moves[i][1],
          this.createNode(moves[i][0], moves[i][1], piece, bool)
        );
      }
    }
  }

  changeAvailableMoves(moves) {
    //console.log(moves);
    //moves = this.isValidMove(row, col, moves);
    //console.log(moves);
    if (this.state.isSelected) {
      this.setSelectedMovesWhite(moves, true);
    }
    if (!this.state.isSelected) {
      this.setSelectedMovesWhite(this.state.availableMoves, false);
    }
    this.setState({ availableMoves: moves });
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
