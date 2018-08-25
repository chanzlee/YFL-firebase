

//Back-End ///////////////////////////////////////////////

//TurnGame is  function objects that incorporate whole game contents objects. turngame will run the getInstance function that will intiate the game.
// Thus, Turngame ()=> getInstance (name)=> initiate(name).
var TurnGame = (function() {
  var instance;
  var initiate = function(masterName) {
    // Masters and Monsters will later be set as classes
    var master = {
      name: masterName,
      lev: 1,
      maxHp: 100,
      hp: 100,
      xp: 0,
      att: 10
    };

    //Monters is a array of objects.
    var monsters = [{
      name: 'JL',
      hp: 25 + master.lev * 3,
      att: 10 + master.lev,
      xp: 10 + master.lev,
    }, {
      name: 'SB',
      hp: 50 + master.lev * 5,
      att: 15 + master.lev * 2,
      xp: 20 + master.lev * 2,
    }, {
      name: 'DG',
      hp: 200 + master.lev * 10,
      att: 25 + master.lev * 5,
      xp: 50 + master.lev * 5,
    }];

    var monster = null;
    var turn = true;
    return {
      // Basic UI functions ///////////////////////////////////////////////
      // Note that most of functions are return "this" for continued method chaining.
      getLevel: function () {
        $("#master-level").html(master.name+": LV"+master.lev);
        return this;
      },
      getXp: function () {
        var passingVar = this;
        if (master.xp > 15 * master.lev) {
          master.xp -= 15 * master.lev;
          master.maxHp += 10;
          master.hp = master.maxHp;
          master.att += master.lev;
          master.lev++;
          window.setTimeout(function() {
            passingVar.message('Level UP!');
          }, 1000);
        }
        $("#master-xp").html("XP: " + master.xp + "/" + 15 * master.lev);
        $("#master-att").html("ATT: " + master.att);
        return this.getLevel().getHp();
      },
      getHp: function () {
        if (master.hp < 0) {
          return this.gameOver();
        }
        $("#master-hp").html("HP: " + master.hp + "/" + master.maxHp);

        return this;
      },

      // No more than toggle() applied to 2 menus. should test just toggle()will work with focus() function.
      toggleMenu: function () {
        $("#master-name").html(master.name);
        $("#start-screen").hide();
        $("#game-menu").toggle();
        $("#battle-menu").toggle();
        // if ($("#game-menu").style.display === "block") {
        //   $("#game-menu").hide();
        //   $("#battle-menu").show();
        //   $("#battle-input").focus();
        //   // https://api.jquery.com/focus
        // } else {
        //   $("#game-menu").show();
        //   $("#battle-menu").hide();
        //   $("#menu-input").focus();
        // }
        return this;
      },

      message: function (msg) {
        $("#message").html(msg);
        return this;
      },

      // Basic input receiver functions ///////////////////////////////////////////////
      generateMonster: function() {
      monster = monsters[Math.floor(Math.random() * monsters.length)];
      $("#monster-name").html(monster.name);
      $("#monster-hp").html("HP: " + monster.hp);
      $("#monster-att").html("ATT: " + monster.att);
      this.message("Encountered " + monster.name + "!");
      return this.toggleMenu();
      },
      menuInput: function(input) {
        if (input === "1") {
          console.log(input);
          return this.generateMonster();
        } else if (input === "2") {
          hp = maxHp;
          return this.updateStat().message("Recovered full HP...");
        } else if (input === "3") {
          return this.exit();
        } else {
          alert("Invalid Input. Please choose among valid options.");
        }
      },
      exit: function(input) {
        $("#screen").html('"THANK YOU for playing!" -Chan Lee-');
      },

      battleInput: function (input) {
        if (input === "1") {
          return this.attackMonster();
        } else if (input === "2") {
          if (master.hp + master.lev * 20 < master.maxHp) {
            master.hp += master.lev * 20;
          } else {
            master.hp = master.maxHp;
          }
          return this.getHp().message("Recovered HP...").nextTurn();
        } else if (input === "3") {
          return this.clearMonster().message("Successfully escaped!");
        } else {
          console.log(input);
          alert("Invalid Input. Please choose among valid options.");
        }
      },
      attackMonster: function () {
        monster.hp -= master.att;
        $("#monster-hp").html( "HP: " + monster.hp);
        if (monster.hp > 0) {
          return this.message(monster.name+" got damage of "+master.att+".").nextTurn();
        }
        return this.win();
      },
      attackHero: function () {
        master.hp -= monster.att;
        return this.getHp();
      },
      nextTurn: function () {
        var passingVar = this;
        turn = !turn;
        $("#battle-button").prop("disabled") = true;
        if (!turn) {
          window.setTimeout(function () {
            passingVar.message(monster.name + "'s turn.");
            window.setTimeout(function () {
              $('#battle-button').prop("disabled") = false;
              if (passingVar.attackHero()) {
                passingVar.message(master.name+" got damage of "+monster.att+"." );
                window.setTimeout(function () {
                  passingVar.message(master.name + "'s turn.");
                }, 1000);
              }
            }, 1000);
          }, 1000);
          return this.nextTurn();
        }
        return this;
      },
      win: function () {
        this.message(master.name+" gained "+monster.xp+" through the battle.");
        master.xp += monster.xp;
        return this.clearMonster().getXp();
      },
      clearMonster: function () {
        monster = null;
        $("#monster-name").html("");
        $("#monster-hp").html("");
        $("#monster-att").html("");
        return this.toggleMenu();
      },
      gameOver: function () {
        $('#screen').html( master.name + "is Dead.. ㅠ.ㅠ ");
        return false;
      }
    };
    // end initate return bracket
  };
  // end initiate function bracket

  return {
    getInstance: function(name) {
      if (!instance) {
        instance = initiate(name);
      }
      return instance;
    }
  };
  // end turnGame function bracket
})();
// end turnGame function bracket


// Front-end ///////////////////////////////////////

$(document).ready(function() {
  $("#game-menu").hide();
  $("#battle-menu").hide();

  $("#start-screen").submit(function (event) {
    event.preventDefault();
    var name = $("#name-input").val();
    if (name && confirm(name + '?')) {
      TurnGame.getInstance(name).getXp();
      $("#game-menu").show();
    } else {
      alert('Enter name');
    }
  });
  $("#game-menu").submit(function(event) {
    event.preventDefault();
    var menuInputValue = $("#menu-input").val();
    console.log(menuInputValue);
    TurnGame.getInstance().menuInput(menuInputValue);
    $("#menu-input").val("");
  });

  $("#battle-menu").submit(function(event) {
    event.preventDefault();
    var userBattleInput = $("#battle-input").val();
    console.log(userBattleInput);
    TurnGame.getInstance().battleInput(userBattleInput);
    $("#battle-input").val("");
  });
});
