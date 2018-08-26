

//Back-End ///////////////////////////////////////////////

//TurnGame is  function objects that incorporate whole game contents objects. turngame will run the getInstance function that will intiate the game.
// Thus, Turngame ()=> getInstance (name)=> initiate(name).
var TurnGame = (function() {
  var instance;
  var initiate = function(masterName) {
    var imgArray = [$("#img-1"),$("#img-2"),$("#img-3"),$("#img-4")];
    masterName = masterName.toUpperCase();
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
      id: 0,
      name: 'ReeRee "SongPa-Seal" Kim',
      nick: 'ReeRee',
      hp: 15 + master.lev * 10,
      att: 1 + master.lev * 5,
      xp: 5 + master.lev * 5,
      skill: '"Hydro-Pump"!',
    }, {

      id: 1,
      name: 'JaeBom "Drunken" Lee',
      nick: "JaeBom",
      hp: 25 + master.lev * 3,
      att: 10 + master.lev,
      xp: 10 + master.lev,
      skill: '"Soju-Slam"!',

    }, {
      id: 2,
      name: 'SangBaek "Trinity" Shin',
      nick: "SangBaek",
      hp: 50 + master.lev * 5,
      att: 15 + master.lev * 2,
      xp: 20 + master.lev * 2,
      skill: '"Explaining-Bullshit"!',

    }, {
      id: 3,
      name: 'Heejay "President" Kim',
      nick: "Heejay",
      hp: 100 + master.lev * 10,
      att: 25 + master.lev * 5,
      xp: 50 + master.lev * 5,
      skill: '"Nomura-Beam"!',

    }];

    var monster = null;
    var turn = true;
    return {
      // Basic UI functions ///////////////////////////////////////////////
      // Note that most of functions are return "this" for continued method chaining.
      getLevel: function () {
        $("#master-level").html(" LV: "+master.lev);
        return this;
        $("*").fadeOut().fadeIn('slow');
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
        $("#master-name").html(master.name);
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
        $("#battle-menu").fadeToggle();
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
        $("*").fadeOut();
      },

      message: function (msg) {
        $("#message").hide();
        $("#message").html(msg);
        $("#message").fadeIn();
        return this;
      },

      // Basic input receiver functions ///////////////////////////////////////////////
      generateMonster: function() {
        var passingVar = this;
        monster = monsters[Math.floor(Math.random() * monsters.length)];
        $("#monster-name").html(monster.name+" ");
        $("#monster-hp").html(" HP:" + monster.hp+" ");
        $("#monster-att").html(" ATT:" + monster.att+" ");
        this.message("Encountered " + monster.name + "!");
        imgArray[monster.id].slideToggle();
        window.setTimeout(function (){
          if (monster.name === 'JaeBom "Drunken" Lee') {
            passingVar.message(monster.nick + ": Let's have just one more round of drink! @.@");
          } else if (monster.name === 'SangBaek "Trinity" Shin') {
            passingVar.message(monster.nick + ": Umm... Let me explain something real quick...");
          } else if (monster.name === 'Heejay "President" Kim'){
            passingVar.message(monster.nick+ ": By construction... You can't beat me!");
          } else {
            passingVar.message(monster.nick+"'s status: Another day of blue sky...");
          }
          return passingVar.toggleMenu();
        }, 3500);
      },
      menuInput: function(input) {
        if (input === "1") {
          return this.generateMonster();
          $('#menu-button').prop("disabled",true);
        } else if (input === "2") {
          master.hp = master.maxHp;
          return this.updateStat().message("Recovered full HP...");
        } else if (input === "3") {
          return this.exit();
        } else {
          alert("Invalid Input. Please choose among valid options.");
        }
      },
      exit: function(input) {
        $("#message").html('"THANK YOU for playing!" -Chan Lee-');
        $("*").fadeOut(5000);
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
          alert("Invalid Input. Please choose among valid options.");
        }
      },
      attackMonster: function () {
        monster.hp -= master.att;
        $("#monster-hp").html( "HP: " + monster.hp);
        if (monster.hp > 0) {
          imgArray[monster.id].shake({
              interval: 100,
              distance: 20,
              times: 5
          });
          return this.message(monster.nick+" got damage of "+master.att+".").nextTurn();
        }
        return this.win();
      },
      attackHero: function () {
        master.hp -= monster.att;
        return this.getHp();
      },
      //nextTurn is recursive function and process the passed variable until turn is over.
      nextTurn: function () {
        var passingVar = this;
        turn = !turn;
        $("#battle-button").prop("disabled",true);
        if (!turn) {
          window.setTimeout(function () {
            passingVar.message(monster.nick + "'s turn.");
            window.setTimeout(function () {
              if (passingVar.attackHero()) {
                passingVar.message(monster.nick+" used "+monster.skill);
                window.setTimeout(function () {
                    flashOut();
                    passingVar.message(master.name+" got damage of "+monster.att+"." );
                  window.setTimeout(function () {
                    passingVar.message(master.name + "'s turn.");
                    $('#battle-button').prop("disabled",false);
                  }, 2000);
                }, 2000);
              }
            }, 2000);
          }, 2000);
          return this.nextTurn();
        }
        return this;
      },
      win: function () {
        var passingVar = this;
        window.setTimeout(function () {
          passingVar.message(monster.nick+" is down!");
          window.setTimeout(function () {
            window.setTimeout(function () {
              passingVar.message(master.name+" gained "+monster.xp+"xp through the battle.");
            }, 2000);
          }, 2000);
          master.xp += monster.xp;
          return passingVar.clearMonster().getXp();
        }, 1500);
      },
      clearMonster: function () {
        $("#monster-name").html("");
        $("#monster-hp").html("");
        $("#monster-att").html("");
        imgArray[monster.id].slideToggle();
        $('#menu-button').prop("disabled",false);
        return this.toggleMenu();
        monster = {};
      },
      gameOver: function () {
        $("#screen").html("DEAD");
        $('#message').html( master.name + " is Dead... ");
        window.setTimeout(function(){
          $('#message').html("<h1>Game Over</h1>");
        }, 2000);
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


// Img animate functions
//shake when monsters are attacked
(function($){
  $.fn.shake = function(settings) {
    if(typeof settings.interval == 'undefined'){
        settings.interval = 100;
    }
    if(typeof settings.distance == 'undefined'){
        settings.distance = 10;
    }
    if(typeof settings.times == 'undefined'){
        settings.times = 4;
    }
    if(typeof settings.complete == 'undefined'){
        settings.complete = function(){};
    }
    $(this).css('position','relative');
    for(var iter=0; iter<(settings.times+1); iter++){
        $(this).animate({ left:((iter%2 == 0 ? settings.distance : settings.distance * -1)) }, settings.interval);
    }
    $(this).animate({ left: 0}, settings.interval, settings.complete);
  };
})(jQuery);

//flashout and in when master is attacked
var flashOut = function(){
  $("#battle-menu").fadeOut();
  $("#screen").fadeOut();
  $("#monster-stat").fadeOut();
  $("#message").fadeOut();
  $("#battle-menu").fadeIn('slow');
  $("#screen").fadeIn('slow');
  $("#monster-stat").fadeIn('slow');
  $("#message").fadeIn('slow');
}



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
    } else if (name && confirm("Hello, "+name.toUpperCase() +". Welcome to YFL ULTI BATTLE...")) {
      TurnGame.getInstance(name).getXp();
      $("#game-menu").show();
      $(".jumbotron").hide();
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
