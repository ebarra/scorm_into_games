class GameController < ApplicationController
  
  def index
    respond_to do |format|
      format.html # index.html.erb
    end
  end

  def new
    respond_to do |format|
      format.html # new.html.erb
    end
  end

  def show
    @game = Game.find_by_id(params[:id])
    @settings = @game.settings
    @template_url = @game.game_template.get_url
    respond_to do |format|
      format.html { render :layout => false } # show.html.erb
      format.json { render :json => @settings }
    end
  end

end
