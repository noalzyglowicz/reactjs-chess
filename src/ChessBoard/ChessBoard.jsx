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
      availableMoves: [],
    };
  }

  move(row, col) {
    if (!this.validMove(row, col, this.state)) {
      return false;
    }

    let pieceToMove = this.state.grid[this.state.clickedCoordinates[0]][
      this.state.clickedCoordinates[1]
    ].Node.props.piece;
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
    let isDifferentSquare = this.isDifferentSquare(row, col, state);
    let containsMove = this.containsMove(row, col, state);
    let isSameColor = this.isSameColor(row, col, state);
    if (containsMove && isDifferentSquare && !isSameColor) {
      return true;
    } else {
      return false;
    }
  }

  isDifferentSquare(row, col, state) {
    let isDifferentSquare = true;
    if (
      row == state.clickedCoordinates[0] &&
      col == state.clickedCoordinates[1]
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
    if (!(state.grid[row][col].Node.props.piece.type.name === "BlankSquare")) {
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
    let piece = this.state.grid[row][col].Node.props.piece;
    if (this.state.grid[row][col].Node.props.piece.type.name === "Pawn") {
      var newPiece = this.createPawn(row, col, piece.props.color);
    } else if (
      this.state.grid[row][col].Node.props.piece.type.name === "Rook"
    ) {
      newPiece = this.createRook(row, col, piece.props.color);
    } else if (
      this.state.grid[row][col].Node.props.piece.type.name === "Knight"
    ) {
      newPiece = this.createKnight(row, col, piece.props.color);
    } else if (
      this.state.grid[row][col].Node.props.piece.type.name === "Bishop"
    ) {
      newPiece = this.createBishop(row, col, piece.props.color);
    } else if (
      this.state.grid[row][col].Node.props.piece.type.name === "Queen"
    ) {
      newPiece = this.createQueen(row, col, piece.props.color);
    } else if (
      this.state.grid[row][col].Node.props.piece.type.name === "King"
    ) {
      newPiece = this.createKing(row, col, piece.props.color);
    } else {
      newPiece = this.createBlankSquare();
    }
    this.state.grid[row][col] = this.createChessSquare(
      row,
      col,
      this.createNode(row, col, newPiece)
    );

    if (this.state.isClicked) {
      this.move(row, col);
    }
    if (this.state.isClicked) {
      this.setState({
        mouseIsPressed: true,
        isClicked: false,
      });
    } else {
      this.setState({
        clickedCoordinates: [row, col],
        mouseIsPressed: true,
        isClicked: true,
      });
    }
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
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

  getClickedCoordinates() {
    return this.state.clickedCoordinates;
  }
}
