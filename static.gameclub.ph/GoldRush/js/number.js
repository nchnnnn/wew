$(document).ready(function () {
  //정수만
  $(".num_only")
    .css("imeMode", "disabled")
    .keypress(function (event) {
      if (
        event.which &&
        (event.which < 48 ||
          event.which > 57 ||
          (event.which >= 96 && event.which <= 105))
      ) {
        event.preventDefault();
      }
    })
    .keyup(function () {
      if ($(this).val() != null && $(this).val() != "") {
        $(this).val(
          $(this)
            .val()
            .replace(/[^0-9]/g, "")
        );
      }
    })
    .blur(function () {
      if ($(this).val() != null && $(this).val() != "") {
        $(this).val(
          $(this)
            .val()
            .replace(/[^0-9]/g, "")
        );
      }
    });

  //금액
  $(".num_only2")
    .css("imeMode", "disabled")
    .keypress(function (event) {
      if (
        event.which &&
        (event.which < 48 ||
          event.which > 57 ||
          (event.which >= 96 && event.which <= 105))
      ) {
        event.preventDefault();
      }
    })
    .keyup(function () {
      if ($(this).val() != null && $(this).val() != "") {
        var tmps = $(this)
          .val()
          .replace(/[^0-9]/g, "");
        var tmps2 = tmps.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        $(this).val(tmps2);
      }
    })
    .blur(function () {
      if ($(this).val() != null && $(this).val() != "") {
        var tmps = $(this)
          .val()
          .replace(/[^0-9]/g, "");
        var tmps2 = tmps.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        $(this).val(tmps2);
      }
    });

  //소수점포함
  $(".num_only3")
    .css("imeMode", "disabled")
    .keypress(function (event) {
      //if (event.which && ((event.which < 48 || event.which > 57) || event.which == 46 || (event.which >= 96 && event.which <= 105))) {
      if (
        event.which != 46 &&
        event.which > 31 &&
        (event.which < 48 || event.which > 57)
      ) {
        event.preventDefault();
      }
    })
    .keyup(function () {
      if ($(this).val() != null && $(this).val() != "" && $(this).val() != 0) {
        var n = parseFloat($(this).val()).toFixed(2);
        $(this).val(n);
      }
    })
    .blur(function () {
      if ($(this).val() != null && $(this).val() != "" && $(this).val() != 0) {
        var n = parseFloat($(this).val()).toFixed(2);
        $(this).val(n);
      }
    });
});

var Number_Price = function (num) {
  var n = 0;
  n = num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  return n;
};

var Number_Float = function (num) {
  var n = 0;
  n = parseFloat(num).toFixed(2);
  return isNaN(n) ? 0 : n;
};
