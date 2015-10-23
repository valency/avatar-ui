<html>
<head>
    <?php require "php/lib.php"; ?>
    <title>The Avatar System: Data Management</title>
    <script src="lib/jquery-file-upload-9.10.4/js/vendor/jquery.ui.widget.js"></script>
    <script src="lib/jquery-file-upload-9.10.4/js/jquery.iframe-transport.js"></script>
    <script src="lib/jquery-file-upload-9.10.4/js/jquery.fileupload.js"></script>
    <script src="js/upload.js" type="text/javascript"></script>
</head>
<body>
<div class="page-container">
    <div class="page-content-wrapper">
        <div class="page-content">
            <legend style="color:green;">Data Management <span style="color:grey;font-size:9px;">v0.<?php echo date("n.j", filemtime("./upload.php")); ?></span></legend>
            <p>
                <span class="bold">Trajectory Data Required Headers:</span> id, taxi, lat, lng, t (yyyy-mm-dd hh:mm:ss), speed, angle, occupy<br/>
                <span class="bold">Map Data Required Headers:</span> roadid, partid, pointid, lng, lat
            </p>

            <div class="progress" style="display:none;">
                <div class="progress-bar" style="width:0;"></div>
            </div>
            <div>
                <button class="btn btn-primary btn-xs" type="button" onclick="$('#file_upload').click();">Upload</button>
                <input id="file_upload" class="hidden" type="file" name="files[]" data-url="./data/" multiple/>
            </div>
            <hr/>
            <?php if ($handle = opendir('./data/')) {
                while (false !== ($entry = readdir($handle))) {
                    if ($entry != "." && $entry != ".." && pathinfo($entry, PATHINFO_EXTENSION) == "csv") {
                        echo "<p>";
                        echo "<span><a href='data/" . $entry . "' target='_blank'><i class='fa fa-file-o'></i> " . $entry . "</a></span><br/>";
                        echo "<span>" . date("Y-m-d H:i:s", filemtime('./data/' . $entry)) . "</span><br/>";
                        echo "<span>" . number_format(filesize('./data/' . $entry)) . " bytes</span><br/>";
                        echo "<a href='javascript:void(0)' onclick=\"map_import('" . $entry . "')\">Import as Map</a> | ";
                        echo "<a href='javascript:void(0)' onclick=\"datafile_import('" . $entry . "')\">Import as Trajectories</a> | ";
                        echo "<a href='javascript:void(0)' onclick=\"datafile_delete('" . $entry . "')\" class='text-danger'>Delete</a>";
                        echo "</p>";
                    }
                }
                closedir($handle);
            } ?>
        </div>
    </div>
</div>
</body>
</html>