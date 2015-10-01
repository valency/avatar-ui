var map = null;
var traj = null;
var trace = null;
var trace_rendered = false;
var path = null;
var path_count = -1;
var path_points = [];
var path_rendered = false;
var markers = [];
var specific_road = null;
var specific_road_points = [];
var specific_road_count = -1;

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
        // Clear out
        trace_rendered = false;
        path_rendered = false;
        map.clearOverlays();
        markers = [];
        // Plot
        bootbox.hideAll();
        if (traj.trace.p.length > 0) plot();
        else bootbox.alert("<span class='text-warning'><i class='fa fa-exclamation-triangle'></i> The trajectory you selected has no trace points.</span>");
    });
}

function plot() {
    bootbox.dialog({
        message: "<i class='fa fa-spinner'></i> Plotting, please be patient...",
        closeButton: false
    });
    // Plot trace
    for (var i = 0; i < traj.trace.p.length; i++) {
        var p = traj.trace.p[i];
        var point = new BMap.Point(p.p.lng, p.p.lat);
        baidu_gps_convert(point, i, "trace");
    }
    // Plot path
    if (traj.path != null) {
        path_count = 0;
        path_points = [];
        for (i = 0; i < traj.path.road.length; i++) {
            path_count += traj.path.road[i].road.p.length;
        }
        var sequence = 0;
        for (i = 0; i < traj.path.road.length; i++) {
            // Check connection
            if (i > 0) {
                if (traj.path.road[i - 1].road.intersection[1].id == traj.path.road[i - 1].road.intersection[1].id) {
                    traj.path.road[i].road.p.reverse();
                } else if (traj.path.road[i - 1].road.intersection[1].id != traj.path.road[i - 1].road.intersection[0].id) {
                    console.log("WARNING: Some roads within the path are not connected.");
                }
            }
            // Added to point list
            for (var j = 0; j < traj.path.road[i].road.p.length; j++) {
                p = traj.path.road[i].road.p[j];
                point = new BMap.Point(p.lng, p.lat);
                baidu_gps_convert(point, sequence, "path");
                sequence++;
            }
        }
    } else {
        path_rendered = true;
    }
}

function render_road(road_id) {
    $.get(API_SERVER + "avatar/road/get/?id=" + road_id, function (road) {
        if (specific_road) map.removeOverlay(specific_road);
        specific_road_points = [];
        specific_road_count = road.p.length;
        for (var i = 0; i < road.p.length; i++) {
            var point = new BMap.Point(road.p[i].lng, road.p[i].lat);
            baidu_gps_convert(point, i, "road");
        }
    });
}

function baidu_gps_convert(point, sequence, callback) {
    $.ajax({
        url: "http://api.map.baidu.com/geoconv/v1/?coords=" + point.lng + "," + point.lat + "&ak=3juZrhGVW1FG9xSdspQHuSpU&output=json",
        dataType: 'jsonp',
        success: function (r) {
            if (r.status == 0) {
                var point = new BMap.Point(r.result[0].x, r.result[0].y);
                if (callback == "trace") {
                    var marker = new BMap.Marker(point, {title: "Point " + sequence});
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
                        if (traj.path) {
                            var flag = false;
                            for (var i = 0; i < traj.path.road.length; i++) {
                                if (traj.path.road[i].p) {
                                    var point_sequences = traj.path.road[i].p.split(",");
                                    for (var j = 0; j < point_sequences.length; j++) {
                                        if (sequence == parseInt(point_sequences[j])) {
                                            flag = true;
                                            msg += "<br/><span class='bold'>Map-Matched Road: </span>" + traj.path.road[i].road.id;
                                            render_road(traj.path.road[i].road.id);
                                            break;
                                        }
                                    }
                                }
                                if (flag) break;
                            }
                        }
                        var info_window = new BMap.InfoWindow(msg, {title: "<span class='bold text-danger'>Point " + sequence + "</span><hr/>"});
                        info_window.addEventListener("close", function () {
                            if (specific_road) map.removeOverlay(specific_road);
                            specific_road = null;
                        });
                        this.openInfoWindow(info_window);
                    });
                    markers[sequence] = marker;
                    map.addOverlay(marker);
                    if (markers.length == traj.trace.p.length) {
                        var points = [];
                        for (var i = 0; i < markers.length; i++) {
                            if (markers[i] == undefined) {
                                return;
                            } else {
                                points.push(markers[i].getPosition())
                            }
                        }
                        trace = new BMap.Polyline(points, {
                            strokeColor: "grey",
                            strokeWeight: 5,
                            strokeOpacity: 0.8
                        });
                        map.addOverlay(trace);
                        trace_rendered = true;
                        console.log("Trace has been rendered.");
                        if (trace_rendered && path_rendered) {
                            map.panTo(point);
                            bootbox.hideAll();
                        }
                    }
                } else if (callback == "path") {
                    path_points[sequence] = point;
                    if (path_points.length == path_count) {
                        for (i = 0; i < path_count; i++) {
                            if (path_points[i] == undefined) return;
                        }
                        path = new BMap.Polyline(path_points, {
                            strokeColor: "blue",
                            strokeWeight: 5,
                            strokeOpacity: 0.8
                        });
                        map.addOverlay(path);
                        path_rendered = true;
                        console.log("Path has been rendered.");
                        if (trace_rendered && path_rendered) {
                            map.panTo(point);
                            bootbox.hideAll();
                        }
                    }
                } else if (callback == "road") {
                    specific_road_points[sequence] = point;
                    if (specific_road_points.length == specific_road_count) {
                        for (i = 0; i < specific_road_count; i++) {
                            if (specific_road_points[i] == undefined) return;
                        }
                        specific_road = new BMap.Polyline(specific_road_points, {
                            strokeColor: "orange",
                            strokeWeight: 5,
                            strokeOpacity: 1
                        });
                        map.addOverlay(specific_road);
                        console.log("Requested road has been rendered.");
                    }
                }
            }
        },
        error: function () {
            bootbox.alert("<span class='text-danger'><i class='fa fa-exclamation-triangle'></i> Error while plotting: converting point from Baidu Maps cannot proceed.</span>");
        }
    });
}
