var map = null;
var traj = null;
var trace = null;
var markers = [];

$(document).ready(function () {
    // Baidu map
    $("#map-canvas").width($(window).width() - 300);
    map = new BMap.Map("map-canvas");
    map.addControl(new BMap.NavigationControl());
    map.addControl(new BMap.ScaleControl());
    map.addControl(new BMap.OverviewMapControl());
    map.addControl(new BMap.MapTypeControl());
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);
    // Search button
    $.get(API_SERVER + "avatar/api/traj/get_all/", function (data) {
        $("#search-id").typeahead({source: data.ids});
    });
    $('#search-id').on('keyup', function (e) {
        if (e.which == 13) {
            e.preventDefault();
            $('#search-id').prop("disabled", true);
            $("#console").html("<span class='text-danger'>Loading...</span>");
            setTimeout(function () {
                search($("#search-id").val());
            }, 1000);
        }
    });
    // Time range slider
    $("#search-range").ionRangeSlider({
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
    var search_range = $("#search-range").val().split(";");
    $.get(API_SERVER + "avatar/api/traj/get/?id=" + trajid + "&ts=" + moment().startOf('day').seconds(search_range[0]).format('HH:mm:ss') + "&td=" + moment().startOf('day').seconds(search_range[1]).format('HH:mm:ss'), function (data) {
        traj = data;
        var html = "<p><span class='bold'>ID: </span>" + traj.id + "<br/>";
        html += "<span class='bold'>Taxi: </span>" + traj.taxi + "<br/>";
        html += "<span class='bold'>Size: </span>" + traj.trace.p.length + "</p>";
        $("#console").html(html);
        $('#search-id').prop("disabled", false);
        plot();
    });
}

function plot() {
    $("#console").append("<span class='text-danger'>Plotting...</span>");
    // Clear out
    map.clearOverlays();
    markers = [];
    // Plot
    for (var i = 0; i < traj.trace.p.length; i++) {
        var p = traj.trace.p[i];
        var point = new BMap.Point(p.p.lng, p.p.lat);
        baidu_gps_convert(point, i);
    }
}

function baidu_gps_convert(point, sequence) {
    $.ajax({
        url: "http://api.map.baidu.com/geoconv/v1/?coords=" + point.lng + "," + point.lat + "&ak=3juZrhGVW1FG9xSdspQHuSpU&output=json",
        dataType: 'jsonp',
        success: function (r) {
            if (r.status == 0) {
                var marker = new BMap.Marker(new BMap.Point(r.result[0].x, r.result[0].y), {title: "Point " + sequence});
                marker.addEventListener("click", function () {
                    var msg = "<span class='bold'>ID: </span>" + traj.trace.p[sequence]["id"] + "<br/>";
                    msg += "<span class='bold'>Time Stamp: </span>" + traj.trace.p[sequence]["t"] + "<br/>";
                    msg += "<span class='bold'>Latitude : </span>" + traj.trace.p[sequence]["p"]["lat"] + "<br/>";
                    msg += "<span class='bold'>Longitude: </span>" + traj.trace.p[sequence]["p"]["lng"] + "<br/>";
                    msg += "<span class='bold'>On-Map Latitude : </span>" + this.getPosition().lat + "<br/>";
                    msg += "<span class='bold'>On-Map Longitude: </span>" + this.getPosition().lng + "<br/>";
                    msg += "<span class='bold'>Speed: </span>" + traj.trace.p[sequence]["speed"] + "<br/>";
                    msg += "<span class='bold'>Angle: </span>" + traj.trace.p[sequence]["angle"] + "<br/>";
                    msg += "<span class='bold'>Occupancy: </span>" + traj.trace.p[sequence]["occupy"];
                    this.openInfoWindow(new BMap.InfoWindow(msg, {title: "<span class='bold text-danger'>Point " + sequence + "</span><hr/>"}));
                });
                markers[sequence] = marker;
                map.addOverlay(marker);
                var points = [];
                if (markers.length == traj.trace.p.length) {
                    for (var i = 0; i < markers.length; i++) {
                        if (markers[i] == undefined) {
                            return;
                        } else {
                            points.push(markers[i].getPosition())
                        }
                    }
                    trace = new BMap.Polyline(points, {
                        strokeColor: "blue",
                        strokeWeight: 5,
                        strokeOpacity: 0.8
                    });
                    map.addOverlay(trace);
                    map.panTo(point);
                    $("#console").children().last().remove();
                }
            }
        },
        error: function () {
            alert("Error");
        }
    });
}
