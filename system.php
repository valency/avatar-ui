<html>
<head>
    <?php require "lib.php"; ?>
    <title>The Avatar System: System Management</title>
    <script src="js/system.js" type="text/javascript"></script>
</head>
<body>
<legend class="text-success">
    <img class="logo" src="img/logo.png"/>
    <span>System Management</span>
    <span class="version">v0.<?php echo date("n.j", filemtime("./map.php")); ?></span>
</legend>
<div class="row">
    <div class="col-md-12">
        <button class="btn btn-sm btn-primary" onclick="init_cache();"><i class="fa fa-fighter-jet"></i> Init Cache</button>
    </div>
</div>
</body>
</html>