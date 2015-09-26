$(document).ready(function () {
    $.get(API_SERVER + "avatar/traj/get_all/", function (r) {
        $("#traj-list-container").html("");
        for (var i = 0; i < r.ids.length; i++) {
            var html = "<p id='traj_container_" + r.ids[i] + "'>";
            html += "<span class='text-primary'><i class='fa fa-cube'></i> " + r.ids[i] + "</span><br/>";
            html += "<span id='traj_detail_" + r.ids[i] + "'></span>";
            html += "<a href='javascript:void(0)' onclick=\"load_traj('" + r.ids[i] + "')\">Load Details</a> | ";
            html += "<a href='javascript:void(0)' onclick=\"map_matching('" + r.ids[i] + "')\">Perform Map-Matching</a> | ";
            html += "<a href='javascript:void(0)' onclick=\"cut_traj('" + r.ids[i] + "')\">Truncate</a> | ";
            html += "<a href='javascript:void(0)' onclick=\"delete_traj('" + r.ids[i] + "')\" class='text-danger'>Delete</a>";
            html += "</p>";
            $("#traj-list-container").append(html);
        }
    });
    $.get(API_SERVER + "avatar/road_network/get_all/", function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#search-city").append("<option value='" + data[i].id + "'>" + data[i].city + "</option>");
        }
    });
});


function load_traj(id) {
    bootbox.dialog({
        message: "<i class='fa fa-spinner'></i> Loading trajectory, please be patient...",
        closeButton: false
    });
    $.get(API_SERVER + "avatar/traj/get/?id=" + id, function (traj) {
        var html = "<span class='bold'>Taxi: </span> " + traj.taxi + "</span><br/>";
        html += "<span class='bold'>Trace ID: </span> " + traj.trace.id + "</span><br/>";
        html += "<span class='bold'>Path ID: </span> " + (traj.path ? traj.path.id : "null") + "</span><br/>";
        html += "<span class='bold'># of Sample Points: </span> " + traj.trace.p.length + "</span><br/>";
        bootbox.hideAll();
        $("#traj_detail_" + id).html(html);
    }).fail(function () {
        bootbox.hideAll();
        bootbox.alert("<span class='text-danger'><i class='fa fa-warning'></i> Something is wrong while loading trajectory: " + id + " !</span>");
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
                    bootbox.alert("Successfully truncated trajectory: " + id + "<br/>New trajectory ID: " + r.id, function () {
                        location.reload();
                    });
                }).fail(function () {
                    bootbox.hideAll();
                    bootbox.alert("<span class='text-danger'><i class='fa fa-warning'></i> Something is wrong while truncating trajectory: " + id + " !</span>");
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
        bootbox.alert("Successfully map-matched trajectory: " + id, function () {
            load_traj(id);
        });
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