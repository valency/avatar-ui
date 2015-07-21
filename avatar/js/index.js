$(document).ready(function () {
    // Baidu map
    $("#map_canvas").width($(window).width() - 300);
    var map = new BMap.Map("map_canvas");
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
            $("#console").html("Loading...");
            setTimeout(function () {
                search($("#search_id").val());
            }, 1000);
        }
    });
});

function search(trajid) {
    $.get(API_SERVER + "avatar/api/traj/get/?id=" + trajid, function (data) {
        var html = "<p><span class='bold'>ID: </span>" + data.id + "<br/>";
        html += "<span class='bold'>Taxi: </span>" + data.taxi + "<br/>";
        html += "<span class='bold'>Size: </span>" + data.trace.p.length + "</p>";
        $("#console").html(html);
        $('#search_id').prop("disabled", false);
    });
}