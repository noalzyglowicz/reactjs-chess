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
      isClicked: false,
      clickedCoordinates: [],
      clickedPieceName: undefined,
      availableMoves: [],
    };
  }

  checkPawnTake(row, col) {
    let currentAvailableMoves = this.state.availableMoves;
    if (this.getPieceColor(row, col) === "Black") {
      if (!this.isEmptySquare(row - 1, col + 1)) {
        if (!this.isSameColor(row - 1, col + 1, this.state)) {
          currentAvailableMoves.push([row - 1, col + 1]);
          console.log("here");
        }
      }
      if (!this.isEmptySquare(row - 1, col - 1)) {
        if (!this.isSameColor(row - 1, col - 1, this.state)) {
          currentAvailableMoves.push([row - 1, col - 1]);
          console.log("here");
        }
      }
    } else {
      if (!this.isEmptySquare(row + 1, col + 1)) {
        if (!this.isSameColor(row + 1, col + 1, this.state)) {
          currentAvailableMoves.push([row - 1, col + 1]);
          console.log("here");
        }
      }
      if (!this.isEmptySquare(row + 1, col - 1)) {
        if (!this.isSameColor(row + 1, col - 1, this.state)) {
          currentAvailableMoves.push([row + 1, col - 1]);
          console.log("here");
        }
      }
    }
    this.setState({ availableMoves: currentAvailableMoves });
  }

  move(row, col) {
    if (this.state.clickedPieceName === "Pawn") {
      this.checkPawnTake(row, col);
    }
    if (!this.validMove(row, col, this.state)) {
      return false;
    }
    let pieceToMove = this.getPiece(
      this.state.clickedCoordinates[0],
      this.state.clickedCoordinates[1]
    );
    let newPiece = <BlankSquare></BlankSquare>;

    this.state.grid[row][col] = this.createChessSquare(
      col,
      row,
      this.createNode(row, col, pieceToMove)
    );
    this.state.grid[this.state.clickedCoordinates[0]][
      this.state.clickedCoordinates[1]
    ] = this.createChessSquare(
      this.state.clickedCoordinates[1],
      this.state.clickedCoordinates[0],
      this.createNode(
        this.state.clickedCoordinates[0],
        this.state.clickedCoordinates[1],
        newPiece
      )
    );
    return true;
  }

  validMove(row, col, state) {
    let containsMove = this.containsMove(row, col, state);
    let isSameColor = this.isSameColor(row, col, state);
    if (containsMove && !isSameColor) {
      return true;
    } else {
      return false;
    }
  }

  isDifferentSquare(row, col) {
    let isDifferentSquare = true;
    if (
      row == this.state.clickedCoordinates[0] &&
      col == this.state.clickedCoordinates[1]
    ) {
      isDifferentSquare = false;
    }
    return isDifferentSquare;
  }

  containsMove(row, col, state) {
    let containsMove = false;
    for (let i = 0; i < state.availableMoves.length; i++) {
      if (
        state.availableMoves[i][0] == row &&
        state.availableMoves[i][1] == col
      ) {
        containsMove = true;
      }
    }
    return containsMove;
  }

  isSameColor(row, col, state) {
    if (!this.isEmptySquare(row, col)) {
      if (
        state.grid[row][col].Node.props.piece.props.color ===
        state.grid[state.clickedCoordinates[0]][state.clickedCoordinates[1]]
          .Node.props.piece.props.color
      ) {
        return true;
      }
    }
  }

  handleMouseDown(row, col) {
    if (this.state.isClicked) {
      this.move(row, col);
    }
    if (this.state.isClicked) {
      this.setState({
        mouseIsPressed: true,
      });
      if (
        this.validMove(row, col, this.state) ||
        !this.isDifferentSquare(row, col)
      ) {
        this.setState({ isClicked: false });
      }
    } else {
      if (!this.isEmptySquare(row, col)) {
        this.setState({
          clickedCoordinates: [row, col],
          clickedPieceName: this.getPieceName(row, col),
          mouseIsPressed: true,
          isClicked: true,
        });
        this.updatePiece(row, col);
      }
    }
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  isEmptySquare(row, col, state) {
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
        Node = this.createNode(row, col, piece);
        currentRow.push(this.createChessSquare(col, row, Node));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  createChessSquare = (col, row, Node) => {
    return {
      row,
      col,
      Node,
    };
  };

  createNode(row, col, piece) {
    return (
      <Node
        key={col}
        row={row}
        col={col}
        piece={piece}
        onMouseDown={() => this.handleMouseDown(row, col)}
        onMouseUp={() => this.handleMouseUp(row, col)}
      ></Node>
    );
  }

  updatePiece(row, col) {
    let piece = this.state.grid[row][col].Node.props.piece;
    if (this.getPieceName(row, col) === "Pawn") {
      var newPiece = this.createPawn(row, col, piece.props.color);
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
    this.state.grid[row][col] = this.createChessSquare(
      row,
      col,
      this.createNode(row, col, newPiece)
    );
  }

  getStartingPiece(row, col) {
    if (row === 1) {
      var piece = this.createPawn(row, col, "white");
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
      var piece = this.createPawn(row, col, "black");
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

  createPawn(row, col, color) {
    return (
      <Pawn
        row={row}
        col={col}
        color={color}
        changeAvailableMoves={this.changeAvailableMoves.bind(this)}
        getClickedCoordinates={this.getClickedCoordinates.bind(this)}
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
        getClickedCoordinates={this.getClickedCoordinates.bind(this)}
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
        getClickedCoordinates={this.getClickedCoordinates.bind(this)}
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
        getClickedCoordinates={this.getClickedCoordinates.bind(this)}
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
        getClickedCoordinates={this.getClickedCoordinates.bind(this)}
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
        getClickedCoordinates={this.getClickedCoordinates.bind(this)}
      ></King>
    );
  }

  createBlankSquare() {
    return <BlankSquare></BlankSquare>;
  }

  changeAvailableMoves(moves) {
    this.setState({ availableMoves: moves });
  }

  getPiece(row, col) {
    return this.state.grid[row][col].Node.props.piece;
  }

  getClickedCoordinates() {
    return this.state.clickedCoordinates;
  }

  getPieceName(row, col) {
    return this.state.grid[row][col].Node.props.piece.type.name;
  }

  getPieceColor(row, col) {
    return this.state.grid[row][col].Node.props.piece.props.color;
  }
}
