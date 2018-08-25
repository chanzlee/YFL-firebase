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
