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

  def index
    respond_to do |format|
      format.json { render :json => ScormFile.all.to_json }
    end
  end

end
