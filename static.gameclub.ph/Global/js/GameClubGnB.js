var login = getCookie("GCUserInfo");
var bill_login = getCookie("BillUserSession");

if (login == null || bill_login == null) {
  login = false;
} else {
  if (login.length > 0 && bill_login.length > 0) login = true;
  else login = false;
}

var ua = navigator.userAgent;
var GC = (window.GameClub = {
  // agent name
  Agent: {
    msie: /msie/i.test(ua),
    firefox: /firefox/i.test(ua),
    chrome: /chrome/i.test(ua),
    opera: /opera/i.test(ua),
    khtml: /khtml/i.test(ua),
    safari: /safari/i.test(ua) && !/chrome/i.test(ua),
  },

  // 현재 접속중인 domain의 secure protocol 여부
  isSecure: function (url) {
    return /^https/.test(url || location.href);
  },

  // 현재 접속중인 domain의 서비스 '환경' ( ui / qa / dev / local ) 추출
  getServiceDomain: function () {
    var domain = document.domain.toLowerCase();
    var service = /^(?:ui|qa|dev|local|billtest)/.exec(domain);
    service =
      service && service == "billtest"
        ? "qa"
        : service && service == "dev"
        ? "local"
        : service;
    return service ? service + "-" : "";
  },

  returnUrl: function () {
    var r_url = document.getElementById("r_url");
    return escape(r_url ? r_url.value : location.href);
  },

  portalUrl: function () {
    return (
      (GC.isSecure() ? "https://" : "http://") +
      GC.getServiceDomain() +
      ConstPortalDomain
    );
  },

  portalSecureUrl: function () {
    return (
      (GC.getServiceDomain() != ("local-" || "dev-") ? "https://" : "http://") +
      GC.getServiceDomain() +
      ConstPortalDomain
    );
  },

  staticUrl: function () {
    return (
      (GC.isSecure() ? "https://" : "http://") +
      GC.getServiceDomain() +
      ConstStaticDomain
    );
  },

  billUrl: function () {
    return GC.getServiceDomain() == ""
      ? "https://bill.gameclub.ph"
      : "https://billtest.gameclub.ph";
  },
});

var ConstPortalDomain = "www.gameclub.ph";
var ConstStaticDomain = "static.gameclub.ph";
var ConstPortalUrl = "http://" + GC.getServiceDomain() + ConstPortalDomain;
var SecondDomain = getSecondDomain();

function getCookie(name) {
  var nameOfCookie = name + "=";
  var x = 0;
  while (x <= document.cookie.length) {
    var y = x + nameOfCookie.length;
    if (document.cookie.substring(x, y) == nameOfCookie) {
      if ((endOfCookie = document.cookie.indexOf(";", y)) == -1)
        endOfCookie = document.cookie.length;
      return unescape(document.cookie.substring(y, endOfCookie));
    }
    x = document.cookie.indexOf(" ", x) + 1;
    if (x == 0) break;
  }
  return "";
}

function getSecondDomain(url) {
  var d = url || document.domain;
  var s = "";

  if (
    /(?:^)\./i.test(d) ||
    /(?:^|\-)mem\./i.test(d) ||
    /(?:^|\-)www\./i.test(d)
  ) {
    s = "LB";
  } else if (
    /(?:^)cf.goldrush\./i.test(d) ||
    /(?:^|\-)cf.goldrush\./i.test(d)
  ) {
    s = "GD";
  } else if (/(?:^)goldrush\./i.test(d) || /(?:^|\-)goldrush\./i.test(d)) {
    s = "GD";
  } else if (/(?:^)cf\./i.test(d) || /(?:^|\-)cf\./i.test(d)) {
    s = "CF";
  } else if (/(?:^)cfzero\./i.test(d) || /(?:^|\-)cfzero\./i.test(d)) {
    s = "CFZ";
  }

  return s;
}

function getUrlParams() {
  var params = {};
  window.location.search.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function (str, key, value) {
      params[key] = value;
    }
  );
  return params;
}

function getSiteCode() {
  oParams = getUrlParams();
  var s =
    oParams && oParams.sitecode && oParams.sitecode.length > 0
      ? oParams.sitecode
      : SecondDomain;
  return s;
}

function gnbOpenJoin() {
  location.href = GC.portalSecureUrl() + "/Join/?sitecode=" + getSiteCode();
}

function gnbLogin() {
  location.href =
    GC.portalSecureUrl() +
    "/Login/?sitecode=" +
    getSiteCode() +
    "&returnUrl=" +
    GC.returnUrl();
}

function MyInfo() {
  location.href = GC.portalSecureUrl() + "/MyInfo/?sitecode=" + getSiteCode();
}

function goIdFind() {
  location.href =
    GC.portalSecureUrl() +
    "/FindPassword/FindPassword?sitecode=" +
    getSiteCode();
}

function gnbOpenBill() {
  location.href =
    GC.portalSecureUrl() +
    "/Login/?returnUrl=" +
    escape(GC.billUrl() + "/?gamecode=" + SecondDomain);
}

function gnbSupport() {
  /*location.href = ConstPortalUrl + "/Support/";*/ //orig code commented by donald to redirect support to new url as per brix request
  location.href = "https://support.gameclub.ph";
}

function about() {
  location.href = ConstPortalUrl + "/About";
}

function privacy() {
  window.open(ConstPortalUrl + "/Policy/Privacy");
}

function terms() {
  window.open(ConstPortalUrl + "/Policy/Terms");
}

function eula() {
  window.open(ConstPortalUrl + "/Policy/EULA");
}

function player() {
  window.open(ConstPortalUrl + "/Policy/Player");
}

function logout(returnUrl) {
  var frmParam = "returnUrl=" + escape(returnUrl);

  $.support.cors = true;
  $.ajax({
    url: GC.portalSecureUrl() + "/Login/LogoutAct",
    data: frmParam,
    dataType: "jsonp",
    crossDomain: true,
    type: "post",
    timeout: 10000,
    cache: false,
    error: function (xhr, status, error) {
      alert("Error has occurred.");
      return;
    },
    success: function (e) {
      if (e.Data.code == 1) {
        // success
        if (returnUrl == undefined || returnUrl == "") {
          location.href = ConstPortalUrl;
        } else {
          var hostname = $("<a>").prop("href", returnUrl).prop("hostname");
          location.href = /gameclub.ph/g.test(hostname)
            ? returnUrl
            : ConstPortalUrl;
        }
      } else {
        alert("Failed to logout.");
      }
      return;
    },
  });
}

function Login_CheckStr(strOriginal, strFind, strChange) {
  var position, strOri_Length;
  position = strOriginal.indexOf(strFind);

  while (position != -1) {
    strOriginal = strOriginal.replace(strFind, strChange);
    position = strOriginal.indexOf(strFind);
  }

  strOri_Length = strOriginal.length;
  return strOri_Length;
}

var GNB = {
  http: GC.isSecure() ? "https://" : "http://",
  service: GC.getServiceDomain(),
  css: '<link href="$path/css/gnb.css?ver=20200514" rel="stylesheet" />',

  html_common: [
    '<div class="gameclub-bar$barcname">' +
      '<div class="inner">' +
      '<a href="$home" class="logo-gameclub">GAMECLUB</a>' +
      '<div class="gameclub-gnb">' +
      "<ul>" +
      '	<li class="m1">' +
      '		<a href="#" class="depth01">GAMES</a>' +
      '		<ul class="depth02" id="list_box">' +
      "		</ul>" +
      "	</li>" +
      '	<li class="m2"><a href="javascript:void(0)" onclick="gnbSupport()" class="depth01">SUPPORT</a></li>' +
      '	<li class="m3"><a href="javascript:void(0)" onclick="gnbOpenBill()" class="depth01">Top-Up</a></li>' +
      "</ul>" +
      '<div class="gameclub-util">' +
      (login
        ? '<a class="btn-myinfo" href="javascript:void(0)" onclick="MyInfo()">MY ACCOUNT</a>' +
          '<a class="btn-login" href="javascript:void(0)" onclick="logout()" class="login" style="margin-left: 40px;">LOGOUT</a>'
        : '<a class="btn-register" href="javascript:void(0)" onclick="gnbOpenJoin()">REGISTER</a>' +
          '<a class="btn-login" href="javascript:void(0)" onclick="gnbLogin()" class="login" style="margin-left: 40px;">LOGIN</a>'),
    "		</div>" + "	</div>" + "</div>" + "</div>",
  ].join("\n"),

  Write: function () {
    var home = ConstPortalUrl;
    var path = this.http + this.service + "static.gameclub.ph/Global";
    var games = GC.portalUrl() + "/GNB/GameList?callback=?";
    var barcname =
      SecondDomain == "LB" && document.location.pathname == "/" ? " main" : "";

    // init gnb html
    var doc = document;
    doc.write(this.css.replace(/\$path/gm, path));
    doc.write(
      this.html_common
        .replace(/\$barcname/gm, barcname)
        .replace(/\$path/gm, path)
        .replace(/\$home/gm, home)
        .replace(/\$service/gm, this.service)
    );

    $(document).ready(function () {
      $.support.cors = true;
      $.ajax({
        url: games,
        cache: false,
        dataType: "jsonp",
        crossDomain: true,
        success: function (res) {
          GNB.initGames(res);
        },
        error: function (e, r, h) {
          //console.log(h.message);
        },
      });

      $(".gameclub-gnb .depth01").click(function () {
        if ($(this).next().hasClass("depth02"))
          $(this)
            .parents("li")
            .toggleClass("fold")
            .find(".depth02")
            .slideToggle("fast");
      });
    });
  },

  initGames: function (items) {
    var len = items.length;

    var list_box = document.getElementById("list_box");
    var path =
      this.http + this.service + this.ssl + "common.gametree.co.kr/NGNB/img/";
    var add_list = function (item) {
      var url = item.SiteUrl;
      var target = item.LinkTarget ? item.LinkTarget : "_blank";
      var gamename = item.GameName;
      var sitecode = item.SiteCode;
      var list_li = document.createElement("li");
      list_li.innerHTML =
        ' <a href="' + url + '" target="' + target + '">' + gamename + "</a>";
      if (list_li) document.getElementById("list_box").appendChild(list_li);
      list_li = null;
    };

    for (var i = 0; i < len; i++) {
      add_list(items[i]);
    }
  },
};

GNB.Write();
