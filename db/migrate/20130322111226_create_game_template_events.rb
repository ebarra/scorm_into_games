class CreateGameTemplateEvents < ActiveRecord::Migration
  def change
    create_table :game_template_events do |t|
      t.integer :game_template_id
      t.string :name
      t.string :description
      t.string :event_type
      t.timestamps
    end
  end
end
