<html>
<head>
    <?php require "php/lib.php"; ?>
    <title>The Avatar System</title>
    <link rel="stylesheet" href="lib/ion.rangeslider-2.0.13/css/ion.rangeSlider.css"/>
    <link rel="stylesheet" href="lib/ion.rangeslider-2.0.13/css/ion.rangeSlider.skinFlat.css"/>
    <link rel="stylesheet" href="css/index.css"/>
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAIVyPOw3xUIfL1g1sCXq3DQqf8XnTjIZM"></script>
    <script type="text/javascript" src="lib/ion.rangeslider-2.0.13/js/ion-rangeSlider/ion.rangeSlider.min.js"></script>
    <script type="text/javascript" src="js/index.js"></script>
</head>
<body>
<div id="dashboard-container">
    <div style="font-size:16px;" class="text-success">
        <span>The Avatar System</span>
        <span style="color:grey;font-size:9px;">v0.<?php echo date("n.j", filemtime("./index.php")); ?></span>

        <div class="btn-group pull-right">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                <i class="fa fa-cog"></i>
            </a>
            <ul class="dropdown-menu">
                <li><a href="upload.php" target="_blank">Data Management</a></li>
                <li><a href="map.php" target="_blank">Map Management</a></li>
                <li><a href="trajectory.php" target="_blank">Trajectory Management</a></li>
            </ul>
        </div>
    </div>
    <hr/>
    <div class="row" id="user-form">
        <div class="col-md-6 form-group">
            <input id="username" class="form-control input-sm" placeholder="Username"/>
        </div>
        <div class="col-md-6 form-group">
            <input id="password" class="form-control input-sm" placeholder="Password" type="password" autocomplete="off"/>
        </div>
    </div>
    <hr/>
    <div class="form-group hidden" id="traj-form">
        <input id="search-range"/>
        <select id="search-city" class="form-control input-sm"></select>
        <input id="search-id" class="form-control input-sm" placeholder="Trajectory ID"/>
    </div>
    <div id="console"></div>
</div>
<div id="map-canvas"></div>
</body>
</html>