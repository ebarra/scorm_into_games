class ScormFile < ActiveRecord::Base
  # attr_accessible :title, :body

  has_many :los, :dependent => :destroy


end
