$(document).ready(function () {
    $.get(API_SERVER + "avatar/traj/get_all/", function (r) {
        $("#traj-list-container").html("");
        for (var i = 0; i < r.ids.length; i++) {
            var html = "<p id='traj_container_" + r.ids[i] + "'>";
            html += "<span class='text-primary'><i class='fa fa-cube'></i> " + r.ids[i] + "</span><br/>";
            html += "<span id='traj_detail_" + r.ids[i] + "'></span>";
            html += "<a href='javascript:void(0)' onclick=\"load_traj('" + r.ids[i] + "')\">Load Details</a> | ";
            html += "<a href='javascript:void(0)' onclick=\"map_matching('" + r.ids[i] + "')\">Perform Map-Matching</a> | ";
            html += "<a href='javascript:void(0)' onclick=\"delete_traj('" + r.ids[i] + "')\" class='text-danger'>Delete</a>";
            html += "</p>";
            $("#traj-list-container").append(html);
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
        bootbox.alert("<span class='text-danger'><i class='fa fa-warning'></i> Something is wrong while loading trajectory " + id + " !</span>");
    });
}
//
//function delete_map(city, id) {
//    bootbox.dialog({
//        title: "Delete Map",
//        message: "<p>The following map(s) will be deleted:</p><p class='text-danger'>" + city + " (ID: " + id + ")</p>",
//        buttons: {
//            Proceed: function () {
//                $.get(API_SERVER + "avatar/road_network/remove/?id=" + id, function (r) {
//                    location.reload();
//                });
//            }
//        }
//    });
//
//}