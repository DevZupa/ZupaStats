<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\User;
use App\Setting;

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();

		$this->call('UserTableSeeder');
		$this->call('SettingsTableSeeder');

	}

}

class UserTableSeeder extends Seeder {

  public function run()
  {
    DB::table('users')->delete();

    User::create([
        'id' => NULL,
        'name' => 'Admin',
        'email' => 'admin@dummymail.be',
        'password' => 'zupastats',
   ]);
  }

}

class SettingsTableSeeder extends Seeder {

    public function run()
    {
        DB::table('settings')->delete();

        Setting::create([
            'code' => 'show_puid',
            'description' => 'True: Shows the player his ID. False: generates a random smaller ID.',
            'type' => 'bool',
            'value' => '1',
        ]);

        Setting::create([
            'code' => 'community_name',
            'description' => 'Displays the community name',
            'type' => 'string',
            'value' => 'Unknown',
        ]);

        Setting::create([
            'code' => 'kills_kdr_week',
            'description' => 'Minimum kills to be accepted in top WEEK of KDR',
            'type' => 'string',
            'value' => '5',
        ]);

        Setting::create([
            'code' => 'kills_kdr_all',
            'description' => 'Minimum kills to be accepted in top ALL of KDR',
            'type' => 'string',
            'value' => '10',
        ]);

        Setting::create([
            'code' => 'show_ai_kills',
            'description' => 'Include AI kills in the application?',
            'type' => 'bool',
            'value' => '1',
        ]);
    }

}


/*
$table->string('code');
      $table->string('description');
      $table->string('value');
      $table->string('type');
*/