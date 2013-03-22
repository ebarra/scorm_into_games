class GameTemplate < ActiveRecord::Base
  # attr_accessible :title, :body

  has_many :games, :dependent => :destroy
  has_many :game_template_events, :dependent => :destroy


end
