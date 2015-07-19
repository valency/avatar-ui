$(document).ready(function () {
    $("#map_canvas").width($(window).width() - 300);
    var map = new BMap.Map("map_canvas");
    map.addControl(new BMap.NavigationControl());
    map.addControl(new BMap.ScaleControl());
    map.addControl(new BMap.OverviewMapControl());
    map.addControl(new BMap.MapTypeControl());
    var point = new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point, 15);
});