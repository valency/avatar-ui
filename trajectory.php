<html>
<head>
    <?php require "php/lib.php"; ?>
    <title>The Avatar System: Trajectory Management</title>
    <link rel="stylesheet" href="lib/ion.rangeslider-2.0.13/css/ion.rangeSlider.css"/>
    <link rel="stylesheet" href="lib/ion.rangeslider-2.0.13/css/ion.rangeSlider.skinFlat.css"/>
    <script type="text/javascript" src="lib/ion.rangeslider-2.0.13/js/ion-rangeSlider/ion.rangeSlider.min.js"></script>
    <script src="lib/jquery-file-upload-9.10.4/js/vendor/jquery.ui.widget.js"></script>
    <script src="lib/jquery-file-upload-9.10.4/js/jquery.iframe-transport.js"></script>
    <script src="lib/jquery-file-upload-9.10.4/js/jquery.fileupload.js"></script>
    <script src="js/trajectory.js" type="text/javascript"></script>
</head>
<body>
<legend class="text-success">
    <img class="logo" src="img/logo.png"/>
    <span>Trajectory Management</span>
    <span class="version">v0.<?php echo date("n.j", filemtime("./trajectory.php")); ?></span>
</legend>
<div class="tabbable">
    <ul class="nav nav-pills nav-stacked col-md-2">
        <li class="active"><a href="#traj-management" data-toggle="tab">Map Management</a></li>
        <li><a href="#data-management" data-toggle="tab">Data Management</a></li>
    </ul>
    <div class="tab-content col-md-10">
        <div class="tab-pane active" id="traj-management">
            <div class="form-inline">
                <select id="search-city" class="form-control input-sm pull-right"></select>
                <button class="btn btn-primary btn-xs" type="button" onclick="generate_traj();"><i class="fa fa-magic"></i> Generate Synthetic Trajectories</button>
                <button class="btn btn-danger btn-xs" type="button" onclick="clear_db();"><i class="fa fa-trash-o"></i> Delete All Trajectories</button>
            </div>
            <hr/>
            <table id="traj-list-container" class="display" cellspacing="0" width="100%">
                <thead>
                <tr>
                    <th>Trajectory ID</th>
                    <th>Map-Matching</th>
                    <th>Truncate</th>
                    <th>Management</th>
                </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <div class="tab-pane" id="data-management">
            <div>
                <button class="btn btn-primary btn-xs" type="button" onclick="$('#file_upload').click();"><i class="fa fa-upload"></i> Upload New Trajectory Data</button>
                <input id="file_upload" class="hidden" type="file" name="files[]" data-url="./data/trajectory/" multiple/>
                <span class="bold" style="margin-left:10px;">CSV Format, Required Headers:</span> <code>id</code>, <code>taxi</code>, <code>lat</code>, <code>lng</code>, <code title="yyyy-mm-dd hh:mm:ss">t</code>, <code>speed</code>, <code>angle</code>, <code>occupy</code>
            </div>
            <div class="progress" style="display:none;margin-top:20px;">
                <div class="progress-bar" style="width:0;"></div>
            </div>
            <hr/>
            <table id="traj-table" class="display" cellspacing="0" width="100%">
                <thead>
                <tr>
                    <th>File Name</th>
                    <th>Upload Time</th>
                    <th>Size</th>
                    <th>Management</th>
                </tr>
                </thead>
                <tbody>
                <?php if ($handle = opendir('./data/trajectory/')) {
                    while (false !== ($entry = readdir($handle))) {
                        if ($entry != "." && $entry != ".." && pathinfo($entry, PATHINFO_EXTENSION) == "csv") {
                            echo "<tr>";
                            echo "<td><a href='data/" . $entry . "' target='_blank'><i class='fa fa-file-o'></i> " . $entry . "</a></td>";
                            echo "<td>" . date("Y-m-d H:i:s", filemtime('./data/trajectory/' . $entry)) . "</td>";
                            echo "<td>" . number_format(filesize('./data/trajectory/' . $entry)) . "</td>";
                            echo "<td>";
                            echo "<a href='javascript:void(0)' onclick=\"traj_file_import('" . $entry . "')\">Import</a> | ";
                            echo "<a href='javascript:void(0)' onclick=\"traj_file_delete('" . $entry . "')\" class='text-danger'>Delete</a>";
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