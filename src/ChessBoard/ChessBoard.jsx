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
    if (this.state.selectedPieceName === "Pawn") {
      currentAvailableMoves = this.checkPawnTake(
        this.state.selectedRow,
        this.state.selectedCol,
        this.getPieceColor(this.state.selectedRow, this.state.selectedCol)
      );
      this.updateEnPassantState(row, col);
      var enPassantMoves = this.addEnPassantMoves(
        this.state.selectedRow,
        this.state.selectedCol,
        this.getPieceColor(this.state.selectedRow, this.state.selectedCol)
      );
    }
    this.ifCastle(col);
    if (this.state.availableMoves == []) {
      return false;
    }
    if (!this.isValidMove(row, col, currentAvailableMoves)) {
      let validMove = false;
      if (enPassantMoves == undefined) {
        return false;
      }
      if (this.containsMove(row, col, enPassantMoves)) {
        let newPiece = <BlankSquare></BlankSquare>;
        newGrid[this.state.selectedRow][col] = this.createChessSquare(
          this.state.selectedRow,
          col,
          this.createNode(this.state.selectedRow, col, newPiece, false)
        );
        validMove = true;
      }
      if (!validMove) {
        return false;
      }
    }
    this.updatePawnPromotionState(row, col);

    let pieceToMove = this.getPiece(
      this.state.selectedRow,
      this.state.selectedCol
    );
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
          this.unselectNodeWhite(
            this.state.selectedRow,
            this.state.selectedCol
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
              () => this.setSelectedNodeWhite(row, col)
            );
          }
        }
      }
      this.move(row, col);
      this.setState({
        mouseIsPressed: true,
      });
      if (!this.isDifferentSquare(row, col)) {
        this.setState({ isSelected: false }, () =>
          this.unselectNodeWhite(row, col)
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
          () => this.setSelectedNodeWhite(row, col)
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
    //console.log(this.state.pawnPromotionModalOpen);
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

  isValidMove(row, col, availableMoves) {
    let containsMove = this.containsMove(row, col, availableMoves);
    let isSameColor = this.isSameColor(row, col);
    if (!(this.state.selectedPieceName === "Knight")) {
      let isIllegalSlant = this.isIlegalSlant(row, col);
      let isIllegalStraight = this.isIllegalStraight(row, col);
      if (isIllegalSlant || isIllegalStraight) {
        return false;
      }
    }
    if (containsMove && !isSameColor) {
      this.setState({ isSelected: false });
      return true;
    } else {
      return false;
    }
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

  checkPawnTake(row, col, color) {
    let availableMoves = this.state.availableMoves;
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

  ifCastle(col) {
    if (this.state.selectedPieceName === "King") {
      if (
        this.canCastle(
          this.getPieceColor(this.state.selectedRow, this.state.selectedCol)
        )
      ) {
        this.castle(
          this.getPieceColor(this.state.selectedRow, this.state.selectedCol),
          this.determineCastleSide(col)
        );
      }
    }
  }

  // ifEnPassant(col, row) {
  //   if (color === "black") {
  //     if(() &&())
  //   } else {
  //   }
  // }

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
        if (this.isValidCoordinates(3, col - 1)) {
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

  isIllegalStraight(row, col) {
    if (
      !(row === this.state.selectedRow) &&
      !(col === this.state.selectedCol)
    ) {
      return false;
    }
    let isIllegalStraight = false;
    if (row === this.state.selectedRow) {
      if (this.state.selectedCol < col) {
        for (let i = 1; i < col - this.state.selectedCol; i++) {
          if (!this.isEmptySquare(row, this.state.selectedCol + i)) {
            isIllegalStraight = true;
          }
        }
      } else {
        for (let i = 1; i < this.state.selectedCol - col; i++) {
          if (!this.isEmptySquare(row, this.state.selectedCol - i)) {
            isIllegalStraight = true;
          }
        }
      }
    } else {
      if (this.state.selectedRow < row) {
        for (let i = 1; i < row - this.state.selectedRow; i++) {
          if (!this.isEmptySquare(this.state.selectedRow + i, col)) {
            isIllegalStraight = true;
          }
        }
      } else {
        for (let i = 1; i < this.state.selectedRow - row; i++) {
          if (!this.isEmptySquare(this.state.selectedRow - i, col)) {
            isIllegalStraight = true;
          }
        }
      }
    }
    return isIllegalStraight;
  }

  isIlegalSlant(row, col) {
    if (row === this.state.selectedRow || col === this.state.selectedCol) {
      return false;
    }
    let isIlegalJump = false;
    if (this.state.selectedRow < row) {
      if (this.state.selectedCol < col) {
        for (let i = 1; i < row - this.state.selectedRow; i++) {
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
              isIlegalJump = true;
            }
          }
        }
      } else {
        for (let i = 1; i < row - this.state.selectedRow; i++) {
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
              isIlegalJump = true;
            }
          }
        }
      }
    } else {
      if (this.state.selectedCol < col) {
        for (let i = 1; i < this.state.selectedRow - row; i++) {
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
              isIlegalJump = true;
            }
          }
        }
      } else {
        for (let i = 1; i < this.state.selectedRow - row; i++) {
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
              isIlegalJump = true;
            }
          }
        }
      }
    }
    return isIlegalJump;
  }

  canCastle(color) {
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

  determineCastleSide(col) {
    if (col === 6) {
      var side = "kingSide";
    } else {
      side = "queenSide";
    }
    return side;
  }

  setSelectedNodeWhite(row, col) {
    let newGrid = this.state.grid.slice();
    let piece = this.getPiece(row, col);
    newGrid[row][col] = this.createChessSquare(
      row,
      col,
      this.createNode(row, col, piece, true)
    );
    this.setState({ grid: newGrid });
  }

  unselectNodeWhite(row, col) {
    let newGrid = this.state.grid.slice();
    let piece = this.getPiece(row, col);
    newGrid[row][col] = this.createChessSquare(
      row,
      col,
      this.createNode(row, col, piece, false)
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
        getSelectedCoordinates={this.getSelectedCoordinates.bind(this)}
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
        getSelectedCoordinates={this.getSelectedCoordinates.bind(this)}
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
        getSelectedCoordinates={this.getSelectedCoordinates.bind(this)}
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
        getSelectedCoordinates={this.getSelectedCoordinates.bind(this)}
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
        selectedCoordinates={this.getSelectedCoordinates.bind(this)}
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
        getSelectedCoordinates={this.getSelectedCoordinates.bind(this)}
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

  changeAvailableMoves(moves) {
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
