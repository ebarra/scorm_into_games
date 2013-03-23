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

end
