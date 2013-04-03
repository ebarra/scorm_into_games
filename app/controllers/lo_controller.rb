class LoController < ApplicationController
   
  def show
    @lo = Lo.find_by_id(params[:id])
    respond_to do |format|
      format.html { render :layout => false }
    end
  end

  def metadata
  	@lo = Lo.find_by_id(params[:id])
  	extra_data = Hash.new
  	extra_data["url"] = @lo.path;
  	respond_to do |format|
      format.json { render :json => extra_data.merge(YAML.load(@lo.metadata)) }
    end
  end

  def random_metadata
    @lo = Lo.random
    respond_to do |format|
      format.json { render :json => @lo.delivered_metadata }
    end
  end

end
