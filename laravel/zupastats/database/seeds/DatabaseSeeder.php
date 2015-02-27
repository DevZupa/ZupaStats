<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

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
	}

}

class UserTableSeeder extends Seeder {

  public function run()
  {
    DB::table('users')->delete();

    User::create([
        'name' => 'Admin',
        'email' => 'admin@dummymail.be',
        'password' => 'zupastats'
      ]);
  }

}

class UserTableSeeder extends Seeder {

  public function run()
  {
    DB::table('users')->delete();

    User::create([
      'name' => 'Admin',
      'email' => 'admin@dummymail.be',
      'password' => 'zupastats'
    ]);
  }

}
