var isClickChk = false;
var isClickChkSet = function () {
  isClickChk = false;
};

//Wheel of Fortune
function rotation(total) {
  if (isClickChk === true) return;
  isClickChk = true;

  var slot;

  if (total > 0) {
    var minAng = 15;
    var maxAng = 15;
    var angle = Math.floor(Math.random() * (minAng - maxAng) - minAng); //선택 구간 사이에 랜덤으로 멈추기

    $(".roulette-area .btn-start").attr("disabled", true);
    $("#roulette").rotate({
      angle: 0,
      animateTo: 360 * 14 + angle,
      center: ["50%", "50%"],
      easing: $.easing.easeInOutElastic,
      callback: function () {
        var stopAngle = $("#roulette").getRotateAngle();
        $(".roulette-area .btn-start").attr("disabled", false);
      },
      duration: 1000,
    });

    isClickChkSet();
  } else {
    alert("pogi");
    isClickChkSet();
    return false;
  }
}
