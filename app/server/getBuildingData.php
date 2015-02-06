<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST");
header('Access-Control-Allow-Credentials: true');
        
error_reporting(0);
ini_set('display_errors',0);

$postdata = file_get_contents("php://input");
$thepost = json_decode($postdata,true);



$password = $thepost["secret"];
$instance = $thepost["instance"];
$db = $thepost["db"];

require 'Predis/Autoloader.php';

require 'config.php';


if ( md5($myRedisPass) == $password ) {

Predis\Autoloader::register();

$client = new Predis\Client([
    'scheme' => 'tcp',
    'host'   => $myRedisHost,
    'password' => $myRedisPass,
	'port' => $myRedisPort,
	'database' => $db
]);

$buildingData = '[';

$firstLoop = true;

$buildings = $client-> keys('Building:'.$instance.':*');


foreach($buildings as $op) {

    $buildingD = $client-> get($op);

    if($buildingData == '['){
        $buildingData = $buildingData . '["'.$op.'",'.$buildingD .']';
    }else{
        $buildingData = $buildingData . ',["'.$op.'",'.$buildingD .']';
    }

}

$buildingData = $buildingData . ']';


echo $buildingData;

}else{
echo "['wrong pass']";
}

