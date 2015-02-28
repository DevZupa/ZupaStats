<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSettings extends Migration {

  public function up()
  {
    Schema::create('settings', function(Blueprint $table)
    {
      $table->increments('id');
      $table->string('code');
      $table->string('description');
      $table->string('value');
      $table->string('type');
        $table->timestamps();
    });
  }

  public function down()
  {
    Schema::drop('settings');
  }

}
