<?php namespace App\Http\Controllers;

use App\Setting;
use App\Permission;

class SettingsController extends Controller  {

	public function __construct()
	{
		$this->middleware('guest');
	}

  public function getSettings()
  {
    return response()->json(Setting::all());
  }
}
