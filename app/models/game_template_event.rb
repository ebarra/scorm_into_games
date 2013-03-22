class GameTemplateEvent < ActiveRecord::Base
  #attr_accessible :created_at, :updated_at, :name, :description, :type

  belongs_to :game_template
  has_many :event_mappings, :dependent => :destroy

end
