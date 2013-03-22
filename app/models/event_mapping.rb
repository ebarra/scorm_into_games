class EventMapping < ActiveRecord::Base
  belongs_to :game
  belongs_to :game_template_events
  belongs_to :lo
end
