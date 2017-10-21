import React, { Component } from 'react';

class CharacterTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const collectedCharacters = Object.keys(this.props.characters);

    const alphabetCells = collectedCharacters.map((character, index) => {
      return <td key={index}>{character}</td>
    });

    const characterCounts = collectedCharacters.map((character, index) => {
      return <td key={index}>{this.props.characters[character]}</td>
    });

    return (
      <table>
        <tbody>
          <tr>
            {alphabetCells}
          </tr>
          <tr>
            {characterCounts}
          </tr>
        </tbody>
      </table>
    );
  }
}

export default CharacterTable;
