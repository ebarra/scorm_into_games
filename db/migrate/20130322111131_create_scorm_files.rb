class CreateScormFiles < ActiveRecord::Migration
  def change
    create_table :scorm_files do |t|
      t.string :name
      t.string :description
      t.string :avatar_url
      t.timestamps
    end
  end
end
