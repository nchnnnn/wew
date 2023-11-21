//charge GoldCoin (common popup)
$(document).on("keyup", "#chargeAmt", function () {
  checkChargeForm();
});

//charge GoldCoin (myinfo)
$(document).on("keyup", "#exchageCashAmt", function () {
  checkGMExchageForm("");
});

//exCharge GoldCoin -> eCoin
$(document).on("blur", "#exchageGMAmt", function () {
  checkExchageForm("");
});

var chargePopUp = function () {
  $("#chargeAmt").val("");
  $("#chargeGMAmt").text("");

  $.ajax({
    url: "/Billing/MyCashInfo",
    data: "",
    type: "POST",
    success: function (e) {
      $("#myECoin").val(e.eCoin);
      $("#myGMCoin").val(e.GMCoin);
      $("#cashAmt").text(
        e.eCoin.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
      );
      $("#afterGMAmt").text(
        e.GMCoin.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
      );
      popup(".popup-charge");
    },
    error: function (xhr, status, error) {
      alert("error");
    },
  });
};

var checkChargeForm = function () {
  if ($("#chargeAmt").val() == "" || $("#chargeAmt").val() == 0) {
    alert("please input the convert amount of cash.");
    return false;
  } else {
    var chargeAmt = parseInt($("#chargeAmt").val().replace(",", ""));
    var gmAMT = parseInt(chargeAmt * 2);
    var afterGMAMT = parseInt($("#myGMCoin").val()) + gmAMT;

    if (chargeAmt > parseInt($("#myECoin").val())) {
      alert("You have insufficient e-Coin to convert.");
      $("#chargeAmt").val("");
      $("#chargeGMAmt").text("");
      $("#afterGMAmt").text("");
      return false;
    } else {
      $("#chargeGMAmt").text(Number_Price(gmAMT));
      $("#afterGMAmt").text(Number_Price(afterGMAMT));
      return true;
    }
  }
};

var chargeGoldCoin = function () {
  if (checkChargeForm()) {
    $.ajax({
      url: "/Billing/ChargeGoldCoin",
      data: { chargeAmt: $("#chargeAmt").val() },
      type: "POST",
      success: function (e) {
        if (e.code == 0) {
          alert("Charging Gold Coins is complete.");
          popupClose(".popup-charge");
          myCashInfo(setMyCoinInfo);
        } else {
          alert(e.message);
        }
      },
      error: function (xhr, status, error) {
        alert("error");
      },
    });
  }
};

var checkExchageForm = function (message) {
  if ($("#exchageGMAmt").val() == "" || $("#exchageGMAmt").val() == 0) {
    if (message == "Y") {
      alert("please input the convert amount of goldcoin.");
    }
    return false;
  } else {
    var chargeAmt = parseInt($("#exchageGMAmt").val().replace(",", ""));
    var cashAMT = parseInt(chargeAmt / 2);
    var afterCashAMT = parseInt($("#myECoin").val()) + cashAMT;

    if (chargeAmt > parseInt($("#myGMCoin").val())) {
      alert("You have insufficient Gold Coin to convert.");
      $("#exchageGMAmt").val("");
      $("#exchageCashAmt").val("");
      $("#afterCashAMT").val("");
      return false;
    } else {
      if (chargeAmt % 2 != 0) {
        alert(
          "Please double check the amount of exchange gold coins.\nOnly even number of gold coins is exchangeable.\n(2Gold Coins = 1e-Coin)"
        );
        $("#exchageGMAmt").val("");
        $("#exchageCashAmt").val("");
        $("#afterCashAMT").val("");
        return false;
      }

      $("#exchageCashAmt").val(Number_Price(cashAMT));
      $("#afterCashAMT").val(Number_Price(afterCashAMT));

      return true;
    }
  }
};

var exchageECoin = function () {
  if (checkExchageForm("Y")) {
    $.ajax({
      url: "/Billing/ExchageECoin",
      data: { chargeAmt: $("#exchageGMAmt").val() },
      type: "POST",
      success: function (e) {
        if (e.code == 0) {
          alert("The eCoin exchange has been completed.");
          myCashInfo(setMyCoinInfo);
        } else {
          alert(e.message);
        }
      },
      error: function (xhr, status, error) {
        alert("error");
      },
    });
  }
};

var checkGMExchageForm = function (message) {
  if ($("#exchageCashAmt").val() == "" || $("#exchageCashAmt").val() == 0) {
    if (message == "Y") {
      alert("please input the convert amount of eCoin.");
    }
    return false;
  } else {
    var chargeAmt = parseInt($("#exchageCashAmt").val().replace(",", ""));
    var gmAMT = parseInt(chargeAmt * 2);
    var afterGMAMT = parseInt($("#myGMCoin").val()) + gmAMT;

    if (chargeAmt > parseInt($("#myECoin").val())) {
      alert("You have insufficient e-Coin to convert.");
      $("#exchageGMAmt").val("");
      $("#afterGMAMT").val("");
      $("#exchageCashAmt").val("");
      return false;
    } else {
      $("#exchageGMAmt").val(Number_Price(gmAMT));
      $("#afterGMAMT").val(Number_Price(afterGMAMT));
      return true;
    }
  }
};

var exchageGoldCoin = function () {
  if (checkGMExchageForm("Y")) {
    $.ajax({
      url: "/Billing/ChargeGoldCoin",
      data: { chargeAmt: $("#exchageCashAmt").val() },
      type: "POST",
      success: function (e) {
        if (e.code == 0) {
          alert("Charging Gold Coins is complete.");
          myCashInfo(setMyCoinInfo);
        } else {
          alert(e.message);
        }
      },
      error: function (xhr, status, error) {
        alert("error");
      },
    });
  }
};

var setMyCoinInfo = function (e) {
  var eCoin = !e.eCoin ? 0 : e.eCoin;
  var GMCoin = !e.GMCoin ? 0 : e.GMCoin;
  $("#myECoin").val(eCoin);
  $("#myGMCoin").val(GMCoin);
  $("#myECoin").text(
    eCoin.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
  );
  $("#myGoldCoin").text(
    GMCoin.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
  );
  $("#myPurchase").val($("#myGoldCoin").text());
};

function getDateStr(myDate) {
  var year = myDate.getFullYear();
  var month = myDate.getMonth() + 1;
  var day = myDate.getDate();

  var num = parseInt(month);
  var str = num > 9 ? num : "0" + num;
  month = str.toString();

  num = parseInt(day);
  var str = num > 9 ? num : "0" + num;
  day = str.toString();

  return year + "." + month + "." + day;
}

/* ���� ��¥�� ���ڿ��� ��ȯ */
function getToday() {
  var d = new Date();
  return getDateStr(d);
}

/* ���÷κ��� 1������ ��¥ ��ȯ */
function getlastWeek() {
  var d = new Date();
  var dayOfMonth = d.getDate();
  d.setDate(dayOfMonth - 7);
  return getDateStr(d);
}

/* ���÷κ��� 1������ ��¥ ��ȯ */
function getlastMonth(m) {
  var d = new Date();
  var monthOfYear = d.getMonth();
  d.setMonth(monthOfYear - m);
  return getDateStr(d);
}

var myCashInfo = function (callback) {
  $.ajax({
    url: "/Billing/MyCashInfo",
    data: "",
    type: "POST",
    success: function (e) {
      callback(e);
    },
    error: function (xhr, status, error) {
      alert(error);
    },
  });
};
