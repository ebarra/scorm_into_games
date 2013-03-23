class ScormFile < ActiveRecord::Base
  #attr_accessible :created_at, :updated_at, :name, :description, :avatar_url

  has_many :los, :dependent => :destroy
  has_attached_file :source  #zip file uploaded, this is for paperclip

end
