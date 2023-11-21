$(function () {
  //hash tabmenu
  var hash = window.location.hash;
  if (hash) {
    str = hash.replace(/[^0-9]/g, "");
    tab(str);
  }
  $(document).on("click", ".tab-menu li", function () {
    var idx = $(this).index();
    if (hash) {
      location.href = "#tab" + idx;
    }
    $(".tab-menu li").addClass("current").not(this).removeClass("current");
    $(".tab-box").hide().eq(idx).show();

    uiDataTable();
  });

  //datepicker
  $(".datepicker").each(function () {
    $(this).datepicker({
      showOn: "both",
      buttonImage: GC.staticUrl() + "/GoldRush/images/common/icon_calendar.png",
      buttonImageOnly: false,
      dateFormat: "yy.mm.dd",
    });
  });

  if ($(".scrolling-area").length > 0) {
    //marquee text
    $(".scrolling-area").marquee({
      speed: 10000,
      duplicated: true,
      gap: 50,
      pauseOnHover: true,
    });
    $(".scrolling-area").append('<i class="mask-l"></i><i class="mask-r"></i>');
  }

  //Ranking
  $(".tab-box").hide().eq(0).show();

  if ($(".week-picker").length > 0) {
    //weekPicker();
  }

  if ($(".month-picker").length > 0) {
    monthPicker();
  }
});

$(window).load(function () {
  if ($(".banner-area").length > 0) {
    var sliderCount = $(".banner-area .bxslider li").size();
    if (sliderCount > 1) {
      slider(".banner-area .bxslider", true, true);
    } else {
      slider(".banner-area .bxslider", false, false);
    }
  }
  //LUCKY STRIKE
  if ($(".lucky-strike").length > 0) {
    $("[data-img]").each(function () {
      var img = $(this).data("img");
      $(this).css("background-image", "url(" + img + ")");
    });
    $(".marble-tile").each(function () {
      $(this).find("li:even").addClass("odd");
    });

    playSlot();

    //spin btn animation
    var rotation = function () {
      $(".bg-spin .bar").rotate({
        angle: 0,
        animateTo: 360,
        callback: rotation,
        easing: function (x, t, b, c, d) {
          // t: current time, b: begInnIng value, c: change In value, d: duration
          return c * (t / d) + b;
        },
      });
    };

    $(".btn-spin")
      .mouseenter(function () {
        rotation();
      })
      .mouseleave(function () {
        $(".bg-spin .bar").stopRotate();
      })
      .click(function () {
        playSound("btnSound", "btnSound_ie8");
        $(".bg-spin .bar").stopRotate();
      });

    $(document).on("click", ".box-betting .btn-coin", function (e) {
      playSound("betButton", "betButton_ie8");
    });
  }

  //data table bg
  $(".table-data").each(function () {
    $(this).find("tbody tr:even").addClass("odd");
  });
  $(".table-item .thumb").each(function () {
    var img = $(this).find("img").attr("src");
    $(this).css("background-image", "url(" + img + ")");
  });

  //ITEM SHOP
  if ($(".item-shop").length > 0) {
    $(".item-box .thumb").each(function () {
      var img = $(this).find("img").attr("src");
      $(this).css("background-image", "url(" + img + ")");
    });
  }
});

$(document).on("click", ".used-coin", function (e) {
  var $anchor = $(this);
  var setting = $anchor.data("setting");
  var betting = $anchor.data("betting");
  var arr_setting = setting.split("|");
  var arr_betting = betting.split("|");

  var appendHtml = "";
  for (var i = 0; i < arr_betting.length; i++) {
    appendHtml +=
      "<li><strong>x" +
      arr_setting[i] +
      "</strong><em>" +
      arr_betting[i] +
      "</em></li>";
  }

  $(".layer-usedCoin").html(appendHtml);

  var target = $(e.target);
  var posY = target.position().top + 30;
  var posX = target.position().left - 80;

  if ($(this).attr("data-click-state") == 1) {
    $(this).attr("data-click-state", 0);
    $(".used-coin").removeClass("active");
    $(".layer-usedCoin").css({ display: "none" });
  } else {
    $(this).attr("data-click-state", 1);
    $(this).addClass("active");
    $(".layer-usedCoin").css({ display: "block", top: posY, left: posX });
  }
});

//gameclub-gnb fold
/* 20200514 주석처리
$(document).on("click",".gameclub-gnb .m1 a",function(){
	$(this).parents("li").toggleClass("fold");
	$(this).parents("li").find(".depth02").slideToggle("fast");
});
*/

//search month btn
$(document).on("click", ".btn-set button", function () {
  $(".btn-set button").addClass("current").not(this).removeClass("current");
});

//tab menu
function tab(num) {
  $(".tab-menu li").removeClass("current");
  $(".tab-menu li").eq(num).addClass("current");
  $(".tab-box").hide().eq(num).show();
  uiDataTable();
}

function uiDataTable() {
  //data table bg
  $(".table-data").each(function () {
    $(this).find("tbody tr:even").addClass("odd");
  });
  $(".table-item .thumb").each(function () {
    var img = $(this).find("img").attr("src");
    $(this).css("background-image", "url(" + img + ")");
  });
}

function slider(obj, touch, pager) {
  var slider = $(obj).bxSlider({
    auto: true,
    autoControls: false,
    touchEnabled: touch,
    controls: false,
    stopAutoOnClick: false,
    pager: pager,
  });
}

//Wheel of Fortune
function rotation(total, data, result) {
  var minAng = (360 / total) * (data - 1) + 2; //선택 구간 최소 각도
  var maxAng = (360 / total) * data - 2; //선택 구간 최대 각도
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
      /*
			if ( result == 'win' ){
				popup('.popup-result.win');
			} else {
				popup('.popup-result.lose');
			}
			*/
    },
    duration: 9000,
  });
}

/* Lucky Strike */
var position = 0;
var motion_time = "";
var tile_delay = 0;
var tile_max = 24; // 마블 칸 갯수

var showResult = function (data) {
  var jackpot =
    data.itemType == 50 || data.itemType == 100 ? data.winningCoin : 0;
  $("#result_Betting").val(data.bettingCoin);
  $("#result_Prize").val(data.itemType);
  $("#result_WinCoins").val(Number_Price(data.winningCoin));
  //$('.bet-min input').val('-');
  //$('.bet-max input').val('-');

  if (data.itemType == 0) {
    popup(".popup-result");
  }

  if (jackpot > 0) popupJackpot(jackpot);

  myCashInfo(setMyCoinInfo);
};

function slotStart(idx, idx2, data) {
  j = 0;
  $(".bet-max input").modernBlink("start");
  $(".marble-tile li").removeClass("active");
  $(".marble-tile li span").css("opacity", "0");
  $(".btn-spin").attr("disabled", true);
  clearInterval(playAlert);

  playSound("luckyStrikeSound", "luckyStrikeSound_ie8");

  tileAnimation(idx2, data);
}

//tile animation start
var j = 0;
function tileAnimation(num, data) {
  j++;

  if (j < 4) {
    tileAni(num, 100, data);
  } else if (j == 4) {
    if (num < 8) var speed = 240;
    else if (num < 14) var speed = 190;
    else if (num < 19) var speed = 120;
    else if (num < 24) var speed = 80;
    for (var i = 0; i <= 24; i++) {
      (function (a) {
        var tile = $(".marble-tile li").eq(a).find("span");
        setTimeout(function () {
          tile
            .stop()
            .animate(
              {
                opacity: 1,
              },
              300
            )
            .animate(
              {
                opacity: 0,
              },
              400
            );
        }, i * speed);
      })(i);
    }
    setTimeout(function () {
      tileAnimation(num, data);
    }, 24 * speed);
  } else {
    for (var i = 0; i <= num; i++) {
      (function (a) {
        if (num < 8) var speed = 10;
        else if (num < 14) var speed = 6;
        else if (num < 19) var speed = 3;
        else if (num < 24) var speed = 0;

        setTimeout(function () {
          tile_delay = 0;
          tile_delay = tile_delay + a + speed;
          var tile = $(".marble-tile li")
            .eq(a)
            .find("span")
            .stop()
            .delay(tile_delay * 20);
          tile
            .animate({ opacity: 1 }, 300)
            .animate({ opacity: 0 }, 400, function () {
              if (a == num) {
                $(".marble-tile li")
                  .eq(num)
                  .find("span")
                  .animate({ opacity: 1 }, 300)
                  .animate({ opacity: 0 }, 200)
                  .animate({ opacity: 1 }, 300)
                  .animate({ opacity: 0 }, 200, function () {
                    $(".marble-tile li").eq(a).addClass("active");

                    //maximum blink stop
                    $(".bet-max input").modernBlink("stop");
                  })
                  .animate({ opacity: 1 }, 300, function () {
                    $(".btn-spin").attr("disabled", false);
                    showResult(data);
                  });
              }
            });
        }, (i + a) * 80);
      })(i);
    }
    j = 0;
  }
}
//tile ani
function tileAni(num, time, data) {
  for (var i = 0; i <= 24; i++) {
    (function (a) {
      var tile = $(".marble-tile li").eq(a).find("span");
      setTimeout(function () {
        tile
          .stop()
          .animate(
            {
              opacity: 1,
            },
            300
          )
          .animate(
            {
              opacity: 0,
            },
            400
          );
      }, i * time);
    })(i);
  }
  setTimeout(function () {
    tileAnimation(num, data);
  }, 2400);
}
//random slot
function playSlot() {
  playAlert = setInterval(function () {
    $(".marble-tile li span").css("opacity", "0");
    $(".marble-tile li")
      .eq(getRandomInt(0, tile_max))
      .find("span")
      .stop()
      .delay(tile_delay * 200)
      .animate({ opacity: 1 }, 200);
  }, 1000);
}
//random number
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function popup(obj) {
  $("div.dimmed").remove();
  $(obj).css({ display: "block" });

  var marginLeft = -1 * ($(obj).outerWidth() / 2);
  var marginTop = -1 * ($(obj).outerHeight() / 2);
  $("body").addClass("dimmed").append('<div class="dimmed"></div>');
  $(obj)
    .css({ top: "40%", "margin-top": marginTop, "margin-left": marginLeft })
    .focus()
    .animate({ opacity: "1", top: "50%" }, 300);

  return false;
}

function popupClose(that) {
  $("div.dimmed").remove();
  var obj = typeof that; //this == "object"
  if (obj == "object") {
    $(that)
      .parents(".popup")
      .animate({ opacity: "0", top: "40%" }, 200, function () {
        $(this).removeAttr("style");
      });
  } else {
    $(that).animate({ opacity: "0", top: "40%" }, 200, function () {
      $(this).removeAttr("style");
    });
  }

  if ($(that).parent().attr("class") == "popup popup-jackpot") {
    stopSound("jackPotSound", "jackPotSound_ie8");
    $(".popup-jackpot").removeAttr("style");
  }

  $("body").removeClass("dimmed");
  $(".incremental-counter").empty();

  return false;
}

function popupJackpot(jackpot) {
  var obj = ".popup-jackpot";
  var popBox = new TimelineMax({ repeat: 0 });
  $("body").addClass("dimmed").append('<div class="dimmed"></div>');
  $(".popup-jackpot").removeAttr("style").css({ display: "block" });
  popBox.fromTo(
    obj,
    0.6,
    { transformOrigin: "center center", opacity: 0, scale: 0 },
    { opacity: 1, scale: 1, ease: Elastic.easeOut.config(1, 0.3) },
    0
  );

  $(".incremental-counter").attr("data-value", jackpot);
  $(".incremental-counter").incrementalCounter({ digits: "auto" });
  var total = $(".incremental-counter .num").length;
  if (total > 3) {
    var colon = total - 4;
    $(".incremental-counter .num")
      .eq(colon)
      .after('<span class="comma">,</span>');
  }

  playSound("jackPotSound", "jackPotSound_ie8");
}

function myFunction() {
  setTimeout(function () {
    $(".popup-jackpot")
      .removeAttr("style")
      .css({ display: "block", opacity: "1" });
  }, 2000);
}

function weekPicker(defaultDate) {
  var startDate, endDate;

  var selectCurrentWeek = function () {
    window.setTimeout(function () {
      $(".ui-weekpicker")
        .find(".ui-datepicker-current-day a")
        .addClass("ui-state-active")
        .removeClass("ui-state-default");
    }, 1);
  };

  var setDates = function (input) {
    var $input = $(input);
    var date = $input.datepicker("getDate");

    if (date !== null) {
      var firstDay = $input.datepicker("option", "firstDay");
      var dayAdjustment = (date.getDay() - firstDay + 7) % 7;
      startDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - dayAdjustment
      );
      endDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - dayAdjustment + 6
      );

      var inst = $input.data("datepicker");
      var dateFormat =
        inst.settings.dateFormat || $.datepicker._defaults.dateFormat;
      $("#startDate").text(
        $.datepicker.formatDate(dateFormat, startDate, inst.settings)
      );
      $("#endDate").text(
        $.datepicker.formatDate(dateFormat, endDate, inst.settings)
      );
      $("#weekNo").text($.datepicker.iso8601Week(date));
    }
  };

  $(".week-picker")
    .datepicker({
      dateFormat: "yy-mm-dd",
      firstDay: 1, //월~일
      showWeek: true,
      beforeShow: function () {
        $("#ui-datepicker-div").addClass("ui-weekpicker");
        selectCurrentWeek();
      },
      onClose: function () {
        getList(1, 1);
        //$('#ui-datepicker-div').removeClass('ui-weekpicker');
      },
      showOtherMonths: true,
      selectOtherMonths: true,
      onSelect: function (dateText, inst) {
        setDates(this);
        selectCurrentWeek();
        $(this).change();
      },
      beforeShowDay: function (date) {
        var cssClass = "";
        if (date >= startDate && date <= endDate)
          cssClass = "ui-datepicker-current-day";
        return [true, cssClass];
      },
      onChangeMonthYear: function (year, month, inst) {
        selectCurrentWeek();
      },
    })
    .datepicker("setDate", defaultDate);

  setDates(".week-picker");

  var $calendarTR = $(".ui-weekpicker .ui-datepicker-calendar tr");

  $(document).on(
    "mouseenter",
    ".ui-weekpicker .ui-datepicker-calendar tr",
    function () {
      $(this).addClass("hover");
    }
  );

  $(document).on(
    "mouseleave",
    ".ui-weekpicker .ui-datepicker-calendar tr",
    function () {
      $(this).removeClass("hover");
    }
  );

  // $(document).on("click",".my-ranking",function(){
  // $('.week-picker').datepicker().datepicker("setDate", 1);
  // setDates(this);
  // selectCurrentWeek();
  // $(this).change();
  // });
}

function monthPicker() {
  var date = new Date();
  var year = date.getFullYear(),
    month = date.getMonth(),
    lastDay = new Date(year, month, 0).getDate();
  if (month < 10) {
    month = "0" + month;
  }
  //$(".month-wrap .firstDate").text(year+"-"+month+"-"+"01");
  //$(".month-wrap .lastDate").text(year+"-"+month+"-"+lastDay);

  $(".month-picker")
    .monthpicker({
      minDate: "-3m",
      pattern: "yyyy-mm", // Default is 'mm/yyyy' and separator char is not mandatory
      startYear: 2018,
      finalYear: date.getFullYear(),
      monthNames: [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ],
    })
    .bind("monthpicker-click-month", function (e, month) {
      var year = $(".mtz-monthpicker:selected").val();
      var lastDay = new Date(year, month, 0).getDate();
      if (month < 10) {
        month = "0" + month;
      }
      $(".month-wrap .firstDate").text(year + "-" + month + "-" + "01");
      $(".month-wrap .lastDate").text(year + "-" + month + "-" + lastDay);

      getList(2, 1);
      return month;
    });
}

function playSound(id, id_ie8) {
  var isPlaying = function (audio) {
    return !audio.paused;
  };
  var a = document.getElementById(id);
  if (!(a.play instanceof Function)) {
    a = document.getElementById(id_ie8);
    isPlaying = function (audio) {
      return audio.playState == 2;
    };
  }
  if (isPlaying(a)) {
    a.pause();
  } else {
    a.play();
  }
}

function stopSound(id, id_ie8) {
  var isPlaying = function (audio) {
    return !audio.paused;
  };
  var a = document.getElementById(id);
  if (!(a.play instanceof Function)) {
    a = document.getElementById(id_ie8);
    isPlaying = function (audio) {
      return audio.playState == 2;
    };
  }
  a.pause();
}
