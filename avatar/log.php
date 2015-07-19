<html>
<head>
    <title>Project Joker</title>
    <?php require "../php/lib.php"; ?>
</head>
<body>
<h1>Project Avatar</h1>

<p>Last Update: <?php echo date("F d Y, H:i:s", filemtime("./index.php")); ?></p>
<hr/>
<ul>
    <li><a href="upload.php">CSV Data Uploader</a> (Last Update: <?php echo date("F d Y, H:i:s", filemtime("./upload.php")); ?>)</li>
</ul>
<hr/>
<h2>Updates</h2>
<hr/>
<h3>2015-07-19:</h3>
<ul>
    <li>Added import map from local file</li>
</ul>
</body>
</html>