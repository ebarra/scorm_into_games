class Lo < ActiveRecord::Base
  #attr_accessible :created_at, :updated_at

  belongs_to :scorm_file
  has_many :event_mappings, :dependent => :destroy

  def path
  	"/scorm/"+scorm_file_id.to_s+"/"+scorm_file.source_file_name[0..scorm_file.source_file_name.length-5]+"/"+href
  end

end
