<?php
header('Access-Control-Allow-Origin: *');
/**
 * Created by PhpStorm.
 * User: jwindmolders
 * Date: 9/12/2014
 * Time: 11:06
 */
error_reporting(0);
ini_set('display_errors',0);

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$password = $request -> secret;
$instance = $request -> instance;
$db = $request -> db;

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


$vehicleData = '[';

$firstLoop = true;

$vehicles = $client-> keys('Vehicle:'.$instance.':*');

foreach($vehicles as $op) {

    $vehicleD = $client-> get($op);

    if($vehicleD != '[]'){

        if($vehicleData == '['){
            $vehicleData = $vehicleData . '["'.$op.'",'.$vehicleD .']';
        }else{
            $vehicleData = $vehicleData . ',["'.$op.'",'.$vehicleD .']';
        }
    }


}



$vehicleData = $vehicleData . ']';


echo $vehicleData;

}else{
echo "[wrong pass]";
}
