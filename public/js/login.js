$(document).ready(function(){
  $("#ssoLoginForm").submit(function (event){
    event.preventDefault();
    var pw = $("#loginPasswd").val();
    console.log(pw);
    if (pw === "burgerking"){
      window.location.assign("yflkinggodgeneralemperorchungmugongmajesty.html");
    } else {
      window.location.assign("http://yflnet.com/");
    }
  });
});
