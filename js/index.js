var TRACE_COLOR = "#2ea44f";
var PATH_COLOR = "#3399FF";
var MAP_MATCHED_ROAD_COLOR = "#FF9933";
var CANDIDATE_ROAD_COLOR = "red";
var TARGET_ROAD_COLOR = "black";

var map = null;
var traj = null;
var info_window = null;
var map_matched_road = null;
var candidate_roads = null;
var drag_marker_position = null;
var drag_road = null;
var dragging = false;


$(document).ready(function () {
    // Map
    var mapurl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    map = L.map('map-canvas', {
        center: [39.915, 116.404],
        zoom: 15,
    });

    L.tileLayer(mapurl).addTo(map);
  
    // Login
    var username = check_login();
    if (username) {
        var html = "<div class='col-md-6'><span><i class='fa fa-user'></i> " + username + "</span></div>";
        html += "<div class='col-md-6'><a href='javascript:void(0)' onclick='logout();location.reload();' class='pull-right'><i class='fa fa-sign-out'></i> Logout</a></div>";
        $("#user-form").html(html);
        $("#traj-form").removeClass("hidden");
    } else {
        $('#username').on('keyup', function (e) {
            if (e.which == 13) {
                e.preventDefault();
                login_or_register($("#username").val(), $("#password").val());
            }
        });
        $('#password').on('keyup', function (e) {
            if (e.which == 13) {
                e.preventDefault();
                login_or_register($("#username").val(), $("#password").val());
            }
        });
    }
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
    // City selector
    $.get(API_SERVER + "avatar/road_network/get_all/", function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#search-city").append("<option value='" + data[i].id + "'>" + data[i].city + "</option>");
        }
    });
});

function search(trajid) {
    // Clear out
    if (info_window) {
        if (map_matched_road) map.removeLayer(map_matched_road);
        map_matched_road = null;
    }
    if (traj) {
        for (var i = 0; i < traj.trace.p.length; i++) {
            var marker = traj.trace.p[i].marker;
            if (marker) map.removeLayer(marker);
        }
        if (traj.trace.object) map.removeLayer(traj.trace.object);
        if (traj.path) {
            for (i = 0; i < traj.path.road.length; i++) {
                if (traj.path.road[i].object) map.removeLayer(traj.path.road[i].object);
            }
        }
    }
    // Load data
    $.get(API_SERVER + "avatar/traj/get/?id=" + trajid, function (data) {
        traj = data;
        var html = "<p><span class='label label-info'><i class='fa fa-taxi'></i> " + traj.taxi + "</span></p>";
        html += "<p><span class='label label-info'><i class='fa fa-map-marker'></i> " + traj.trace.p.length + "</span></p>";
        if (traj.path != null) html += "<p><span class='label label-info'><i class='fa fa-map-signs'></i> Map-Matched</span></p>";
        $("#console").html(html);
        $('#search-id').prop("disabled", false);
        // Plot
        bootbox.hideAll();
        if (traj.trace.p.length > 0) plot();
        else bootbox.alert("<span class='text-warning'><i class='fa fa-exclamation-triangle'></i> The requested trajectory has no trace points.</span>");
    }).fail(function () {
        bootbox.hideAll();
        bootbox.alert("<span class='text-danger'><i class='fa fa-warning'></i> Something is wrong while loading trajectory: " + trajid + " !</span>");
    });
}

function find_map_matched_road_from_path(sequence) {
    for (var i = 0; i < traj.path.road.length; i++) {
        if (traj.path.road[i].p) {
            var point_sequences = traj.path.road[i].p.split(",");
            for (var j = 0; j < point_sequences.length; j++) {
                if (sequence == parseInt(point_sequences[j])) {
                    return i;
                }
            }
        }
    }
}

function plot() {
    bootbox.dialog({
        message: "<i class='fa fa-spinner'></i> Plotting, please be patient...",
        closeButton: false
    });
    // Plot trace markers
    var points = [];
    for (var i = 0; i < traj.trace.p.length; i++) {
        var p = traj.trace.p[i];
        delete p.p.id;
        points.push(p.p);
        p["marker"] = L.marker(p.p, {
            title: i.toString(),
            draggable: traj.path != null
        }).addTo(map);

        var sequence = p.marker.options.title;
        var msg = "<span class='bold text-danger'>Point " + sequence + "</span><hr/>";
        msg += "<span class='bold'>ID: </span>" + traj.trace.p[sequence]["id"] + "<br/>";
        msg += "<span class='bold'>Time Stamp: </span>" + traj.trace.p[sequence]["t"] + "<br/>";
        msg += "<span class='bold'>Latitude : </span>" + traj.trace.p[sequence]["p"]["lat"] + "<br/>";
        msg += "<span class='bold'>Longitude: </span>" + traj.trace.p[sequence]["p"]["lng"] + "<br/>";
        msg += "<span class='bold'>Speed: </span>" + traj.trace.p[sequence]["speed"] + "<br/>";
        msg += "<span class='bold'>Angle: </span>" + traj.trace.p[sequence]["angle"] + "<br/>";
        msg += "<span class='bold'>Occupancy: </span>" + traj.trace.p[sequence]["occupy"];
        if (traj.path) {
            var path_road_sequence = find_map_matched_road_from_path(sequence);
            msg += "<br/><span class='bold'>Map-Matched Road: </span>" + traj.path.road[path_road_sequence].road.id;
        }
        p["marker"].bindPopup(msg);
        // Handel marker events
        p["marker"].on("click", function () {
            if (traj.path) {
                var path_road_sequence = find_map_matched_road_from_path(this.options.title);
                render_road(traj.path.road[path_road_sequence].road.id, MAP_MATCHED_ROAD_COLOR, function (road_object) {
                    map_matched_road = road_object;
                });
            }
            this.openPopup();

            if (info_window) {
                if (map_matched_road) map.removeLayer(map_matched_road);
                map_matched_road = null;
            }
            info_window = this._popup;
            info_window.on("remove", function () {
                if (map_matched_road) map.removeLayer(map_matched_road);
                map_matched_road = null;
            });
        });

        if (traj.path) {
            p["marker"].on("dragstart", function (type, target) {
                if (info_window) {
                    if (map_matched_road) map.removeLayer(map_matched_road);
                    map_matched_road = null;
                }
                var sequence = this.options.title;
                // Draw current road
                render_road(traj.path.road[find_map_matched_road_from_path(sequence)].road.id, MAP_MATCHED_ROAD_COLOR, function (road_object) {
                    map_matched_road = road_object;
                });
                // Draw candidate roads
                candidate_roads = [];
                $.get(API_SERVER + "avatar/map-matching/find_candidates/?city=" + $("#search-city").val() + "&lat=" + traj.trace.p[sequence]["p"]["lat"] + "&lng=" + traj.trace.p[sequence]["p"]["lng"], function (candidates) {
                    for (var i = 0; i < Math.min(10, candidates.length); i++) {
                        render_road(candidates[i], CANDIDATE_ROAD_COLOR, function (road_object) {
                            candidate_roads.push(road_object);
                            // Only show road if dragging is still on
                            if (!dragging) map.removeLayer(road_object);
                        });
                    }
                });
                // Remember current position
                drag_marker_position = this.getLatLng();
                // Init target road object
                drag_road = {rendered: true};
                dragging = true;
            });
            p["marker"].on("drag", function (type, target, pixel, point) {
                if (drag_road.rendered) {
                    drag_road.rendered = false;
                    $.get(API_SERVER + "avatar/map-matching/find_candidates/?city=" + $("#search-city").val() + "&lat=" + this.getLatLng().lat + "&lng=" + this.getLatLng().lng, function (candidates) {
                        // Clear previous render
                        if (drag_road.object) map.removeLayer(drag_road.object);
                        // Render
                        drag_road.id = candidates[0];
                        render_road(drag_road.id, TARGET_ROAD_COLOR, function (road_object) {
                            drag_road.object = road_object;
                            drag_road.rendered = true;
                            // Only show road if dragging is still on
                            if (!dragging) map.removeLayer(road_object);
                        });
                    });
                }
            });
            p["marker"].on("dragend", function (type, target, pixel, point) {
                var sequence = this.options.title;
                var p = traj["trace"]["p"][sequence];
                // Stop dragging flag
                dragging = false;
                // Clean up previous road
                if (map_matched_road) map.removeLayer(map_matched_road);
                // Clean up target road
                if (drag_road.object) map.removeLayer(drag_road.object);
                // Clean up all candidate roads
                for (var i = 0; i < candidate_roads.length; i++) {
                    if (candidate_roads[i]) map.removeLayer(candidate_roads[i]);
                }
                // Push back to original position
                this.setLatLng(drag_marker_position);
                // Re-perform map-matching
                console.log("Trying to re-perform map-matching via: id = " + traj["id"] + ", pid = " + p["id"] + ", rid = " + drag_road["id"] + ", uid = " + $.cookie('avatar_id'));
                bootbox.dialog({
                    message: "<i class='fa fa-spinner'></i> Performing map-matching, please be patient...",
                    closeButton: false
                });
                $.get(API_SERVER + "avatar/map-matching/perform_with_label/?city=" + $("#search-city").val() + "&id=" + traj["id"] + "&pid=" + p["id"] + "&rid=" + drag_road["id"] + "&uid=" + $.cookie('avatar_id'), function (data) {
                    bootbox.hideAll();
                    search(traj["id"]);
                }).fail(function () {
                    bootbox.hideAll();
                    bootbox.alert("<span class='text-danger'><i class='fa fa-exclamation-triangle'></i> Something is wrong during map-matching!</span>");
                });
            });
        }

    }

    var polyline = L.polyline(points, {color: TRACE_COLOR, weight: 4, className: 'dashLines', opacity: 0.5}).addTo(map);
    map.fitBounds(polyline.getBounds());

    // Plot trace
    traj.trace.object = L.polyline(points,{
        stroke: true,
        color: TRACE_COLOR,
        opacity: 0
    }).addTo(map);
    
    // Plot path
    if (traj.path) {
        for (i = 0; i < traj.path.road.length; i++) {
            points = [];
            for (var j = 0; j < traj.path.road[i].road.p.length; j++) {
                points.push(traj.path.road[i].road.p[j]);
            }
            traj.path.road[i].object = L.polyline(points,{
                stroke:true,
                color: PATH_COLOR,
                opacity: 0.9,
                weight: 3
            });
            traj.path.road[i].object.addTo(map);
        }
    }
    bootbox.hideAll();
}

function render_road(road_id, color, callback) {
    $.get(API_SERVER + "avatar/road/get/?id=" + road_id, function (road) {
        var points = [];
        for (var i = 0; i < road.p.length; i++) {
            points.push(road.p[i]);
        }
        var road_object =  L.polyline(points,{
            stroke: true,
            color: color,
            opacity: 1.0,
            weight: 5,
            zIndex: 999
        }).addTo(map);
        callback(road_object);
    });
}
