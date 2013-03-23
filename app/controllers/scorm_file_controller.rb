class ScormFileController < ApplicationController
  
  def new
    respond_to do |format|
      format.html { render :layout => false }    # new.html.erb
    end
  end

  #

end
