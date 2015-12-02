function init_cache() {
    bootbox.dialog({
        message: loading_message("Initializing cache for API sub-system, please be patient..."),
        closeButton: false
    });
    $.get(API_SERVER + "avatar/init/", function (r) {
        bootbox.hideAll();
        bootbox.alert(success_message("Successfully initialized the cache for API sub-system."));
    }).fail(function () {
        bootbox.hideAll();
        bootbox.alert(error_message("Something is wrong while initializing the cache for API sub-system!"));
    });
}