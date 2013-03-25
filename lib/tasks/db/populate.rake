namespace :db do
  task :populate => :environment do
  	desc "Create populate data for SCORM into games"

  	#copy the scorm files
  	Dir.mkdir "#{Rails.root}/public/scorm/1/"
  	FileUtils.cp(File.join(Rails.root, 'public/scorm_examples/rabbittakeaway.zip'), File.join(Rails.root, 'public/scorm/1/rabbittakeaway.zip'))
	Dir.mkdir "#{Rails.root}/public/scorm/2/"
  	FileUtils.cp(File.join(Rails.root, 'public/scorm_examples/hiddencraft.zip'), File.join(Rails.root, 'public/scorm/2/hiddencraft.zip'))

  	#first scrom file with its learning object
	sf = ScormFile.create!  :name  => "Rabbittakeaway",
	                        :description   => "Minigame to learn maths with rabbits",
	                        :avatar_url => "http://www.rabbittakeaway.co.uk/rabbittakeaway_300.jpg",
						    :source =>  File.open(File.join(Rails.root, 'public/scorm/1/rabbittakeaway.zip'))

	#second scrom file with its learning object
	sf = ScormFile.create!  :name  => "Hiddencraft",
	                        :description   => "Hiddencraft mini game to learn maths",
	                        :avatar_url => "http://onlinemaths.global2.vic.edu.au/files/2009/06/hidden-craft.jpg",
						    :source =>  File.open(File.join(Rails.root, 'public/scorm/2/hiddencraft.zip'))

    

	gt = GameTemplate.create :name=>"Mario", :description=>"Game example", :avatar_url=>"http://t2.gstatic.com/images?q=tbn:ANd9GcSSBLq0UP6o9Z-WXXDch-lgX3kgX51ivUqp16exYZcD-NGdpSX3Rw"
	gt.save!

	gte = GameTemplateEvent.create :name=>"Extra life", :description=>"Event triggered when the player died", :event_type=>"extra_file", :game_template_id=>GameTemplate.first.id
	gte.save!

	g = Game.create :name=>"My instance of Mario game", :description=>"Game instance example", :avatar_url=>"http://t2.gstatic.com/images?q=tbn:ANd9GcSSBLq0UP6o9Z-WXXDch-lgX3kgX51ivUqp16exYZcD-NGdpSX3Rw", :game_template_id=>GameTemplate.first.id
	g.save!

	em = EventMapping.create :game_id => Game.first.id, :game_template_event_id => GameTemplateEvent.first.id, :lo_id => Lo.first.id
	em.save!

	puts "Populate finish"
  end
end