var API_DOMAIN = "0.0.0.0";
if (API_DOMAIN == "0.0.0.0") {
    API_DOMAIN = location.hostname;
    console.warn("API domain not set, automatically set to the same domain of UI server (" + API_DOMAIN + ").");
}
var API_PORT = 9001;
var API_SERVER = "http://" + API_DOMAIN + ":" + API_PORT + "/";
var COLOR_PALETTE = ["#467D97", "#5DA5DA", "#FAA43A", "#60BD68", "#F17CB0", "#B2912F", "#B276B2", "#DECF3F", "#F15854", "#A03423"];
var LAT_OFFSET = 0.0060;
var LNG_OFFSET = 0.0065;