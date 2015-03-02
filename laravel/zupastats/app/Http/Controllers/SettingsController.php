<?php namespace App\Http\Controllers;

use App\Setting;
use Input;
use DB;

class SettingsController extends Controller  {

	public function __construct()
	{
		$this->middleware('guest');
	}

  public function getSettings()
  {
    $data = Setting::all();
    return response()->json($data);
  }

    public function getServers()
    {
        $data = Server::all();
        return response()->json($data);
    }

    public function getPublicServers()
    {
        $password = Input::get('password', '...............');
        $adminpass =  DB::table('users')->where('name', 'Admin')->pluck('password');
        $data = ['Wrong password'];
        if($password == $adminpass){
            $data = PServer::all();
        }

        return response()->json($data);
    }

  public function savePassword()
  {
    $password = Input::get('password', '...............');
    $newpassword = Input::get('newpassword', '...............');
    $adminpass =  DB::table('users')->where('name', 'Admin')->pluck('password');
      $data = ['Wrong password'];
      if($password == $adminpass){
          User::where('name', '=','Admin')->update(array('password' => $newpassword));
          $response = [ "message" => "Success"];
      }
    return response()->json($data);
  }

  public function saveSettings(){
      $password = Input::get('password', '...............');
      $adminpass =  DB::table('users')->where('name', 'Admin')->pluck('password');
      $response = [ "message" => "Wrong password"];
      if($password == $adminpass){
          $data = json_decode(Input::get('data', '[]'));
          foreach($data as $item){
              Setting::where('code', '=', $item.code)->update(array('value' => $item.value));
          }
          $response = [ "message" => "Success"];
      }
      return response()->json($response);
  }
}
