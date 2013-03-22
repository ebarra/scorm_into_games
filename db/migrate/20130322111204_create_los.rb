class CreateLos < ActiveRecord::Migration
  def change
    create_table :los do |t|
      t.integer :scorm_file_id
      t.timestamps
    end
  end
end
