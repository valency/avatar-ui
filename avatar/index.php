<html>
<head>
    <?php require "../php/lib.php"; ?>
    <title>The Avatar System</title>
    <link rel="stylesheet" href="css/avatar.css"/>
    <script type="text/javascript" src="http://api.map.baidu.com/api?v=1.5&ak=3juZrhGVW1FG9xSdspQHuSpU"></script>
    <script type="text/javascript" src="js/index.js"></script>
</head>
<body>
<div id="dashboard_container">
    <div>
        <span class="bold">The Avatar System</span>
        <span style="color:grey;font-size:9px;">v0.<?php echo date("n.j", filemtime("./index.php")); ?></span>

        <div class="btn-group pull-right" style="margin-top:-5px;">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                <i class="fa fa-cog"></i>
            </a>
            <ul class="dropdown-menu">
                <li><a href="upload.php" target="_blank">Data Management</a></li>
            </ul>
        </div>
    </div>
    <hr/>
    <div>
        <a href="javascript:void(0)" data-toggle="modal" data-target="#modal">Launch demo modal</a>
    </div>
</div>
<div id="map_canvas"></div>
</body>
</html>