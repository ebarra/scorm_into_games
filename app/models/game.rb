class Game < ActiveRecord::Base
  # attr_accessible :title, :body

  belongs_to :game_template
  has_many :event_mappings, :dependent => :destroy
  has_many :game_template_events, :through => :game_template


end
