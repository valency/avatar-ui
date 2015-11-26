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

