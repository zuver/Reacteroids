import React, { Component } from 'react';
import Ship from './Ship';
import Asteroid from './Asteroid';
import CharacterTable from './CharacterTable';
import TextInput from './TextInput';
import { Alphabet } from './Alphabet';
import TrieSearch from 'trie-search';
import Dictionary from './data/dictionary';
import { randomNumBetweenExcluding } from './helpers'

const KEY = {
  LEFT:  37,
  RIGHT: 39,
  UP: 38,
  SPACE: 32,
  BACKSPACE: 8,
  ENTER: 13
};

export class Reacteroids extends Component {
  constructor() {
    super();
    this.state = {
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      },
      context: null,
      keys : {
        left  : 0,
        right : 0,
        up    : 0,
        down  : 0,
        space : 0,
      },
      asteroidCount: 1,
      currentScore: 0,
      topScore: localStorage['topscore'] || 0,
      inGame: false,
      collectedCharacters: {},
      textInputValue: [],
    }
    this.ship = [];
    this.asteroids = [];
    this.bullets = [];
    this.particles = [];
    this.characters = [];
  }

  handleResize(value, e){
    this.setState({
      screen : {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      }
    });
  }

  handleKeys(value, e){
    let keys = this.state.keys;
    if(e.keyCode === KEY.LEFT) keys.left = value;
    if(e.keyCode === KEY.RIGHT) keys.right = value;
    if(e.keyCode === KEY.UP) keys.up = value;
    if(e.keyCode === KEY.SPACE) keys.space = value;

    this.setState({ keys });

    let textInputValue = this.state.textInputValue;

    // If keydown event
    if (value) {
      const lowerCaseKey = e.key.toLowerCase();
      if (Alphabet.includes(lowerCaseKey)) {
        textInputValue.push(lowerCaseKey);
        this.setState({ textInputValue });
      } else if (e.keyCode === KEY.BACKSPACE) {
        textInputValue.pop();
        this.setState({ textInputValue });
      } else if (e.keyCode === KEY.ENTER) {
        this.submitWord(this.state.textInputValue)
      }
    }
  }

  submitWord(characterArray) {
    const submittedWord = characterArray.join('');

    if (!this.isWordInDictionary(submittedWord)) {
      return;
    }

    let collectedCharactersClone = Object.assign({}, this.state.collectedCharacters);

    const canWithdrawFromCollectedCharacters =
      characterArray.every(character => {
        if (collectedCharactersClone[character] && collectedCharactersClone[character] > 0) {
          collectedCharactersClone[character]--;
          return true;
        } else {
          return false;
        }
      });

    if (canWithdrawFromCollectedCharacters) {
      this.setState({ collectedCharacters: collectedCharactersClone });
      this.onWordSuccess(submittedWord);
    }
  }

  // Checks if a given word is in the dictionary
  isWordInDictionary(word) {
    const dictionaryLookupResult = this.state.dictionary.get(word);

    return dictionaryLookupResult.length && dictionaryLookupResult[0].word === word;
  }

  // Called when the player has successfully spelled a word
  onWordSuccess(word) {
    alert('You spelled ' + word);
    this.setState({ textInputValue: [] })
  }

  componentDidMount() {
    // Load dictionary
    this.loadDictionary();

    window.addEventListener('keyup',   this.handleKeys.bind(this, false));
    window.addEventListener('keydown', this.handleKeys.bind(this, true));
    window.addEventListener('resize',  this.handleResize.bind(this, false));

    const context = this.refs.canvas.getContext('2d');
    this.setState({ context: context });
    this.startGame();
    requestAnimationFrame(() => {this.update()});
  }

  loadDictionary() {
    // Parse dictionary contents
    const wordArray = Dictionary.split('\n');

    // Map dictionary items
    const wordObjectArray =
      wordArray.map(word => {
        return { word, points: word.length }
      });

    // Construct trie data structure
    const trie = new TrieSearch('word');
    trie.addAll(wordObjectArray);

    this.setState({ dictionary: trie });
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeys);
    window.removeEventListener('keydown', this.handleKeys);
    window.removeEventListener('resize', this.handleResize);
  }

  update() {
    const context = this.state.context;
    const keys = this.state.keys;
    const ship = this.ship[0];

    context.save();
    context.scale(this.state.screen.ratio, this.state.screen.ratio);

    // Motion trail
    context.fillStyle = '#000';
    context.globalAlpha = 0.4;
    context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
    context.globalAlpha = 1;

    // If there are no asteroids and the player is alive
    if (!this.asteroids.length && this.ship.length) {
      let count = this.state.asteroidCount + 1;
      this.setState({ asteroidCount: count });
      this.generateAsteroids(count);
    }

    // Check for colisions
    this.checkCollisionsWith(this.bullets, this.asteroids);
    this.checkCollisionsWithCharacters(this.ship[0], this.characters);
    this.checkCollisionsWith(this.ship, this.asteroids);    

    // Remove or render
    this.updateObjects(this.particles, 'particles')
    this.updateObjects(this.asteroids, 'asteroids')
    this.updateObjects(this.bullets, 'bullets')
    this.updateObjects(this.ship, 'ship')
    this.updateObjects(this.characters, 'characters')

    context.restore();

    // Next frame
    requestAnimationFrame(() => {this.update()});
  }

  addScore(points){
    if(this.state.inGame){
      this.setState({
        currentScore: this.state.currentScore + points,
      });
    }
  }

  collectCharacter(character) {
    const collectedCharacters = this.state.collectedCharacters;

    if (collectedCharacters[character]) {
      collectedCharacters[character]++;
    } else {
      collectedCharacters[character] = 1;
    }

    this.setState({
      collectedCharacters
    });
  }

  startGame(){
    this.setState({
      inGame: true,
      currentScore: 0,
      collectedCharacters: {},
      textInputValue: []
    });

    // Make ship
    let ship = new Ship({
      position: {
        x: this.state.screen.width/2,
        y: this.state.screen.height/2
      },
      create: this.createObject.bind(this),
      onDie: this.gameOver.bind(this)
    });
    this.createObject(ship, 'ship');

    // Make asteroids
    this.asteroids = [];
    this.generateAsteroids(this.state.asteroidCount)

    this.characters = [];
  }

  gameOver(){
    this.setState({
      inGame: false,
    });

    // Replace top score
    if(this.state.currentScore > this.state.topScore){
      this.setState({
        topScore: this.state.currentScore,
      });
      localStorage['topscore'] = this.state.currentScore;
    }
  }

  generateAsteroids(howMany){
    let asteroids = [];
    let ship = this.ship[0];
    for (let i = 0; i < howMany; i++) {
      let asteroid = new Asteroid({
        size: 80,
        position: {
          x: randomNumBetweenExcluding(0, this.state.screen.width, ship.position.x-60, ship.position.x+60),
          y: randomNumBetweenExcluding(0, this.state.screen.height, ship.position.y-60, ship.position.y+60)
        },
        create: this.createObject.bind(this),
        addScore: this.addScore.bind(this),
        onCollectCharacter: this.collectCharacter.bind(this)
      });
      this.createObject(asteroid, 'asteroids');
    }
  }

  createObject(item, group){
    this[group].push(item);
  }

  updateObjects(items, group){
    let index = 0;
    for (let item of items) {
      if (item.delete) {
        this[group].splice(index, 1);
      }else{
        items[index].render(this.state);
      }
      index++;
    }
  }

  checkCollisionsWith(items1, items2) {
    var a = items1.length - 1;
    var b;
    for(a; a > -1; --a){
      b = items2.length - 1;
      for(b; b > -1; --b){
        var item1 = items1[a];
        var item2 = items2[b];
        if(this.checkCollision(item1, item2)){
          item1.destroy();
          item2.destroy();
        }
      }
    }
  }

  checkCollisionsWithCharacters(ship, characters) {
    if (!ship) {
      return;
    }

    characters.forEach(character => {
      if (this.checkCollision(ship, character)) {
        character.onCollected();
      }
    })
  }

  checkCollision(obj1, obj2){
    var vx = obj1.position.x - obj2.position.x;
    var vy = obj1.position.y - obj2.position.y;

    // Keep the distance squared
    // to avoid the expensive sqrt operation
    var distanceSquared = vx * vx + vy * vy;

    return distanceSquared <= Math.pow(obj1.radius + obj2.radius, 2);
  }

  render() {
    let endgame;
    let message;

    if (this.state.currentScore <= 0) {
      message = '0 points :(';
    } else if (this.state.currentScore >= this.state.topScore){
      message = 'Top score with ' + this.state.currentScore + ' points!';
    } else {
      message = this.state.currentScore + ' points';
    }

    if(!this.state.inGame){
      endgame = (
        <div className="endgame">
          <p>Game over</p>
          <p>{message}</p>
          <button
            onClick={ this.startGame.bind(this) }>
            play again?
          </button>
        </div>
      )
    }

    return (
      <div>
        { endgame }
        <span className="score" >
          <div>Top Score: {this.state.topScore}</div>
          <div>Your Score: {this.state.currentScore}</div>
        </span>
        <span className="controls" >
          Use [↑][←][↓][→] to MOVE • Use [SPACE] to SHOOT
        </span>
        <span className="text-input">
          <TextInput value={this.state.textInputValue} />
        </span>
        <span className="character-table">
          <CharacterTable characters={this.state.collectedCharacters} />
        </span>
        <canvas ref="canvas"
          width={this.state.screen.width * this.state.screen.ratio}
          height={this.state.screen.height * this.state.screen.ratio}
        />
      </div>
    );
  }
}
