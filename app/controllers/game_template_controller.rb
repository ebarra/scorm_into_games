class GameTemplateController < ApplicationController

  def new
    respond_to do |format|
      format.html # new.html.erb
    end
  end

end
