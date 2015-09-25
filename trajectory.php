<html>
<head>
    <?php require "php/lib.php"; ?>
    <title>The Avatar System: Trajectory Management</title>
    <script src="js/trajectory.js" type="text/javascript"></script>
</head>
<body>
<div class="page-container">
    <div class="page-content-wrapper">
        <div class="page-content">
            <legend style="color:green;">Trajectory Management <span style="color:grey;font-size:9px;">v0.<?php echo date("n.j", filemtime("./trajectory.php")); ?></span></legend>
            <div id="traj-list-container">
                <span class="text-danger">Loading...</span>
            </div>
        </div>
    </div>
</div>
</body>
</html>