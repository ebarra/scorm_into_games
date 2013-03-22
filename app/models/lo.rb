class Lo < ActiveRecord::Base
  #attr_accessible :created_at, :updated_at

  belongs_to :scorm_file
  has_many :event_mappings, :dependent => :destroy


end
