class EventMapping < ActiveRecord::Base
  # attr_accessible :title, :body

  belongs_to :game
  belongs_to :game_template_events
  belongs_to :lo

end
