<html>
<head>
    <?php require "php/lib.php"; ?>
    <title>The Avatar System</title>
    <link rel="stylesheet" href="css/index.css"/>
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAIVyPOw3xUIfL1g1sCXq3DQqf8XnTjIZM"></script>
    <script type="text/javascript" src="js/index.js"></script>
</head>
<body>
<div id="dashboard-container">
    <div>
        <img class="logo" src="img/logo.png" style="height:5em;"/>

        <div class="btn-group pull-right">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-cog"></i></a>
            <ul class="dropdown-menu">
                <li><a href="map.php" target="_blank">Map Management</a></li>
                <li><a href="trajectory.php" target="_blank">Trajectory Management</a></li>
            </ul>
        </div>
    </div>
    <hr/>
    <div class="row" id="user-form">
        <div class="col-md-6 form-group">
            <input id="username" class="form-control input-sm" placeholder="User Name"/>
        </div>
        <div class="col-md-6 form-group">
            <input id="password" class="form-control input-sm" placeholder="Password" type="password" autocomplete="off"/>
        </div>
    </div>
    <hr/>
    <div class="hidden" id="traj-form">
        <select id="search-city" class="form-control input-sm"></select>
        <input id="search-id" class="form-control input-sm" placeholder="Trajectory ID"/>
    </div>
    <div id="console"></div>
</div>
<div id="map-canvas"></div>
</body>
</html>