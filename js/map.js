$(document).ready(function () {
    $.get(API_SERVER + "avatar/road_network/get_all/", function (r) {
        $("#map-list-container").html("");
        for (var i = 0; i < r.length; i++) {
            var html = "<p>";
            html += "<span class='text-info'><i class='fa fa-cube'></i> " + r[i].city + "</span><br/>";
            html += "<span class='bold'>Road Network ID: </span><span>" + r[i].id + "</span><br/>";
            html += "<span class='bold'># of Roads: </span><span>" + r[i].road_count + "</span><br/>";
            html += "<span class='bold'># of Intersections: </span><span>" + r[i].intersection_count + "</span><br/>";
            html += "<span class='bold'># of Grid Cells: </span><span>" + r[i].grid_cell_count + "</span><br/>";
            html += "<span class='bold'># of Grid Cells on Latitude: </span><span>" + r[i].grid_lat_count + "</span><br/>";
            html += "<span class='bold'># of Grid Cells on Longitude: </span><span>" + r[i].grid_lng_count + "</span><br/>";
            html += "<span class='bold'>Max Point of Map: </span><span>" + r[i].pmax.lat + ", " + r[i].pmax.lng + "</span><br/>";
            html += "<span class='bold'>Min Point of Map: </span><span>" + r[i].pmin.lat + ", " + r[i].pmin.lng + "</span><br/>";
            html += "<a href='javascript:void(0)' onclick=\"create_grid('" + r[i].city + "','" + r[i].id + "')\">Create Grid</a>";
            html += "</p>";
            $("#map-list-container").append(html);
        }
    });
});


function create_grid(city, id) {
    bootbox.dialog({
        message: "<i class='fa fa-spinner'></i> Creating grid system for \"" + city + "\" (" + id + "), please be patient...",
        closeButton: false
    });
    $.get(API_SERVER + "avatar/road_network/grid/create/?id=" + id, function (r) {
        bootbox.hideAll();
        bootbox.alert(r["grid_cell_count"] + " grid cells have been successfully created for \"" + city + "\" (" + id + ").");
    }).fail(function () {
        bootbox.hideAll();
        bootbox.alert("<span class='text-danger'><i class='fa fa-warning'></i> Something is wrong while creating the grid system for \"" + city + "\" (" + id + ") !</span>");
    });
}
