<?php namespace App\Http\Controllers;

use App\Setting;

class StatsController extends Controller {

	public function __construct()
	{
		$this->middleware('guest');
	}

  public function getStats()
  {
    $settings = Setting::all();


    $client = Redis::connection();

    $deathlogslength  = $client-> llen('deathlog-LOG');
    $deathlogs2 = $client-> lrange('deathlog-LOG', 0, $deathlogslength);

    $dl = [];

    foreach($deathlogs2  as  $log){

      $result = [];

      $exploded = explode(" ",$log,3);

      $result['time'] = $exploded[0] . " " . $exploded[1];

      $exploded2 = explode(" (",$exploded[2],2);

      $result['killername'] = trim($exploded2[0]);

      $exploded3 = explode(") ",$exploded2[1],2);

      $result['killerpuid'] = trim($exploded3[0]);

      if($result['killerpuid'] == null || $result['killerpuid'] == "" )
        $result['killerpuid'] = "AI";

      $exploded3[1] = str_replace("killed ","",$exploded3[1]);

      $exploded4 = explode(" (",$exploded3[1],2);

      $result['killedname'] = trim($exploded4[0]);

      $exploded5 = explode(") ",$exploded4[1],2);

      $result['killedpuid'] = trim($exploded5[0]);

      if($result['killedpuid'] == null || $result['killedpuid'] == "" )
        $result['killedname'] = "AI";

      $exploded5[1] = str_replace("with weapon","",$exploded5[1]);

      $result['weapon'] = trim($exploded5[1]);

      array_push($dl,$result);
    }
    return response()->json($dl);
  }

}
