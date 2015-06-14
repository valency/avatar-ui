<html>
<head>
    <title>Project Joker</title>
    <?php require "../../php/lib.php"; ?>
</head>
<body>
<h1>CSV Data Uploader</h1>

<h3>Last Update: <?php echo date("F d Y, H:i:s", filemtime("./upload.php")); ?></h3>
<?php
if (isset($_POST["submit"]) && is_uploaded_file($_FILES['file_upload']['tmp_name'])) {
    $target_dir = "./data/";
    echo "<p>File will be uploaded to: " . $target_dir . "</p>";
    $target_file = $target_dir . basename($_FILES["file_upload"]["name"]);
    echo "<p>Target file is: " . $target_file . "</p>";
    $extension = pathinfo($target_file, PATHINFO_EXTENSION);
    echo "<p>File extension is: " . $extension . "</p>";
    $upload_ok = true;
    // Check if file already exists
    if (file_exists($target_file)) {
        echo "<p>Sorry, file already exists.</p>";
        $upload_ok = false;
    }
    // Check file size
    if ($_FILES["file_upload"]["size"] > 100000000) {
        echo "<p>Sorry, your file is too large.</p>";
        $upload_ok = false;
    }
    // Allow certain file formats
    if ($extension != "csv" && $extension != "txt") {
        echo "<p>Sorry, only CSV & TXT files are allowed.</p>";
        $upload_ok = false;
    }
    // Check if $upload_ok is set to 0 by an error
    if ($upload_ok == false) {
        echo "<p>Sorry, your file was not uploaded.</p>";
        // if everything is ok, try to upload file
    } else {
        if (move_uploaded_file($_FILES["file_upload"]["tmp_name"], $target_file)) {
            echo "<p>The file '" . basename($_FILES["file_upload"]["name"]) . "' has been uploaded.</p>";
        } else {
            echo "<p>Sorry, there was an error uploading your file.</p>";
        }
    }
} else { ?>
    <form action="upload.php" method="post" enctype="multipart/form-data">
        <input type="file" name="file_upload" id="file_upload">
        <input type="submit" name="submit" value="Upload">
    </form>
<?php } ?>
</body>
</html>
