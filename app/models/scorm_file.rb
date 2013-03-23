require 'scorm/package'

class ScormFile < ActiveRecord::Base
  #attr_accessible :created_at, :updated_at, :name, :description, :avatar_url

  has_many :los, :dependent => :destroy
  has_attached_file :source,
  					:url  => ":rails_root/public/scorm/:id/:basename.:extension",
                  	:path => ":rails_root/public/scorm/:id/:basename.:extension"
					
  after_save :extract_scorm_file


  def extract_scorm_file
  	 Scorm::Package.open(source.path, :cleanup => false) do |pkg|
	   # Read stuff from the package...
	   name = pkg.manifest.default_organization.title
	   pkg.manifest.resources.each do |resource|
	   	 # lo = Lo.new
	   	 # lo.type = resource.type
	   	 # lo.scorm_type = resource.scorm_type
	   	 # lo.href = resource.href
	   	 # los << lo
	   	 puts resource.href
	     puts resource.scorm_type
	     if pkg.exists?(resource.files.first)
	       puts resource.files.first
	       puts pkg.file(resource.files.first)
	     end
	   end
	end
	save
  end
end
