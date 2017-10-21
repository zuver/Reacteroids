import React from 'react';
import Alphabet from './Alphabet';
import { randomNumBetween } from './helpers';

export default class Character {
  constructor(args) {
    this.value = Alphabet[Math.floor(randomNumBetween(0, Alphabet.length - 1))];
    this.position = args.position;
    this.radius = 10;
    this.asteroid = args.asteroid;
    this.onCollectCharacter = args.onCollectCharacter;
  }

  onCollected() {
    this.delete = true;
    this.onCollectCharacter(this.value);
  }

  render(state) {
    // Set position to asteroid position
    this.position = this.asteroid.position;

    const context = state.context;
    context.save();
    context.translate(this.position.x, this.position.y);
    context.fillStyle = 'yellow';
    context.font = '20px serif';
    context.fillText(this.value, -5, 5);
    context.restore();
  }
}
