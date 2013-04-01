class LoController < ApplicationController
   
  def show
    @lo = Lo.find_by_id(params[:id])
    respond_to do |format|
      format.html { render :layout => false }
      format.metadata { render :json => YAML.load(@lo.metadata) }
    end
  end

end
