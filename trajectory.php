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
            <legend style="color:green;">Trajectory Management <span style="color:grey;font-size:9px;">v0.<?php echo date("n.j", filemtime("./trajectory.php")); ?></span></legend>
            <p>
                <select id="search-city" class="form-control input-sm"></select>
<!--                <button class="btn btn-primary btn-xs" type="button" onclick="$('#file_upload').click();">Upload</button>-->
<!--                <input id="file_upload" class="hidden" type="file" name="files[]" data-url="./data/" multiple/>-->
<!--                <button class="btn btn-danger btn-xs" type="button" onclick="clear_db();">Clear Database</button>-->
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