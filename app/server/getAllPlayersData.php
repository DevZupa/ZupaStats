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

    $puidArray = '[';

    $firstLoop = true;

    $vehicles = $client-> keys('Player:*');

    foreach($vehicles as $op) {

        $vehicleD = $client-> get($op);


        if($vehicleData == '['){
            $vehicleData = $vehicleData . $vehicleD;
            $puidArray = $puidArray . '"'.$op.'"';
        }else{
            $vehicleData = $vehicleData . ',' .$vehicleD;
            $puidArray = $puidArray . ',"'.$op.'"';
        }
    }

    $puidArray =   $puidArray  . ']';

    $vehicleData = $vehicleData . ']';


    echo '['.$vehicleData . ',' . $puidArray . ']';

}else{
    echo "[wrong pass]";
}
