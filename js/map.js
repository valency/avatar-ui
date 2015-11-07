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
    $.get(API_SERVER + "avatar/road_network/get_all/", function (r) {
        $("#map-list-container").html("");
        for (var i = 0; i < r.length; i++) {
            var html = "";
            if (i > 0) html += "<hr/>";
            html += "<p>";
            html += "<span class='text-primary'><i class='fa fa-cube'></i> " + r[i].city + "</span><br/>";
            html += "<span class='bold'>Road Network ID: </span><span>" + r[i].id + "</span><br/>";
            html += "<span class='bold'># of Roads: </span><span>" + r[i].road_count + "</span><br/>";
            html += "<span class='bold'># of Intersections: </span><span>" + r[i].intersection_count + "</span><br/>";
            html += "<span class='bold'># of Grid Cells: </span><span>" + r[i].grid_cell_count + "</span><br/>";
            html += "<span class='bold'># of Grid Cells on Latitude: </span><span>" + r[i].grid_lat_count + "</span><br/>";
            html += "<span class='bold'># of Grid Cells on Longitude: </span><span>" + r[i].grid_lng_count + "</span><br/>";
            html += "<span class='bold'>Max Point of Map: </span><span>" + r[i].pmax.lat + ", " + r[i].pmax.lng + "</span><br/>";
            html += "<span class='bold'>Min Point of Map: </span><span>" + r[i].pmin.lat + ", " + r[i].pmin.lng + "</span><br/>";
            html += "<a href='javascript:void(0)' onclick=\"create_grid('" + r[i].city + "','" + r[i].id + "')\">Create Grid</a> | ";
            html += "<a href='javascript:void(0)' onclick=\"create_graph('" + r[i].city + "','" + r[i].id + "')\">Create Graph Model</a> | ";
            html += "<a href='javascript:void(0)' onclick=\"clear_orphan('" + r[i].city + "','" + r[i].id + "')\">Clear Orphan Roads</a> | ";
            html += "<a href='javascript:void(0)' onclick=\"delete_map('" + r[i].city + "','" + r[i].id + "')\" class='text-danger'>Delete</a>";
            html += "</p>";
            $("#map-list-container").append(html);
        }
    });
    $('#maps-table').DataTable();
});


function create_grid(city, id) {
    bootbox.dialog({
        title: "Create Grid",
        message: "<p>Grid system (necessary for map-matching and other grid-based functions) of the following map(s) will be created:</p><p class='text-danger'>" + city + " (ID: " + id + ")</p>",
        buttons: {
            Proceed: function () {
                bootbox.dialog({
                    message: "<i class='fa fa-spinner'></i> Creating grid system, please be patient...",
                    closeButton: false
                });
                $.get(API_SERVER + "avatar/road_network/grid/create/?id=" + id, function (r) {
                    bootbox.hideAll();
                    bootbox.alert(r["grid_cell_count"] + " grid cells have been successfully created.", function () {
                        location.reload();
                    });
                }).fail(function () {
                    bootbox.hideAll();
                    bootbox.alert("<span class='text-danger'><i class='fa fa-warning'></i> Something is wrong while creating the grid system!</span>");
                });
            }
        }
    });
}

function create_graph(city, id) {
    bootbox.dialog({
        title: "Create Graph Model",
        message: "<p>Graph model (necessary for map-matching and some other functions) of the following map(s) will be created:</p><p class='text-danger'>" + city + " (ID: " + id + ")</p>",
        buttons: {
            Proceed: function () {
                bootbox.dialog({
                    message: "<i class='fa fa-spinner'></i> Creating graph model, please be patient...",
                    closeButton: false
                });
                $.get(API_SERVER + "avatar/road_network/graph/create/?id=" + id, function (r) {
                    bootbox.hideAll();
                    bootbox.alert("Graph model has been successfully created.", function () {
                        location.reload();
                    });
                }).fail(function () {
                    bootbox.hideAll();
                    bootbox.alert("<span class='text-danger'><i class='fa fa-warning'></i> Something is wrong while creating the graph model!</span>");
                });
            }
        }
    });
}

function delete_map(city, id) {
    bootbox.dialog({
        title: "Delete Map",
        message: "<p>The following map(s) will be deleted:</p><p class='text-danger'>" + city + " (ID: " + id + ")</p>",
        buttons: {
            Proceed: function () {
                bootbox.dialog({
                    message: "<i class='fa fa-spinner'></i> Deleting map, please be patient...",
                    closeButton: false
                });
                $.get(API_SERVER + "avatar/road_network/remove/?id=" + id, function (r) {
                    location.reload();
                }).fail(function () {
                    bootbox.hideAll();
                    bootbox.alert("<span class='text-danger'><i class='fa fa-warning'></i> Something is wrong while deleting the map!</span>");
                });
            }
        }
    });
}

function clear_orphan(city, id) {
    bootbox.dialog({
        title: "Clear Orphan Roads",
        message: "<p>The orphan roads (roads are not connected to any other roads) of the following map(s) will be deleted:</p><p class='text-danger'>" + city + " (ID: " + id + ")</p>",
        buttons: {
            Proceed: function () {
                bootbox.dialog({
                    message: "<i class='fa fa-spinner'></i> Clearing orphan roads, please be patient...",
                    closeButton: false
                });
                $.get(API_SERVER + "avatar/road_network/clear_orphan/?id=" + id, function (r) {
                    bootbox.hideAll();
                    bootbox.alert(r["removed"] + " orphan roads have been successfully cleared.", function () {
                        location.reload();
                    });
                }).fail(function () {
                    bootbox.hideAll();
                    bootbox.alert("<span class='text-danger'><i class='fa fa-warning'></i> Something is wrong while clearing orphan roads!</span>");
                });
            }
        }
    });
}

function map_file_delete(file) {
    bootbox.dialog({
        title: "Delete Data",
        message: "<p>The following file(s) will be deleted:</p><p class='text-danger'>" + file + "</p>",
        buttons: {
            Proceed: function () {
                $.get("data/map/delete.php?f=" + file, function (r) {
                    location.reload();
                });
            }
        }
    });
}

function map_file_import(file) {
    bootbox.prompt("Which city does this file describe?", function (city) {
        if (city != null && city != "") {
            bootbox.hideAll();
            bootbox.dialog({
                message: "<i class='fa fa-spinner'></i> Importing \"" + file + "\", please be patient...",
                closeButton: false
            });
            $.get(API_SERVER + "avatar/road_network/create/?city=" + city + "&src=" + file, function (r) {
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
                bootbox.alert("<span class='text-danger'><i class='fa fa-warning'></i> Something is wrong while processing the file! Maybe the city name is duplicated.</span>");
            });
        }
    });
}