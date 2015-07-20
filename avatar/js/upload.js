$(document).ready(function () {
    $('#file_upload').fileupload({
        dataType: 'json',
        acceptFileTypes: '/(\.|\/)(csv|txt)$/i',
        done: function (e, data) {
            window.location.reload();
        }
    });
});
function datafile_delete(file) {
    bootbox.dialog({
        title: "Delete Data",
        message: "<p>The following file(s) will be deleted:</p><p class='text-danger'>" + file + "</p>",
        buttons: {
            Proceed: function () {
                $.get("data/delete.php?f=" + file, function (r) {
                    location.reload();
                });
            }
        }
    });
}

function datafile_import(file) {
    bootbox.dialog({
        message: "<i class='fa fa-spinner'></i> Importing \"" + file + "\", please be patient...",
        closeButton: false
    });
    $.get(API_SERVER + "avatar/api/traj/import/?src=" + file, function (r) {
        r = eval(r);
        var msg = "<p>" + r.processed + " entries have been processed.</p><p>" + r.success + " entries have been imported.</p><p>" + r.fail + " entries are failed to import.</p>";
        bootbox.hideAll();
        bootbox.alert(msg);
    }).fail(function () {
        bootbox.hideAll();
        bootbox.alert("<span class='text-danger'><i class='fa fa-warning'></i> Something is wrong while processing the file!</span>");
    });
}