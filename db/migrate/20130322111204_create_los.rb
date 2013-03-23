class CreateLos < ActiveRecord::Migration
  def change
    create_table :los do |t|
      t.integer :scorm_file_id
      t.string :type
      t.string :scorm_type
      t.string :href
      t.timestamps
    end
  end
end
