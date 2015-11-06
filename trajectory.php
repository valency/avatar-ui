<html>
<head>
    <?php require "php/lib.php"; ?>
    <title>The Avatar System: Trajectory Management</title>
    <link rel="stylesheet" href="lib/ion.rangeslider-2.0.13/css/ion.rangeSlider.css"/>
    <link rel="stylesheet" href="lib/ion.rangeslider-2.0.13/css/ion.rangeSlider.skinFlat.css"/>
    <script src="js/trajectory.js" type="text/javascript"></script>
    <script type="text/javascript" src="lib/ion.rangeslider-2.0.13/js/ion-rangeSlider/ion.rangeSlider.min.js"></script>
</head>
<body>
<div class="page-container">
    <div class="page-content-wrapper">
        <div class="page-content">
            <legend class="text-success">Trajectory Management <span class="version">v0.<?php echo date("n.j", filemtime("./trajectory.php")); ?></span></legend>
            <p><select id="search-city" class="form-control input-sm"></select></p>

            <p>
                <button class="btn btn-primary btn-xs" type="button" onclick="generate_traj();">Generate Synthetic Trajectories</button>
                <button class="btn btn-danger btn-xs" type="button" onclick="clear_db();">Delete All Trajectories</button>
            </p>
            <hr/>
            <div id="traj-list-container">
                <span class="text-danger">Loading...</span>
            </div>
        </div>
    </div>
</div>
</body>
</html>