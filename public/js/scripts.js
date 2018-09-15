var master = {
      name: "",
      lev: 1,
      maxHp: 100,
      hp: 100,
      xp: 0,
      att: 10
    };

var turn = true;
var user ="";
var realName ="";

function writeUserData(userId, realName, name, lev, maxHp, hp, xp, att) {
  firebase.database().ref('users/' + userId).set({
    userId: userId,
    realName: realName,
    name: name,
    lev: lev,
    maxHp: maxHp,
    hp: hp,
    xp: xp,
    att: att,
  });
}

//Back-End ///////////////////////////////////////////////
//TurnGame is  function objects that incorporate whole game contents objects. turngame will run the getInstance function that will intiate the game.
// Thus, Turngame ()=> getInstance (name)=> initiate(name).
var TurnGame = (function() {
  var instance;
  var initiate = function(masterName) {
    var imgArray = [$("#img-1"),$("#img-2"),$("#img-3"),$("#img-4"),$("#img-5"),$("#img-6")];
    master.name = masterName.toUpperCase();
    // Masters and Monsters will later be set as classes
    //Monters is a array of objects.
    var monsters = [{
      id: 0,
      name: 'ReeRee "SongPa-Seal" Kim',
      nick: 'ReeRee',
      hp: 15 + master.lev * 10,
      maxHp: 15 + master.lev * 10,
      att: 10 + master.lev * 5,
      xp: 5 + master.lev * 5,
      skill: '"Orange-Splash"!',
    }, {

      id: 1,
      name: 'JaeBom "Drunken" Lee',
      nick: "JaeBom",
      hp: 50 + master.lev * 3,
      maxHp: 50 + master.lev * 3,
      att: 100 + master.lev,
      xp: 10 + master.lev,
      skill: '"SoMac-Slam"!',

    }, {
      id: 2,
      name: 'SangBaek "Trinity" Shin',
      nick: "SangBaek",
      hp: 50 + master.lev * 5,
      maxHp: 50 + master.lev * 5,
      att: 15 + master.lev * 2,
      xp: 20 + master.lev * 2,
      skill: '"Posting-book-on-Insta"!',

    }, {
      id: 3,
      name: 'Heejay "President" Kim',
      nick: "Heejay",
      hp: 1 + master.lev * 5,
      maxHp: 1 + master.lev * 5,
      att: 25 + master.lev * 5,
      xp: 50 + master.lev * 5,
      skill: '"Write-English-Guideline"!',

    }, {
      id: 4,
      name: 'JinWon "Planner" Kim',
      nick: "Jin",
      hp: 40 + master.lev * 5,
      maxHp: 40 + master.lev * 10,
      att: 15 + master.lev * 5,
      xp: 50 + master.lev * 5,
      skill: '"Ikryong-Shouting"!',

    }, {
      id: 5,
      name: 'SoYeon "Queen" Yoo',
      nick: "SoYeon",
      hp: 100 + master.lev * 10,
      maxHp: 100 + master.lev * 10,
      att: 1000 + master.lev * 5,
      xp: 50 + master.lev * 5,
      skill: '"Auditing"!',

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
        if (master.hp <= 0) {
          return this.gameOver();
        }
        else {

        $("#master-hp").html("HP: " + master.hp + "/" + master.maxHp);

        return this;
        }
      },

      // No more than toggle() applied to 2 menus. should test just toggle()will work with focus() function.
      toggleMenu: function () {
        $("#master-name").html(master.name);
        $("#start-screen").hide();
        $("#game-menu").toggle();
        $("#battle-menu").fadeToggle();
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
        monster.hp=monster.maxHp;
        $("#monster-name").html(monster.name+" ");
        $("#monster-hp").html(" HP:" + monster.hp+" ");
        $("#monster-att").html(" ATT:" + monster.att+" ");
        this.message("Encountered " + monster.name + "!");
        imgArray[monster.id].slideToggle();
        window.setTimeout(function (){
          if (monster.name === 'JaeBom "Drunken" Lee') {
            passingVar.message(monster.nick + ": Please buff me Chan! @.@");
          } else if (monster.name === 'SangBaek "Trinity" Shin') {
            passingVar.message(monster.nick + ": Umm... Let me explain something real quick...");
          } else if (monster.name === 'Heejay "President" Kim'){
            passingVar.message(monster.nick+ ": Let's go Mapo Bridge!");
          } else if (monster.name === 'JinWon "Planner" Kim'){
            passingVar.message(monster.nick+ ": Who didn't do the voting!!!");
          } else if (monster.name === 'SoYeon "Queen" Yoo'){
            passingVar.message(monster.nick+ ": Life's like accounting. Debit, Credit, and Soju.");
          } else {
            passingVar.message(monster.nick+"'s status: I'll be always stood on the mid-autumn...");
          }
          return passingVar.toggleMenu();
        }, 3500);
      },
      menuInput: function(input) {
        var passingVar = this;
        if (input === "1") {
          //Sound Control
          menuSound.stop();
          battleSound.play();
          return this.generateMonster();
          $('#menu-button').prop("disabled",true);
        } else if (input === "2") {
          $('#menu-button').prop("disabled",false);
          master.hp = master.maxHp;
          return this.getHp().message("Recovered full HP...")
        } else if (input === "3") {

          return this.exit();
        } else {
          $('#menu-button').prop("disabled",false);
          return this.message("Invalid Input. Please choose among valid options.");
        }
      },
      exit: function(input) {
        // $("#save").trigger("click");
        setTimeout(function(){
          $("#message").html('"THANK YOU for playing!" -Chan Lee-');
        }, 2000);
        $("*").fadeOut(6000);
        $("#off").trigger("click");
        $("#music-off").trigger("click");
      },

      battleInput: function (input) {
        if (input === "1") {
          spankSound.play();
          return this.attackMonster();
        } else if (input === "2") {
          if (master.hp + master.lev * 20 < master.maxHp) {
            master.hp += master.lev * 20;
          } else {
            master.hp = master.maxHp;
          }
          return this.getHp().message("Recovered HP...").nextTurn();
        } else if (input === "3") {
          battleSound.stop();
          winSound.play();
          window.setTimeout(function(){
            winSound.stop();
            menuSound.play();
          }, 4000);
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
        //Sound Control
        battleSound.stop();
        winSound.play();
        var passingVar = this;
        window.setTimeout(function () {
          passingVar.message(monster.nick+" is down!");
          window.setTimeout(function () {
            window.setTimeout(function () {
              passingVar.message(master.name+" gained "+monster.xp+"xp through the battle.");
            }, 2000);
          }, 2000);
          master.xp += monster.xp;
          //Sound Control
          winSound.stop();
          menuSound.play();
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
        battleSound.stop();
        gameOverSound.play();
        $("#game-menu").hide();
        $("#battle-menu").hide();
        // $('#battle-button').prop("disabled",true);
        // $('#menu-button').prop("disabled",true);
        $("#save").trigger("click");
        $('#message').html( master.name + " is Dead... ");
        window.setTimeout(function(){
          $('#message').html("<h1>Game Over</h1><br><p><a href='https://yfl-ult-fight.firebaseapp.com/'>click here to try again</a></p>");
        }, 2000);
        $("#music-off").trigger("click");
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
  $("#monster-stat").fadeIn('slow');
  $("#screen").fadeIn('slow');
  $("#battle-menu").fadeIn('slow');
}

//Sound constructor and soundtrack constants.
function Sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    $("body").append(this.sound);
    this.play = function(){
      // reset play position to zero second then play
      this.sound.currentTime = 0;
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
}

var introSound = new Sound("sound/intro.mp3");
var menuSound = new Sound("sound/menu.mp3");
var battleSound = new Sound("sound/battle.mp3");
var winSound = new Sound("sound/win.mp3");
var spankSound = new Sound("sound/spank.mp3");
var gameOverSound = new Sound("sound/gameover.mp3");


// Front-end ///////////////////////////////////////

$(document).ready(function() {
  // Firebase portion !!!!!!!!!!!
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC6GJ_MCQzmZfXXJfI-RJ2dpIO5V8S3llg",
    authDomain: "yfl-ult-fight.firebaseapp.com",
    databaseURL: "https://yfl-ult-fight.firebaseio.com",
    projectId: "yfl-ult-fight",
    storageBucket: "yfl-ult-fight.appspot.com",
    messagingSenderId: "693209051819"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  //Authentication
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider).then(function(result) {
  var token = result.credential.accessToken;
  user = result.user.email;
  realName = result.user.displayName;
  console.log("login")
  console.log(user+" "+realName);

  var combination = realName + user[0]+user[1]+user[2];
  console.log(combination);
  var accountRef = database.ref("users/"+ combination);
  console.log(accountRef);
  accountRef.on("value",gotData,errData);

  function gotData(data){
    console.log(data);
    var userInfo = data.val();
    if(userInfo.name !== undefined){
      master = {
        userId: userInfo.userId,
        realName: userInfo.realName,
        name: userInfo.name,
        lev: userInfo.lev,
        maxHp: userInfo.maxHp,
        hp: userInfo.hp,
        xp: userInfo.xp,
        att: userInfo.att
      }
      console.log(master.userId+master.name);

      console.log(master);
      TurnGame.getInstance(master.name).getXp();

      if(master.hp > 0) {
      $("#game-menu").show();
      $("#update").hide();
      $(".jumbotron").hide();
      $("#start-screen").hide();
      } else {
        master.hp = master.maxHp;
        alert("Welcome back! "+master.name+"!");
      }

    } else {
      console.log("no matching");
    }
  };
  function errData (err) {
    console.log("err");
    console.log(err);
  };

  // console.log(master);
  // console.log(instance);
  // TurnGame.getInstance(master.name).getXp();
  // $("#game-menu").show();
  // $("#update").hide();
  // $(".jumbotron").hide();
  // $("#start-screen").hide();


  }).catch(function(error) {
  // window.location.assign("http://yflnet.com/");
    console.log(user);
  var errorCode = error.code;
  var errorMessage = error.message;
  var email = error.email;
  var credential = error.credential;
  });

  $("#save").click(function() {
    if(master.name === ''){
      alert("nothing to save!");
    } else {
      writeUserData(realName + user[0]+user[1]+user[2], realName, master.name, master.lev, master.maxHp, master.hp, master.xp, master.att);
      alert("save & load");
      console.log(master);
    }
  });





  $("#game-menu").hide();
  $("#battle-menu").hide();

  // Music DOM eventhandlers
  $("#start-screen").click(function(){
    introSound.play();
  });
  $("#music-off").click(function(){
    gameOverSound.stop();
    introSound.stop();
    menuSound.stop();
    battleSound.stop();
    winSound.stop();
  });

  //Start Input event handler
  $("#start-screen").submit(function (event) {
    event.preventDefault();
    $("#update").hide();

    //Sound Control
    introSound.stop();
    menuSound.play();

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
  //Menu Input event handler
  $("#game-menu").submit(function(event) {
    $("#menu-button").prop("disabled",true);
    event.preventDefault();
    var menuInputValue = $("#menu-input").val();
    TurnGame.getInstance().menuInput(menuInputValue);
    $("#menu-input").val("");
  });

  //Battle Input event handler
  $("#battle-menu").submit(function(event) {
    $("#menu-button").prop("disabled",false);
    event.preventDefault();
    var userBattleInput = $("#battle-input").val();
    TurnGame.getInstance().battleInput(userBattleInput);
    $("#battle-input").val("");
  });



});
