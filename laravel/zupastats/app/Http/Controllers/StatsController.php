<?php namespace App\Http\Controllers;

use App\Setting;
use Redis;
use Request;
use DB;

class StatsController extends Controller {

	public function __construct()
	{
		$this->middleware('guest');
	}

  public function getStats()
  {
    $showPuid = DB::table('settings')->where('code', 'show_puid')->pluck('value');
    $showAI = DB::table('settings')->where('code', 'show_ai_kills')->pluck('value');

    $client = Redis::connection();

    $deathlogslength  = $client-> llen('deathlog-LOG');
    $deathlogs2 = $client-> lrange('deathlog-LOG', 0, $deathlogslength);

    $dl = [];

    $puids = [];

    foreach($deathlogs2  as  $log){

      $result = [];

      $exploded = explode(" ",$log,3);

      $result['time'] = $exploded[0] . " " . $exploded[1];

      $exploded2 = explode(" (",$exploded[2],2);

      $result['killername'] = trim($exploded2[0]);

      $exploded3 = explode(") ",$exploded2[1],2);

      $result['killerpuid'] = trim($exploded3[0]);

      if($result['killerpuid'] == null || $result['killerpuid'] == "" ){
        $result['killername'] = "AI";
      }else{
        if($showPuid != 1){
           if(!array_key_exists ( $result['killerpuid'] , $puids )){
               $puids[$result['killerpuid']] =  count($puids) + 1;
           }
            $index = $result['killerpuid'];
            $result['killerpuid'] = $puids[$index];
        }
      }

      $exploded3[1] = str_replace("killed ","",$exploded3[1]);

      $exploded4 = explode(" (",$exploded3[1],2);

      $result['killedname'] = trim($exploded4[0]);

      $exploded5 = explode(") ",$exploded4[1],2);

      $result['killedpuid'] = trim($exploded5[0]);

      if($result['killedpuid'] == null || $result['killedpuid'] == "" ){
        $result['killedname'] = "AI";
      }else{
        if($showPuid != 1){
          if(!array_key_exists ( $result['killedpuid'] , $puids )){
              $puids[$result['killedpuid']] = count($puids) + 1;
          }
          $result['killedpuid'] = $puids[$result['killedpuid']];
        }
      }

      $exploded5[1] = str_replace("with weapon","",$exploded5[1]);

      $result['weapon'] = trim($exploded5[1]);

       if($showAI != 1){
            if( $result['killedname'] != "AI" &&  $result['killername'] != "AI"){
                array_push($dl,$result);
            }
       }else{
            array_push($dl,$result);
       }
    }
   return response()->json($dl);

  }

}
