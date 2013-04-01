class GameTemplate < ActiveRecord::Base
  #attr_accessible :created_at, :updated_at, :name, :description, :avatar_url

  has_many :games, :dependent => :destroy
  has_many :game_template_events, :dependent => :destroy

  def get_url
  	return "/games/templates/" + self.id.to_s() + "/"
  end

end
