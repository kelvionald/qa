<?php

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL,            "http://localhost:4545/rate/usd" );
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1 );

$result=curl_exec ($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
print_r([$result, $http_code]);