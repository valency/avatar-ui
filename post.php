<html>
<head>
    <title>API Test Tool</title>
    <?php header('Access-Control-Allow-Origin: *'); ?>
    <?php include_once("php/lib.php"); ?>
</head>
<body>
<div>
    <p><input id="url" type="text" value="URL" style="width:100%;"/><br/></p>

    <p><textarea id="data" style="width:100%;height:200px;">Data in JSON Format</textarea></p>

    <p>
        <button onclick="post();">Send</button>
    </p>
</div>
<hr/>
<pre id="results"></pre>
</body>
<script>
    $(document).ready(function () {

    });
    function post() {
        $.post($("#url").val(), eval($("#data").val()), function (data) {
            $("#results").html(syntax_highlight(JSON.stringify(data, null, 4)));
        }, "json");
    }
</script>
</html>