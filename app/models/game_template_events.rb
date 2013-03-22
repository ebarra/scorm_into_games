class GameTemplateEvents < ActiveRecord::Base
  # attr_accessible :title, :body
  belongs_to :game_template
  has_many :event_mappings, :dependent => :destroy




end
