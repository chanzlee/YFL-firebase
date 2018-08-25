

//Back-End ///////////////////////////////////////////////

//TurnGame is  function objects that incorporate whole game contents objects. turngame will run the getInstance function that will intiate the game.
// Thus, Turngame ()=> getInstance (name)=> initiate(name).
var TurnGame = (function() {
  var instance;
  var initiate = function(masterName) {
    // Masters and Monsters will later be set as classes
    var master = {
      name: masterName.toUpperCase(),
      lev: 1,
      maxHp: 100,
      hp: 100,
      xp: 0,
      att: 10
    };

    //Monters is a array of objects.
    var monsters = [{
      name: 'JaeBom "Drunken" Lee',
      hp: 25 + master.lev * 3,
      att: 10 + master.lev,
      xp: 10 + master.lev,
    }, {
      name: 'SangBaek "Trinity" Shin',
      hp: 50 + master.lev * 5,
      att: 15 + master.lev * 2,
      xp: 20 + master.lev * 2,
    }, {
      name: 'Heejay "President" Kim',
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
        $("#master-level").html(" LV: "+master.lev);
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
      if (monster.name === 'JaeBom "Drunken" Lee') {
        this.message(monster.name + ": Let's have just one more round of drink! @.@");
      } else if (monster.name === 'SangBaek "Trinity" Shin') {
        this.message(monster.name + ": Umm... ");
        this.message(monster.name + ": Let me explain something very important real quick...");
        this.message(monster.name+ " has set timer for 5 minutes!");
      } else {
        this.message(monster.name+ " By construction... You can't beat me!");
      }

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
        this.message(monster.name+" is down!");
        this.message(master.name+" captured "+monster.name+".");
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
        $('#screen').html( master.name + "is Dead.. :( ");
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
    var reg1 = /\W/gi
    var reg2 = /ch.+n/gi
    var name = $("#name-input").val();
    if ( name.match(reg1)){
      alert("Please use alphabet only.");
    } else if ( name.match(reg2)){
      alert("Ha Ha. Funny. You know you can't use that name.");
    } else if (name && confirm("Hello, "+name +". Welcome to YFL Monster World...")) {
      TurnGame.getInstance(name).getXp();
      $("#game-menu").show();
    $("#start-screen").hide();
    } else {
      alert('Enter name');
    }
  });
  $("#game-menu").submit(function(event) {
    event.preventDefault();
    var menuInputValue = $("#menu-input").val();
    TurnGame.getInstance().menuInput(menuInputValue);
    $("#menu-input").val("");
  });

  $("#battle-menu").submit(function(event) {
    event.preventDefault();
    var userBattleInput = $("#battle-input").val();
    TurnGame.getInstance().battleInput(userBattleInput);
    $("#battle-input").val("");
  });
});
