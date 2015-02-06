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


    $data = '["nothing"';

    $allplayers = $client-> keys('Player:*');
    $vehicles = $client-> keys('Vehicle:'.$instance.':*');
    $storage = $client-> keys('Storage:'.$instance.':*');
    $traders = $client-> keys('AI:'.$instance.':*');
    $buildings = $client-> keys('Building:'.$instance.':*');


    $players = $client-> get('PLAYERS:'.$instance.'');
    $onlinePlayersArray = explode( ',', $players );


    $data = $data .','. count($allplayers) .','. count($onlinePlayersArray) .','. count($vehicles) .','. count($storage) .','. count($traders) .','. count($buildings) . ']';

    echo $data;

}else{
    echo "[wrong pass]";
}
