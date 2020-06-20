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

export default class ChessBoard extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      isSelected: false,
      selectedNode: undefined,
      selectedPieceName: undefined,
      availableMoves: [],
      blackHasCastled: false,
      whiteHasCastled: false,
      selectedRow: undefined,
      selectedCol: undefined,
    };
  }

  isValidCoordinates(row, col) {
    if (row <= 7 && row >= 0 && col <= 7 && col >= 0) {
      return true;
    }
  }

  checkPawnTake(row, col, availableMoves) {
    let availableMoves2 = availableMoves;
    if (this.getPieceColor(row, col) === "black") {
      if (this.isValidCoordinates(row - 1, col + 1)) {
        if (!this.isEmptySquare(row - 1, col + 1)) {
          if (!this.isSameColor(row - 1, col + 1, this.state)) {
            availableMoves2.push([row - 1, col + 1]);
          }
        }
      }
      if (this.isValidCoordinates(row - 1, col - 1)) {
        if (!this.isEmptySquare(row - 1, col - 1)) {
          if (!this.isSameColor(row - 1, col - 1, this.state)) {
            availableMoves2.push([row - 1, col - 1]);
          }
        }
      }
      if (!this.isEmptySquare(row - 1, col)) {
        availableMoves2.splice(0, 1); //removes vertical take of pawn if piece ahead
      }
    } else {
      if (this.isValidCoordinates(row + 1, col + 1)) {
        if (!this.isEmptySquare(row + 1, col + 1)) {
          if (!this.isSameColor(row + 1, col + 1, this.state)) {
            availableMoves2.push([row + 1, col + 1]);
          }
        }
      }
      if (this.isValidCoordinates(row + 1, col - 1)) {
        if (!this.isEmptySquare(row + 1, col - 1)) {
          if (!this.isSameColor(row + 1, col - 1, this.state)) {
            availableMoves2.push([row + 1, col - 1]);
          }
        }
      }
      if (!this.isEmptySquare(row + 1, col)) {
        availableMoves2.splice(0, 1); //removes vertical take of pawn if piece ahead
      }
    }
    this.setState({ availableMoves: availableMoves2 });
    return availableMoves2;
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
          console.log("to the right");
          if (!this.isEmptySquare(row, this.state.selectedCol + i)) {
            isIllegalStraight = true;
          }
        }
      } else {
        console.log("to the here");
        for (let i = 1; i < this.state.selectedCol - col; i++) {
          console.log("to the left");
          if (!this.isEmptySquare(row, this.state.selectedCol - i)) {
            isIllegalStraight = true;
          }
        }
      }
    } else {
      if (this.state.selectedRow < row) {
        for (let i = 1; i < row - this.state.selectedRow; i++) {
          console.log("down");
          if (!this.isEmptySquare(this.state.selectedRow + i, col)) {
            isIllegalStraight = true;
          }
        }
      } else {
        for (let i = 1; i < this.state.selectedRow - row; i++) {
          console.log("up");
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
          console.log("down to right");
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
          console.log("down to left");
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
          console.log("up to right");
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
          console.log("up to left");
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

  validMove(row, col, availableMoves) {
    let containsMove = this.containsMove(row, col, availableMoves);
    let isSameColor = this.isSameColor(row, col);
    let isIllegalSlant = this.isIlegalSlant(row, col);
    let isIllegalStraight = this.isIllegalStraight(row, col);
    if (containsMove && !isSameColor && !isIllegalSlant && !isIllegalStraight) {
      this.setState({ isSelected: false });
      return true;
    } else {
      return false;
    }
  }

  isDifferentSquare(row, col) {
    let isDifferentSquare = true;
    if (row == this.state.selectedRow && col == this.state.selectedCol) {
      isDifferentSquare = false;
    }
    return isDifferentSquare;
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

  move(row, col) {
    let currentAvailableMoves = this.state.availableMoves;
    if (this.state.selectedPieceName === "Pawn") {
      this.checkPawnTake(
        this.state.selectedRow,
        this.state.selectedCol,
        this.state.availableMoves
      );
    }
    if (!this.validMove(row, col, currentAvailableMoves)) {
      return false;
    }
    let newGrid = this.state.grid.slice();
    let pieceToMove = this.getPiece(
      this.state.selectedRow,
      this.state.selectedCol
    );
    let newPiece = <BlankSquare></BlankSquare>;

    newGrid[row][col] = this.createChessSquare(
      row,
      col,
      this.createNode(row, col, pieceToMove, false)
    );
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
      this.move(row, col);
      this.setState({
        mouseIsPressed: true,
      });
      if (!this.isDifferentSquare(row, col)) {
        this.setState({ isSelected: false });
      }
    } else {
      if (!this.isEmptySquare(row, col)) {
        this.setState({
          selectedRow: row,
          selectedCol: col,
          selectedPieceName: this.getPieceName(row, col),
          selctedNode: this.getNode(row, col),
          mouseIsPressed: true,
          isSelected: true,
        });
        this.updatePiece(row, col);
      }
    }
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  isEmptySquare(row, col) {
    if (this.getPieceName(row, col) === "BlankSquare") {
      return true;
    }
  }

  render() {
    const { grid } = this.state;
    return (
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

  // setSelectedNodeWhite(row, col) {
  //   let newGrid = this.state.grid.slice();
  //   let piece = this.getPiece(row, col);
  //   newGrid[row][col] = this.createChessSquare(
  //     row,
  //     col,
  //     this.createNode(row, col, piece, true)
  //   );
  //   this.setState({ grid: newGrid });
  // }

  updatePiece(row, col) {
    let piece = this.state.grid[row][col].Node.props.piece;
    if (this.getPieceName(row, col) === "Pawn") {
      var newPiece = this.createPawn(row, col, piece.props.color, false);
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
      var piece = this.createPawn(row, col, "white", true);
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
      var piece = this.createPawn(row, col, "black", true);
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

  createPawn(row, col, color, isInStartingState) {
    return (
      <Pawn
        row={row}
        col={col}
        color={color}
        changeAvailableMoves={this.changeAvailableMoves.bind(this)}
        getSelectedCoordinates={this.getSelectedCoordinates.bind(this)}
        isInStartingState={isInStartingState}
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
