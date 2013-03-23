#require 'scorm/package'

class ScormFile < ActiveRecord::Base
  #attr_accessible :created_at, :updated_at, :name, :description, :avatar_url

  has_many :los, :dependent => :destroy
  has_attached_file :source,
  					:url  => ":rails_root/public/scorm/:id/:basename.:extension",
                  	:path => ":rails_root/public/scorm/:id/:basename.:extension"
#zip file uploaded, this is for paperclip
  after_save :extract_scorm_file


  def extract_scorm_file



	# Scorm::Package.open('mypackage.zip') do |pkg|
	#   # Read stuff from the package...
	#   puts pkg.manifest.identifier
	#   puts pkg.manifest.default_organization.title
	#   puts pkg.manifest.metadata.general.title.value
	#   pkg.manifest.resources.each do |resource|
	#     puts resource.href
	#     puts resource.scorm_type
	#     if pkg.exists?(resource.files.first)
	#       puts resource.files.first
	#       puts pkg.file(resource.files.first)
	#     end
	#   end
  end
end
