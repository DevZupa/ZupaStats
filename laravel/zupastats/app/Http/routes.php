<?php

Route::get('stats', 'StatsController@getStats');

Route::get('settings', 'SettingsController@getSettings');

Route::get('settings/save', 'SettingsController@saveSettings');


