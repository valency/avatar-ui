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
        <span style="font-weight:bold;">The Avatar System</span>
        <span style="color:grey;">v0.<?php echo date("n.j", filemtime("./index.php")); ?></span>
    </div>
    <hr/>
    <div>
        <a href="javascript:void(0)" data-toggle="modal" data-target="#modal">Launch demo modal</a>
    </div>
</div>
<div id="map_canvas"></div>
<div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Modal title</h4>
            </div>
            <div class="modal-body">
                ...
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
            </div>
        </div>
    </div>
</div>
</body>
</html>