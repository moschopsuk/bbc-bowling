'use strict';

/*
 * Creates a new plauer object
 */

var Player = function (name) {
    this.name 		= name;
    this.frame 		= 0;
    this.bowls 		= [];

    this.reset();
};

/*
 * Resets current player data 
 */
Player.prototype.reset = function() {
    this.frame = 0;
    for (var i=0; i<23; i++) {
        this.bowls[i] = 0;
    }
};

/*
 * Player performs a bowl
 */
Player.prototype.roll  = function (pin) {

    this.bowls[this.frame] = pin;

    //If we have a strike or we are not
    //at the end of the game we continue
    if (pin == 10 && this.frame < 17) {
        this.frame++; // no need to play second frame in frame
    }

    this.frame++;
};

/*
 * Gets all the scores upto a current frame
 */

Player.prototype.score = function(maxFrame) {

    var score = 0;
    
    //If the argu is null we assume frame 10
    maxFrame = (maxFrame == null ) && 10;

    for (var f =0;f < maxFrame ; f++ ) {
        score += this.frameScore(f);
    }
    return score;
};

/*
 * Check if the frame is a strike
 */
Player.prototype.frameIsStrike = function (f) {

    return this.bowls[f*2] === 10;
};

/*
 * Check if the frame is a spare
 */
Player.prototype.frameIsSpare = function (f) {

    return !this.frameIsStrike(f) && (this.bowls[f*2] + this.bowls[f*2+1] === 10);
};

/*
 * Check if the frame is not a spare or stike
 */
Player.prototype.frameIsNormal = function (f) {
    
    return  (this.bowls[f*2] + this.bowls[f*2+1] < 10);
};

/*
 * converst a frame score to a text value 
 */
Player.prototype.frameText = function (f,i) {
    
    //If there is no value
    if ((f*2+i)>=this.frame) {
        return "."; 
    }

    //If the score is a strike
    if (this.frameIsStrike(f) && f<9) {
        if (i == 0) { return "" }
        return "X";
    }

    //If the score is a spare
    if (this.frameIsSpare(f)) {
        if (i==0) { return this.bowls[f*2] }
        return "/";
    }

    //Fallback just print the score number
    return this.bowls[f*2+i];
};

/*
 * Gets the remainding pins that are still standing
 */
Player.prototype.standingPins  = function () {

	//At the start of each frame we assume all 10 pins are up
    if (this.frame %2 == 0) { 
        return 10;
    }
    
    //Handle the last frame
    if (this.frame == 19  && this.bowls[this.frame-1]==10) {
       return 10;
    }

    //Get the score of the last frame
    return 10 - this.bowls[this.frame-1];
}

/*
 * Gets the total score for a frame
 */
Player.prototype.frameScore = function (f) {
    var score = 0;

    //If the last frame we have to include an addional shot
    if (f === 9)  {
        score += this.bowls[f*2] + this.bowls[f*2+1] + this.bowls[f*2+2];
    } else if (this.frameIsStrike(f)) {
        if (this.frameIsStrike(f+1) ) {
        	//the score of the strike plus the sum of the next score
            score += 20 + this.bowls[(f+2)*2];
        } else {
        	//the score of the strike plus the sum of the next score
            score += 10 + this.bowls[(f+1)*2] + this.bowls[(f+1)*2+1];
        }
    } else if (this.frameIsSpare(f)) {
    	//Include the spare plus the sum of the next score
        score += 10 + this.bowls[(f+1)*2];
    } else {
        score += this.bowls[f*2] + this.bowls[f*2+1];
    }
    return score;
};

/*
 * Returns an array of the scores the player
 * has bowled so far
 */
Player.prototype.scoreString = function() {

    var r = [];
    //For frames 1-9
    for (var f =0;f < 10 ; f++ ) {
        r.push(this.frameText(f,0));
        r.push(this.frameText(f,1));
    }

    //Add addional value for the last frame
    r.push(this.frameText(9,2));
    return r;
}