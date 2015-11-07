<html>
<head>
    <?php require "php/lib.php"; ?>
    <title>The Avatar System: Map Management</title>
    <script src="lib/jquery-file-upload-9.10.4/js/vendor/jquery.ui.widget.js"></script>
    <script src="lib/jquery-file-upload-9.10.4/js/jquery.iframe-transport.js"></script>
    <script src="lib/jquery-file-upload-9.10.4/js/jquery.fileupload.js"></script>
    <script src="js/map.js" type="text/javascript"></script>
</head>
<body>
<legend class="text-success">
    <img class="logo" src="img/logo.png"/>
    <span>Map Management</span>
    <span class="version">v0.<?php echo date("n.j", filemtime("./map.php")); ?></span>
</legend>
<div class="tabbable">
    <ul class="nav nav-pills nav-stacked col-md-2">
        <li class="active"><a href="#map-management" data-toggle="tab">Map Management</a></li>
        <li><a href="#data-management" data-toggle="tab">Data Management</a></li>
    </ul>
    <div class="tab-content col-md-10">
        <div class="tab-pane active" id="map-management">
            <div id="map-list-container">
                <span class="text-danger">Loading...</span>
            </div>
        </div>
        <div class="tab-pane" id="data-management">
            <div>
                <button class="btn btn-primary btn-xs" type="button" onclick="$('#file_upload').click();"><i class="fa fa-upload"></i> Upload New Map Data</button>
                <input id="file_upload" class="hidden" type="file" name="files[]" data-url="./data/map/" multiple/>
                <span class="bold" style="margin-left:10px;">CSV Format, Required Headers:</span> <code>roadid</code>, <code>partid</code>, <code>pointid</code>, <code>lng</code>, <code>lat</code>
            </div>
            <div class="progress" style="display:none;margin-top:20px;">
                <div class="progress-bar" style="width:0;"></div>
            </div>
            <hr/>
            <table id="maps-table" class="display" cellspacing="0" width="100%">
                <thead>
                <tr>
                    <th>File Name</th>
                    <th>Upload Time</th>
                    <th>Size</th>
                    <th>Management</th>
                </tr>
                </thead>
                <tbody>
                <?php if ($handle = opendir('./data/map/')) {
                    while (false !== ($entry = readdir($handle))) {
                        if ($entry != "." && $entry != ".." && pathinfo($entry, PATHINFO_EXTENSION) == "csv") {
                            echo "<tr>";
                            echo "<td><a href='data/" . $entry . "' target='_blank'><i class='fa fa-file-o'></i> " . $entry . "</a></td>";
                            echo "<td>" . date("Y-m-d H:i:s", filemtime('./data/map/' . $entry)) . "</td>";
                            echo "<td>" . number_format(filesize('./data/map/' . $entry)) . "</td>";
                            echo "<td>";
                            echo "<a href='javascript:void(0)' onclick=\"map_file_import('" . $entry . "')\">Import</a> | ";
                            echo "<a href='javascript:void(0)' onclick=\"map_file_delete('" . $entry . "')\" class='text-danger'>Delete</a>";
                            echo "</td>";
                            echo "</tr>";
                        }
                    }
                    closedir($handle);
                } ?>
                </tbody>
            </table>
        </div>
    </div>
</div>
</body>
</html>