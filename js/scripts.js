// Front-end ///////////////////////////////////////

$(document).ready(function() {
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

//TurnGame is  function objects that incorporate whole game contents objects. turngame will run the getInstance function that will intiate the game. Thus, name => instance => turngame algo.
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
