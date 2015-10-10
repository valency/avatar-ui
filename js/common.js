var API_DOMAIN = "0.0.0.0";
if (API_DOMAIN == "0.0.0.0") {
    API_DOMAIN = location.hostname;
    console.log("API domain not set, automatically set to the same domain of UI server (" + API_DOMAIN + ").");
}
var API_PORT = 9001;
var API_SERVER = "http://" + API_DOMAIN + ":" + API_PORT + "/";
var COLOR_PALETTE = ["#467D97", "#5DA5DA", "#FAA43A", "#60BD68", "#F17CB0", "#B2912F", "#B276B2", "#DECF3F", "#F15854", "#A03423"];
var LAT_OFFSET = 0.0060;
var LNG_OFFSET = 0.0065;

jQuery.fn.center = function () {
    this.css("position", "absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
    return this;
};

String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

function syntax_highlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function random_color() {
    return '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
}

function get_url_parameter(p) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == p) {
            return sParameterName[1];
        }
    }
}

function login_or_register(username, password) {
    password = CryptoJS.MD5(password).toString();
    $.post(API_SERVER + "avatar/user/register-or-login/", {
        username: username,
        password: password
    }, function (data) {
        $.cookie('avatar_id', data.id, {expires: 7});
        $.cookie('avatar_username', username, {expires: 7});
        $.cookie('avatar_ticket', data["ticket"], {expires: 7});
        location.reload();
    }, "json").fail(function () {
        bootbox.alert("<span class='text-danger'><i class='fa fa-warning'></i> Login or register failed! You could register with another username.</span>");
    });
}

function check_login() {
    if ($.cookie('avatar_id') == undefined || $.cookie('avatar_id') == null) return null;
    if ($.cookie('avatar_username') == undefined || $.cookie('avatar_username') == null) return null;
    if ($.cookie('avatar_ticket') == undefined || $.cookie('avatar_ticket') == null) return null;
    return $.cookie('avatar_username');
}

function logout() {
    $.removeCookie("avatar_id");
    $.removeCookie("avatar_username");
    $.removeCookie("avatar_ticket");
}

