var map = null;
var traj = null;
var polyline = null;
var markers = [];

$(document).ready(function () {
    // Baidu map
    $("#map_canvas").width($(window).width() - 300);
    map = new BMap.Map("map_canvas");
    map.addControl(new BMap.NavigationControl());
    map.addControl(new BMap.ScaleControl());
    map.addControl(new BMap.OverviewMapControl());
    map.addControl(new BMap.MapTypeControl());
    var point = new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point, 15);
    // Search button
    $.get(API_SERVER + "avatar/api/traj/get_all/", function (data) {
        $("#search_id").typeahead({source: data.ids});
    });
    $('#search_id').on('keyup', function (e) {
        if (e.which == 13) {
            e.preventDefault();
            $('#search_id').prop("disabled", true);
            $("#console").html("<span class='text-danger'>Loading...</span>");
            setTimeout(function () {
                search($("#search_id").val());
            }, 1000);
        }
    });
    // Time range slider
    $("#search_range").ionRangeSlider({
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

function search(trajid) {
    var search_range = $("#search_range").val().split(";");
    $.get(API_SERVER + "avatar/api/traj/get/?id=" + trajid + "&ts=" + moment().startOf('day').seconds(search_range[0]).format('HH:mm:ss') + "&td=" + moment().startOf('day').seconds(search_range[1]).format('HH:mm:ss'), function (data) {
        traj = data;
        var html = "<p><span class='bold'>ID: </span>" + traj.id + "<br/>";
        html += "<span class='bold'>Taxi: </span>" + traj.taxi + "<br/>";
        html += "<span class='bold'>Size: </span>" + traj.trace.p.length + "</p>";
        $("#console").html(html);
        $('#search_id').prop("disabled", false);
        plot();
    });
}

function plot() {
    $("#console").append("<span class='text-danger'>Plotting...</span>");
    // Clear out
    map.clearOverlays();
    markers = [];
    var points = [];
    // Plot
    for (var i = 0; i < traj.trace.p.length; i++) {
        var p = traj.trace.p[i];
        var point = new BMap.Point(p.p.lng, p.p.lat);
        points.push(point);
        var marker = new BMap.Marker(point, {title: i + "|" + p.t + "|" + p.p.lat + "|" + p.p.lng});
        markers.push(marker);
        map.addOverlay(marker);
    }
    polyline = new BMap.Polyline(points, {
        strokeColor: "blue",
        strokeWeight: 5,
        strokeOpacity: 0.8
    });
    map.addOverlay(polyline);
    map.panTo(points[0]);
    $("#console").children().last().remove();
}