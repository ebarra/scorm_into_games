class ScormFileController < ApplicationController
  
  def new
    respond_to do |format|
      format.html { render :layout => false }    # new.html.erb
    end
  end

  def create
    @scorm_file = ScormFile.new(params[:scorm_file])
    full_name = params[:scorm_file][:source].original_filename
    @scorm_file.name = full_name[0..full_name.length-5]
    @scorm_file.save!
    respond_to do |format|
      format.all { redirect_to "/" }
    end
  end

  def index
    respond_to do |format|
      format.json { render :json => ScormFile.all.to_json(:methods => [:scos_ids, :assets_ids]) }
    end
  end

end
