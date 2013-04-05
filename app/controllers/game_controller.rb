class GameController < ApplicationController
  
  def index
    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => Game.all.to_json }
    end
  end

  def new
    respond_to do |format|
      format.html # new.html.erb
    end
  end

  def create
    gT = GameTemplate.find_by_id(params[:g_template_id]);

    name = params[:game][:name] ? params[:game][:name] : gT.name
    avatar_url = params[:game][:avatar_url] ? params[:game][:avatar_url] : gT.avatar_url    
    gameInstance = Game.create! :name=>name, :description=>gT.description, :avatar_url=>avatar_url, :game_template_id=>params[:g_template_id]

    #Get all LOs
    los = [];
    JSON.parse(params[:scorms_ids]).each do |scorm_id|
      sf = ScormFile.find_by_id(scorm_id)
      sf.los.each do |lo|
        los.push(lo)
      end
    end

    #Event mapping for the game instace

    #Add all los to -1 event_id (to generate the LO_list)
    los.each do |lo|
      EventMapping.create! :game_id => gameInstance.id, :game_template_event_id => -1, :lo_id => lo.id
    end

    #Map all of the events to random LOs
    gT.game_template_events.each do |event|
      EventMapping.create! :game_id => gameInstance.id, :game_template_event_id => event.id, :lo_id => -2
    end
   
    # redirect_to "/game"
    redirect_to "/game/"+gameInstance.id.to_s
  end


  def show
    @game = Game.find_by_id(params[:id])
    @settings = @game.settings
    @template_url = @game.game_template.get_url
    respond_to do |format|
      format.html # show.html.erb
      format.full { render :layout => false }
      format.json { render :json => @settings }
    end
  end

end
