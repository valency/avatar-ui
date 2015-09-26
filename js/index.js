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
    $.get(API_SERVER + "avatar/traj/get_all/", function (data) {
        $("#search-id").typeahead({source: data.ids});
    });
    $('#search-id').on('keyup', function (e) {
        if (e.which == 13) {
            e.preventDefault();
            $('#search-id').prop("disabled", true);
            bootbox.dialog({
                message: "<i class='fa fa-spinner'></i> Loading trajectory, please be patient...",
                closeButton: false
            });
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
    // City selector
    $.get(API_SERVER + "avatar/road_network/get_all/", function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#search-city").append("<option value='" + data[i].id + "'>" + data[i].city + "</option>");
        }
    });
});

function search(trajid) {
    var search_range = $("#search-range").val().split(";");
    $.get(API_SERVER + "avatar/traj/get/?id=" + trajid + "&ts=" + moment().startOf('day').seconds(search_range[0]).format('HH:mm:ss') + "&td=" + moment().startOf('day').seconds(search_range[1]).format('HH:mm:ss'), function (data) {
        traj = data;
        var html = "<p><span class='bold text-success'>" + traj.id + "</span><br/>";
        html += "<span class='label label-info'><i class='fa fa-taxi'></i> " + traj.taxi + "</span> ";
        html += "<span class='label label-info'><i class='fa fa-map-marker'></i> " + traj.trace.p.length + "</span> ";
        if (traj.path != null) html += "<span class='label label-info'><i class='fa fa-map-signs'></i> Map-Matched</span>";
        html += "</p><p>";
        //html += "<button class='btn btn-primary btn-xs' type='button' onclick='map_matching();'><i class='fa fa-globe'></i> Perform Map-Matching</button>";
        html += "</p>";
        $("#console").html(html);
        $('#search-id').prop("disabled", false);
        plot();
    });
}

function plot() {
    bootbox.dialog({
        message: "<i class='fa fa-spinner'></i> Plotting, please be patient...",
        closeButton: false
    });
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
                    bootbox.hideAll();
                }
            }
        },
        error: function () {
            bootbox.alert("<span class='text-danger'><i class='fa fa-exclamation-triangle'></i> Error while plotting: converting point from Baidu Maps cannot proceed.</span>");
        }
    });
}
