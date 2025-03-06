<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateReportLogTable extends Migration
{
  public function up()
  {

    DB::statement('
            CREATE TABLE report_log (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                report_id BIGINT UNSIGNED NOT NULL,
                reported_user_id BIGINT UNSIGNED NOT NULL,
                comment_id BIGINT UNSIGNED NOT NULL,
                report_reason TEXT NOT NULL,
                user_id BIGINT UNSIGNED NOT NULL, 
                created_at TIMESTAMP NULL DEFAULT NULL,
                updated_at TIMESTAMP NULL DEFAULT NULL,
                FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (comment_id) REFERENCES comment(id) ON DELETE CASCADE
            )
        ');

    //trigger 
    DB::statement('
            CREATE TRIGGER report_created_after_insert
            AFTER INSERT ON reports
            FOR EACH ROW
            BEGIN
                INSERT INTO report_log (report_id, reported_user_id, comment_id, report_reason, user_id, created_at, updated_at)
                VALUES (NEW.id, NEW.reported_user_id, NEW.comment_id, NEW.reason, NEW.user_id, NOW(), NOW());
            END
        ');
  }

  public function down()
  {
    // Drop the trigger and table
    DB::statement('DROP TRIGGER IF EXISTS report_created_after_insert');
    DB::statement('DROP TABLE IF EXISTS report_log');
  }
}
