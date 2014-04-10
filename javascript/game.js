exports = typeof window !== "undefined" && window !== null ? window : global;

exports.Game = function() {
  var players        = new Array(),
    places           = new Array(6),
    purses           = new Array(6),
    inPenaltyBox     = new Array(6),

    questions        = {
      "Pop":           new Array(),
      "Science":       new Array(),
      "Sports":        new Array(),
      "Rock":          new Array()
    },

    currentPlayer    = 0,
    isGettingOutOfPenaltyBox = false;

  this.didPlayerWin = function() {
    return purses[currentPlayer] != 6;
  };

  this.currentCategory = function() {
    var place = places[currentPlayer];
    if ([0, 4, 8].indexOf(place) != -1) {
      return 'Pop';
    } else if ([1, 5, 9].indexOf(place) != -1) {
      return 'Science';
    } else if ([2, 6, 10].indexOf(place) != -1) {
      return 'Sports';
    } else {
      return "Rock";
    }
  };

  this.createQuestion = function(questionType, index) {
    return questionType + " Question " + index;
  };

  this.isPlayable = function(howManyPlayers) {
    return howManyPlayers >= 2;
  };

  this.add = function(playerName) {
    players.push(playerName);
    places[this.howManyPlayers() - 1] = 0;
    purses[this.howManyPlayers() - 1] = 0;
    inPenaltyBox[this.howManyPlayers() - 1] = false;

    console.log(playerName + " was added");
    console.log("They are player number " + players.length);

    return true;
  };

  this.howManyPlayers = function() {
    return players.length;
  };


  this.askQuestion = function() {
    console.log(questions[this.currentCategory()].shift());
  };

  this.roll = function(roll) {
    console.log(players[currentPlayer] + " is the current player");
    console.log("They have rolled a " + roll);

    if (inPenaltyBox[currentPlayer]) {
      if (roll % 2 != 0) {
        isGettingOutOfPenaltyBox = true;

        console.log(players[currentPlayer] + " is getting out of the penalty box");
        places[currentPlayer] = places[currentPlayer] + roll;
        if (places[currentPlayer] > 11) {
          places[currentPlayer] = places[currentPlayer] - 12;
        }

        console.log(players[currentPlayer] + "'s new location is " + places[currentPlayer]);
        console.log("The category is " + this.currentCategory());
        this.askQuestion();
      } else {
        console.log(players[currentPlayer] + " is not getting out of the penalty box");
        isGettingOutOfPenaltyBox = false;
      }
    } else {
      places[currentPlayer] = places[currentPlayer] + roll;
      if (places[currentPlayer] > 11) {
        places[currentPlayer] = places[currentPlayer] - 12;
      }

      console.log(players[currentPlayer] + "'s new location is " + places[currentPlayer]);
      console.log("The category is " + this.currentCategory());
      this.askQuestion();
    }
  };

  this.wasCorrectlyAnswered = function() {
    var self = this;

    if (inPenaltyBox[currentPlayer]) {
      if (isGettingOutOfPenaltyBox) {
        console.log('Answer was correct!!!!');
        purses[currentPlayer] += 1;
        console.log(players[currentPlayer] + " now has " +
                    purses[currentPlayer]  + " Gold Coins.");

        var winner = this.didPlayerWin();
        currentPlayer += 1;
        if (currentPlayer == players.length) {
          currentPlayer = 0;
        }

        return winner;
      } else {
        currentPlayer += 1;
        if (currentPlayer == players.length) {
          currentPlayer = 0;
        }
        return true;
      }
    } else {
      console.log("Answer was correct!!!!");

      purses[currentPlayer] += 1;
      console.log(players[currentPlayer] + " now has " +
                  purses[currentPlayer]  + " Gold Coins.");

      var winner = this.didPlayerWin();

      currentPlayer += 1;
      if (currentPlayer == players.length) {
        currentPlayer = 0;
      }

      return winner;
    }
  };

  this.wrongAnswer = function(){
    console.log('Question was incorrectly answered');
    console.log(players[currentPlayer] + " was sent to the penalty box");
    inPenaltyBox[currentPlayer] = true;

    currentPlayer += 1;
    if (currentPlayer == players.length) {
      currentPlayer = 0;
    }
    return true;
  };

  for(var i = 0; i < 50; i++) {
    for (var questionType in questions) {
      questions[questionType].push(this.createQuestion(questionType, i));
    }
  };
};

var notAWinner = false;

var game = new Game();

game.add('Chet');
game.add('Pat');
game.add('Sue');

do{

  game.roll(Math.floor(Math.random()*6) + 1);

  if(Math.floor(Math.random()*10) == 7){
    notAWinner = game.wrongAnswer();
  }else{
    notAWinner = game.wasCorrectlyAnswered();
  }

}while(notAWinner);
