<?php

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL,            "http://localhost:2525/imposters" );
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1 );
curl_setopt($ch, CURLOPT_POST,           1 );
curl_setopt($ch, CURLOPT_POSTFIELDS,     '{
    "port": 4545,
    "protocol": "http",
    "stubs": [{
      "predicates": [
      {
        "and": [
          {
            "equals": {
              "path": "/rate/usd",
              "method": "GET"
            }
          }
        ]
      }],
      "responses": [
        {
          "is": { "body":{"usd": {"rate":30.12} }}
        }
      ]
    },{
      "predicates": [
      {
        "and": [
          {
            "equals": {
              "path": "/rate/eur",
              "method": "GET"
            }
          }
        ]
      }],
      "responses": [
        {
          "is": { "body":{"eur": {"rate":37.12} }}
        }
      ]
    },{
      "predicates": [
      {
        "and": [
          {
            "equals": {
              "path": "/rate/yena",
              "method": "GET"
            }
          }
        ]
      }],
      "responses": [
        {
          "is": { "body":{"yena": {"rate":37.12} }}
        }
      ]
    },{
      "responses": [
        {
          "is": { "statusCode":401}
        }
      ]}]
  }' ); 
curl_setopt($ch, CURLOPT_HTTPHEADER,     array('Content-Type: application/json')); 

$result=curl_exec ($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
print_r([$result, $http_code]);