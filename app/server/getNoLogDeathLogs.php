<?php
header('Access-Control-Allow-Origin: *');
/**
 * Created by PhpStorm.
 * User: jwindmolders
 * Date: 9/12/2014
 * Time: 11:06
 */

require 'Predis/Autoloader.php';

require 'config.php';

Predis\Autoloader::register();

$client = new Predis\Client([
    'host'   => "127.0.0.1",
    'password' => "npgforever1991",
	'port' => 6379,
	'database' => 1
]);

$deathlogs  = $client-> llen('deathlog-LOG');
$deathlogs2 = $client-> lrange('deathlog-LOG', 0, $deathlogs);

$dl = [];

foreach($deathlogs2  as  $log){

    $result = [];

    $exploded = explode(" ",$log,3);

    $result['time'] = $exploded[0] . " " . $exploded[1];

    $exploded2 = explode("(",$exploded[2],2);

    $result['killername'] = trim($exploded2[0]);

    $exploded3 = explode(")",$exploded2[1],2);

    $result['killerpuid'] = trim($exploded3[0]);

    $exploded3[1] = str_replace(" killed ","",$exploded3[1]);

    $exploded4 = explode("(",$exploded3[1],2);

    $result['killedname'] = trim($exploded4[0]);

    $exploded5 = explode(")",$exploded4[1],2);

    $result['killedpuid'] = trim($exploded5[0]);

    $exploded5[1] = str_replace(" with weapon","",$exploded5[1]);

    $result['weapon'] = trim($exploded5[1]);

    array_push($dl,$result);
}


echo json_encode($dl);
