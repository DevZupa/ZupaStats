<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateServers extends Migration {

  public function up()
  {
    Schema::create('servers', function(Blueprint $table)
    {
      $table->increments('id');
      $table->string('name');
      $table->string('map');
      $table->string('ip');
      $table->string('port');
      $table->string('redisip');
      $table->string('redisport');
      $table->string('redispassword');
      $table->string('redisdatabase');
      $table->string('redisinstance');
    });
  }

  public function down()
  {
    Schema::drop('servers');
  }

}
