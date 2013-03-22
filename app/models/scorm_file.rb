class ScormFile < ActiveRecord::Base
  #attr_accessible :created_at, :updated_at, :name, :description, :avatar_url

  has_many :los, :dependent => :destroy


end
