<?php
if (isset($_GET["f"])) {
    $f = $_GET["f"];
    if (dirname($f) == "." && pathinfo($f, PATHINFO_EXTENSION) == "csv") {
        if (unlink($f)) echo "1"; else echo "-1";
    } else {
        echo "0";
    }
} else {
    echo "0";
}