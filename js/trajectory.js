$(document).ready(function () {
    $('#file_upload').fileupload({
        dataType: 'json',
        acceptFileTypes: '/(\.|\/)(csv|txt)$/i',
        done: function (e, data) {
            setTimeout(function () {
                window.location.reload();
            }, 1000);
        },
        progressall: function (e, data) {
            $(".progress").show();
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $(".progress-bar").css('width', progress + '%');
        }
    });
    $.get(API_SERVER + "avatar/traj/get_all/", function (r) {
        for (var i = 0; i < r.ids.length; i++) {
            var html = "<tr>";
            html += "<td onclick=\"load_traj('" + r.ids[i] + "');\"><code>" + r.ids[i] + "</code></td>";
            html += "<td><a href='javascript:void(0)' onclick=\"map_matching('" + r.ids[i] + "');\">Perform Map-Matching</a></td>";
            html += "<td><a href='javascript:void(0)' onclick=\"cut_traj('" + r.ids[i] + "');\">Truncate</a></td>";
            html += "<td><a href='javascript:void(0)' onclick=\"delete_traj('" + r.ids[i] + "');\" class='text-danger'>Delete</a></td>";
            html += "</tr>";
            $("#traj-list-container>tbody").append(html);
        }
        $('#traj-list-container').DataTable();
    });
    $.get(API_SERVER + "avatar/road_network/get_all/", function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#search-city").append("<option value='" + data[i].id + "'>" + data[i].city + "</option>");
        }
    });
    $('#traj-table').DataTable();
});


function load_traj(id) {
    bootbox.dialog({
        message: "<i class='fa fa-spinner'></i> Loading trajectory, please be patient...",
        closeButton: false
    });
    $.get(API_SERVER + "avatar/traj/get/?id=" + id, function (traj) {
        var html = "<span class='bold'>Trace ID: </span> " + traj.trace.id + "</span><br/>";
        html += "<span class='bold'>Path ID: </span> " + (traj.path ? traj.path.id : "null") + "</span><br/>";
        html += "<span class='bold'>Taxi: </span> " + traj.taxi + "</span><br/>";
        html += "<span class='bold'># of Sample Points: </span> " + traj.trace.p.length + "</span><br/>";
        html += "<span class='bold'>Start Time: </span> " + traj.trace.p[0].t + "</span><br/>";
        html += "<span class='bold'>End Time: </span> " + traj.trace.p[traj.trace.p.length - 1].t + "</span>";
        bootbox.hideAll();
        bootbox.dialog({
            title: "<code>" + traj.id + "</code>",
            message: html,
            buttons: {
                OK: function () {
                    bootbox.hideAll();
                }
            }
        });
    }).fail(function () {
        bootbox.hideAll();
        bootbox.alert("<span class='text-danger'><i class='fa fa-warning'></i> Something is wrong while loading trajectory!</span>");
    });
}

function cut_traj(id) {
    bootbox.dialog({
        title: "Truncate Trajectory",
        message: "<p><input id='time-range'/></p>",
        buttons: {
            Proceed: function () {
                bootbox.dialog({
                    message: "<i class='fa fa-spinner'></i> Truncating trajectory, please be patient...",
                    closeButton: false
                });
                var time_range = $("#time-range").val().split(";");
                $.get(API_SERVER + "avatar/traj/truncate/?id=" + id + "&ts=" + moment().startOf('day').seconds(time_range[0]).format('HH:mm:ss') + "&td=" + moment().startOf('day').seconds(time_range[1]).format('HH:mm:ss'), function (r) {
                    bootbox.hideAll();
                    bootbox.alert("Successfully truncated trajectory: <code>" + id + "</code><br/>New trajectory ID: <code>" + r.id + "</code>", function () {
                        location.reload();
                    });
                }).fail(function () {
                    bootbox.hideAll();
                    bootbox.alert("<span class='text-danger'><i class='fa fa-warning'></i> Something is wrong while truncating trajectory!</span>");
                });
            }
        }
    }).on('shown.bs.modal', function (e) {
        $("#time-range").ionRangeSlider({
            type: "double",
            min: 0,
            max: 24 * 3600 - 1,
            from: 12 * 3600,
            to: 13 * 3600,
            grid: true,
            prettify: function (n) {
                return moment().startOf('day').seconds(n).format('HH:mm');
            }
        });
    });
}

function map_matching(id) {
    bootbox.dialog({
        message: "<i class='fa fa-spinner'></i> Performing map-matching, please be patient...",
        closeButton: false
    });
    $.get(API_SERVER + "avatar/map-matching/perform/?id=" + id + "&city=" + $("#search-city").val(), function (data) {
        bootbox.hideAll();
        bootbox.alert("Successfully map-matched trajectory: <code>" + id + "</code>");
    }).fail(function () {
        bootbox.hideAll();
        bootbox.alert("<span class='text-danger'><i class='fa fa-exclamation-triangle'></i> Something is wrong during map-matching!</span>");
    });
}

function delete_traj(id) {
    bootbox.dialog({
        title: "Delete Trajectory",
        message: "<p>The following trajectory(s) will be deleted:</p><p class='text-danger'>" + id + "</p>",
        buttons: {
            Proceed: function () {
                $.get(API_SERVER + "avatar/traj/remove/?id=" + id, function (r) {
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
            $.get(API_SERVER + "avatar/traj/remove_all/", function (r) {
                bootbox.hideAll();
                bootbox.alert("All trajectories have been successfully deleted.", function () {
                    location.reload();
                });
            }).fail(function () {
                bootbox.hideAll();
                bootbox.alert("<span class='text-danger'><i class='fa fa-warning'></i> Something is wrong while processing the file!</span>");
            });
        }
    });
}

function generate_traj() {
    var html = "<form class='form-horizontal'>";
    html += "<div class='form-group'>";
    html += "<label for='traj_generate_count' class='col-sm-3 control-label'># of Trajectories</label>";
    html += "<div class='col-sm-9'>";
    html += "<input class='form-control input-sm' type='number' id='traj-generate-count' value='3'>";
    html += "</div>";
    html += "</div>";
    html += "<div class='form-group'>";
    html += "<label for='traj_generate_count' class='col-sm-3 control-label'># of Sample Points</label>";
    html += "<div class='col-sm-9'>";
    html += "<input class='form-control input-sm' type='number' id='traj-generate-points' value='10'>";
    html += "</div>";
    html += "</div>";
    html += "</form>";
    bootbox.dialog({
        title: "Generate Synthetic Trajectories",
        message: html,
        buttons: {
            Proceed: function () {
                bootbox.hideAll();
                bootbox.dialog({
                    message: "<i class='fa fa-spinner'></i> Generating synthetic trajectories, please be patient...",
                    closeButton: false
                });
                $.get(API_SERVER + "avatar/simulator/generate_syn_traj/?city=" + $("#search-city").val() + "&traj=" + $("#traj-generate-count").val() + "&point=" + $("#traj-generate-points").val(), function (r) {
                    bootbox.hideAll();
                    var html = "<p>The following trajectories have been successfully generated:</p>";
                    html += "<p>";
                    for (var i = 0; i < r["traj_id"].length; i++) {
                        if (i > 0 && i % 2 == 0)html += "<br/>";
                        html += "<code>" + r["traj_id"][i] + "</code> ";
                    }
                    html += "</p>";
                    bootbox.alert(html, function () {
                        location.reload();
                    });
                }).fail(function () {
                    bootbox.hideAll();
                    bootbox.alert("<span class='text-danger'><i class='fa fa-warning'></i> Something is wrong while generating synthetic trajectories!</span>");
                });
            }
        }
    });
}

function traj_file_delete(file) {
    bootbox.dialog({
        title: "Delete Data",
        message: "<p>The following file(s) will be deleted:</p><p class='text-danger'>" + file + "</p>",
        buttons: {
            Proceed: function () {
                $.get("data/trajectory/delete.php?f=" + file, function (r) {
                    location.reload();
                });
            }
        }
    });
}

function traj_file_import(file) {
    bootbox.dialog({
        message: "<i class='fa fa-spinner'></i> Importing \"" + file + "\", please be patient...",
        closeButton: false
    });
    $.get(API_SERVER + "avatar/traj/import/?src=" + file, function (r) {
        var msg = r["ids"].length + " trajectories have been successfully imported.";
        bootbox.hideAll();
        bootbox.alert(msg);
    }).fail(function () {
        bootbox.hideAll();
        bootbox.alert("<span class='text-danger'><i class='fa fa-warning'></i> Something is wrong while processing the file!</span>");
    });
}