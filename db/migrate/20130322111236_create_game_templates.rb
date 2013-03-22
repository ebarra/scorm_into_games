class CreateGameTemplates < ActiveRecord::Migration
  def change
    create_table :game_templates do |t|
      t.string :name
      t.string :description
      t.string :avatar_url
      t.timestamps
    end
  end
end
