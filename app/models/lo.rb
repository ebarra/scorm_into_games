class Lo < ActiveRecord::Base
  # attr_accessible :title, :body

  belongs_to :scorm_file
  has_many :event_mappings, :dependent => :destroy


end
