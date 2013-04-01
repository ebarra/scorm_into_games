class LoController < ApplicationController
   
  def show
    @lo = Lo.find_by_id(params[:id])
    respond_to do |format|
      format.html { render :layout => false }
    end
  end

end
