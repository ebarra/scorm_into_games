class AddAttachmentToScorm < ActiveRecord::Migration
  def self.up
  	add_column :scorm_files, :source_file_name, :string
	add_column :scorm_files, :source_content_type, :string
	add_column :scorm_files, :source_file_size, :integer
	add_column :scorm_files, :source_updated_at,   :datetime
  end

  def self.down
	remove_column :scorm_files, :source_file_name
	remove_column :scorm_files, :source_content_type
	remove_column :scorm_files, :source_file_size
	remove_column :scorm_files, :source_updated_at
	end

end
