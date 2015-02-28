<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePermissions extends Migration {

  public function up()
  {
    Schema::create('permissions', function(Blueprint $table)
    {
      $table->increments('id');
      $table->string('code');
      $table->string('description');
      $table->string('value');
        $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::drop('permissions');
  }

}
