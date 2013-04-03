class Lo < ActiveRecord::Base
	#attr_accessible :created_at, :updated_at

	belongs_to :scorm_file
	has_many :event_mappings, :dependent => :destroy

	def path
		"/scorm/"+scorm_file_id.to_s+"/"+scorm_file.source_file_name[0..scorm_file.source_file_name.length-5]+"/"+href
	end

	def delivered_metadata
		extra_data = Hash.new
		extra_data["url"] = self.path
		delivered_metadata = extra_data.merge(YAML.load(self.metadata))
		return delivered_metadata
	end

	def self.random
		if (c = count) != 0
			find(:first, :offset =>rand(c))
		end
	end

	def self.all_ids
		ids = []
		all = Lo.all
		all.each do |lo|
			ids.push(lo.id)
		end
		return ids
	end

end
