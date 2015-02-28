<?php namespace App\Http\Controllers;

use App\Setting;
use Input;

class SettingsController extends Controller  {

	public function __construct()
	{
		$this->middleware('guest');
	}

  public function getSettings()
  {
    $password = Input::get('password', '...............');

    return response()->json(Setting::all());
  }

  public function saveSettings(){

      $password = Input::get('password', '...............');

      $data = json_decode(Input::get('data', '[]'));

      $response = [ "message" => "Success"];

      return response()->json($response);
  }
}
