class ScormFileController < ApplicationController
  
  def new
    respond_to do |format|
      format.html { render :layout => false }    # new.html.erb
    end
  end

  def create
    @scorm_file = ScormFile.new(params[:scorm_file])
    @scorm_file.save!
    respond_to do |format|
      format.all { redirect_to "/" }
    end
  end

end
