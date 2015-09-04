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

function clear_db() {
    bootbox.confirm("Are you sure you would like to delete all the trajectories in the database?", function (confirmed) {
        if (confirmed) {
            bootbox.hideAll();
            bootbox.dialog({
                message: "<i class='fa fa-spinner'></i> Deleting all trajectories, please be patient...",
                closeButton: false
            });
            $.get(API_SERVER + "avatar/api/traj/remove_all/", function (r) {
                bootbox.hideAll();
                bootbox.alert("All trajectories have been successfully deleted.");
            }).fail(function () {
                bootbox.hideAll();
                bootbox.alert("<span class='text-danger'><i class='fa fa-warning'></i> Something is wrong while processing the file!</span>");
            });
        }
    });
}

function datafile_import(file) {
    bootbox.dialog({
        message: "<i class='fa fa-spinner'></i> Importing \"" + file + "\", please be patient...",
        closeButton: false
    });
    $.get(API_SERVER + "avatar/api/traj/import/?src=" + file, function (r) {
        var msg = r["ids"].length + " trajectories have been successfully imported.";
        bootbox.hideAll();
        bootbox.alert(msg);
    }).fail(function () {
        bootbox.hideAll();
        bootbox.alert("<span class='text-danger'><i class='fa fa-warning'></i> Something is wrong while processing the file!</span>");
    });
}

function map_import(file) {
    bootbox.prompt("Which city does this file describe?", function (city) {
        if (city != null && city != "") {
            bootbox.hideAll();
            bootbox.dialog({
                message: "<span id='map-import-loading-span'><i id='spinner' class='text-info fa fa-spinner'></i> Cleaning previous import of \"" + file + "\", please be patient...</span>",
                closeButton: false
            });
            $.get(API_SERVER + "avatar/api/road_network/remove/?city=" + city).always(function () {
                $("#spinner").switchClass("fa-spinner", "fa-check").switchClass("text-info", "text-success");
                $("#map-import-loading-span").append(" OK.<br/><i class='text-info fa fa-spinner'></i> Importing \"" + file + "\", please be patient...");
                $.get(API_SERVER + "avatar/api/road_network/create/?city=" + city + "&src=" + file, function (r) {
                    var msg = "<p>Import completed successfully.</p>";
                    msg += "<p>";
                    msg += "Road Network ID: " + r["road_network_id"] + "<br/>";
                    msg += "Road Network Name: " + r["road_network_name"] + "<br/>";
                    msg += "# of Roads: " + r["road_count"] + "<br/>";
                    msg += "# of Intersections: " + r["intersection_count"];
                    msg += "</p>";
                    bootbox.hideAll();
                    bootbox.alert(msg);
                }).fail(function () {
                    bootbox.hideAll();
                    bootbox.alert("<span class='text-danger'><i class='fa fa-warning'></i> Something is wrong while processing the file!</span>");
                });
            });
        }
    });

}