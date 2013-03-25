namespace :db do
  task :populate => :environment do
  	desc "Create populate data for SCORM into games"

	# sf = ScormFile.create!  :name  => "Scorm Title",
	#                         :description   => "This is an example",
	#                         :avatar_url => "http://t3.gstatic.com/images?q=tbn:ANd9GcSD6W-hwMD8-tkeHgEE9UEGVi5tmqyOXv_mUOqQzzVtQzL07Uq7"
	# sf.save!

	lo = Lo.create :scorm_file_id=>ScormFile.first.id
	lo.save!

	gt = GameTemplate.create :name=>"Mario", :description=>"Game example", :avatar_url=>"http://t2.gstatic.com/images?q=tbn:ANd9GcSSBLq0UP6o9Z-WXXDch-lgX3kgX51ivUqp16exYZcD-NGdpSX3Rw"
	gt.save!

	gte = GameTemplateEvent.create :name=>"Extra life", :description=>"Event triggered when the player died", :event_type=>"extra_file", :game_template_id=>GameTemplate.first.id
	gte.save!

	g = Game.create :name=>"My instance of Mario game", :description=>"Game instance example", :avatar_url=>"http://www.example.com", :game_template_id=>GameTemplate.first.id
	g.save!

	em = EventMapping.create :game_id => Game.first.id, :game_template_event_id => GameTemplateEvent.first.id, :lo_id => Lo.first.id
	em.save!

	puts "Populate finish"
  end
end