'use strict';

var Player = function (name) {
    this.name = name;
    this.rolls = [];
    this.round = 0;

    this.reset();
};

Player.prototype.reset = function() {
    this.round = 0;
    for (var i=0;i<23;i++) {
        this.rolls[i] = 0;
    }
};


Player.prototype.roll  = function (pin) {

    this.rolls[this.round] = pin;

    if (pin == 10 && this.round < 17) {
        this.round++; // no need to play second round in frame
    }

    this.round++;
};

Player.prototype.score = function(maxFrame) {

    var score = 0;
    
    maxFrame = (maxFrame == null ) && 10;

    for (var f =0;f < maxFrame ; f++ ) {
        score += this.frameScore(f);
    }
    return score;
};

Player.prototype.frameIsStrike = function (f) {

    return this.rolls[f*2] === 10;
};

Player.prototype.frameIsSpare = function (f) {

    return !this.frameIsStrike(f) && (this.rolls[f*2] + this.rolls[f*2+1] === 10);
};

Player.prototype.frameIsNormal = function (f) {
    
    return  (this.rolls[f*2] + this.rolls[f*2+1] < 10);
};

Player.prototype.frameText = function (f,i) {
    
    if ((f*2+i)>=this.round) {
        return "."; 
    }
    if (this.frameIsStrike(f) && f<9) {
        if (i==0) { return "" }
        return "X";
    }
    if (this.frameIsSpare(f)) {
        if (i==0) { return this.rolls[f*2] }
        return "/";
    }
    return this.rolls[f*2+i];
};

Player.prototype.standingPins  = function () {

    // returns the number of standing pins
    if (this.round%2 ==0) { 
        return 10;
    }
    
    if (this.round == 19  && this.rolls[this.round-1]==10) {
       // last round
       return 10;
    }
    return 10 - this.rolls[this.round-1];
}

Player.prototype.frameScore = function (f) {
    var score = 0;

    if (f === 9)  {
        
        score += this.rolls[f*2] + this.rolls[f*2+1] + this.rolls[f*2+2];

    } else if (this.frameIsStrike(f)) {

        if (this.frameIsStrike(f+1) ) {

            score += 20 + this.rolls[(f+2)*2];
        } else {
            score += 10 + this.rolls[(f+1)*2] + this.rolls[(f+1)*2+1];
        }

    } else if (this.frameIsSpare(f)) {

        score += 10 + this.rolls[(f+1)*2];

    } else {

        score += this.rolls[f*2] + this.rolls[f*2+1];

    }
    return score;
};


Player.prototype.scoreString = function() {

    var r = [];
    for (var f =0;f < 10 ; f++ ) {
        r.push(this.frameText(f,0));
        r.push(this.frameText(f,1));
    }
    r.push(this.frameText(9,2));
    return r;
}