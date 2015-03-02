<?php


Route::get('stats', 'StatsController@getStats');

Route::get('settings', 'SettingsController@getSettings');

Route::get('servers', 'SettingsController@getServers');

Route::get('servers/save', 'SettingsController@saveServers');

Route::get('settings/save', 'SettingsController@saveSettings');

Route::get('password/save', 'SettingsController@savePassword');


