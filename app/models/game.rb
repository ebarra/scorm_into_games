class Game < ActiveRecord::Base
  #attr_accessible :created_at, :updated_at, :name, :description, :avatar_url
  
  belongs_to :game_template
  has_many :event_mappings, :dependent => :destroy
  has_many :game_template_events, :through => :game_template
  
end
