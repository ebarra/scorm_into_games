class GameTemplateController < ApplicationController

  def new
    respond_to do |format|
      format.html # new.html.erb
    end
  end


  def index
    respond_to do |format|
      format.json { render :json => GameTemplate.all.to_json }
    end
  end

end
