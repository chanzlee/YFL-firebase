// Front-end ///////////////////////////////////////

$(document).ready(function() {
  $("#game-menu").hide();
  $("#battle-menu").hide();
  $("#menu-button").submit(function(event) {
    event.preventDefault();
    var menuInputValue = $("#menu-input").val();
    console.log(menutInputValue);
    // TurnGame.getInstance().menuInput(menuInputValue);
    $("#menu-input").val("");
  });

  $("#battle-button").submit(function(event) {
    event.preventDefault();
    var userBattleInput = $("battle-input").val();
    $("battle-input").val("");
    //TurnGame.getInstance().battleInput(userBattleInput);
  });
});


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
      return {
        // Basic UI functions ///////////////////////////////////////////////
        // Note that most of functions are return "this" for continued method chaining.
        getLevel: function () {
          $("#master-level").html(master.lev + 'lev');
          return this;
        },
        getXp: function () {
          var currentPlayer = this;
          if (master.xp > 15 * master.lev) {
            master.xp -= 15 * master.lev;
            master.maxHp += 10;
            master.hp = master.maxHp;
            master.att += master.lev;
            master.lev++;
            window.setTimeout(function() {
              currentPlayer.message('Level UP!');
            }, 1000);
          }
          $('#master-xp').html('XP: ' + master.xp + '/' + 15 * master.lev);
          $('#master-att').html('ATT: ' + master.att);
          return this.getLevel().getHp();
        },
        getHp: function () {
          if (master.hp < 0) {
            return this.gameOver();
          }
          $('#master-hp').html('HP: ' + master.hp + '/' + master.maxHp);

          return this;
        },

        // No more than toggle() applied to 2 menus. should test just toggle()will work with focus() function.
        toggleMenu: function () {
          $('#master-name').html(master.name);
          $('#start-screen').hide();
          if ($('#game-menu').style.display === 'block') {
            $('#game-menu').hide();
            $('#battle-menu').show();
            $('#battle-input').focus();
            // https://api.jquery.com/focus
          } else {
            $('#game-menu').show();
            $('#battle-menu').hide();
            $('#menu-input').focus();
          }
          return this;
        },

        message: function (msg) {
          $('message').html(msg);
          return this;
        },

        // Basic input receiver functions ///////////////////////////////////////////////
        generateMonster: function() {
        monster = monsters[Math.floor(Math.random() * monsters.length)];
        $('monster-name').html(monster.name);
        $('monster-hp').html('HP: ' + monster.hp);
        $('monster-att').html('ATT: ' + monster.att);
        // this.message("Encountered " + monster.name + "!");
        // return this.toggleMenu();
      },
      menuInput: function(input) {
        if (input === '1') {
          return this.generateMonster();
        } else if (input === '2') {
          hp = maxHp;
          return this.updateStat().message('Recovered full HP...');
        } else if (input === '3') {
          return this.exit();
        } else {
          alert('Invalid Input. Please select between valid options.');
        }
      },
      exit: function(input) {
        $('screen').html('"THANK YOU for playing!" -Chan Lee-');
      },

      battleInput: function(input) {},
      // attackMonster: function() {},
      // attackHero: function() {},
      // nextTurn: function() {},
      // win: function() {},
      // clearMonster: function() {},
      // gameOver: function() {},
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
