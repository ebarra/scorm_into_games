namespace :db do
  task :populate => :environment do
  	desc "Create populate data for SCORM into games"

  	#copy the scorm files
  	Dir.mkdir "#{Rails.root}/public/scorm/1/"
  	FileUtils.cp(File.join(Rails.root, 'public/scorm_examples/rabbittakeaway.zip'), File.join(Rails.root, 'public/scorm/1/rabbittakeaway.zip'))
	Dir.mkdir "#{Rails.root}/public/scorm/2/"
  	FileUtils.cp(File.join(Rails.root, 'public/scorm_examples/golf_n_sco.zip'), File.join(Rails.root, 'public/scorm/2/golf_n_sco.zip'))
	Dir.mkdir "#{Rails.root}/public/scorm/3/"
  	FileUtils.cp(File.join(Rails.root, 'public/scorm_examples/hiddencraft.zip'), File.join(Rails.root, 'public/scorm/3/hiddencraft.zip'))

  	#first scrom file with its learning object
	sf = ScormFile.create!  :name  => "Rabbittakeaway",
	                        :description   => "Minigame to learn maths with rabbits",
	                        :avatar_url => "http://www.rabbittakeaway.co.uk/rabbittakeaway_300.jpg",
						    :source =>  File.open(File.join(Rails.root, 'public/scorm/1/rabbittakeaway.zip'))

	#second scrom file with its learning object
	sf = ScormFile.create!  :name  => "Golf",
	                        :description   => "SCORM package that explains everything about golf",
	                        :avatar_url => "http://www.chester.com/images/golf/golf3.jpg",
						    :source =>  File.open(File.join(Rails.root, 'public/scorm/2/golf_n_sco.zip'))

	#third scrom file with its learning object
	sf = ScormFile.create!  :name  => "Hiddencraft",
	                        :description   => "Hiddencraft mini game to learn maths",
	                        :avatar_url => "/hidden-craft.jpg",
						    :source =>  File.open(File.join(Rails.root, 'public/scorm/3/hiddencraft.zip'))

    
	#now three game templates
	gt = GameTemplate.create! 	:name=>"Onslaught Arena", 
								:description=>"Battle hordes of classic medieval monsters in this fast-paced arcade shooter", 
								:avatar_url=>"/assets/game_OnslaughtArena.jpg"

	gt = GameTemplate.create! 	:name=>"Natural Park", 
								:description=>"Go meet and feed the lynxes in this park.", 
								:avatar_url=>"/assets/game_dpark.png"

	gt = GameTemplate.create! 	:name=>"Sokoban", 
								:description=>"Sokoban is a type of transport puzzle, in which the player pushes diamonds around in a warehouse", 
								:avatar_url=>"/assets/game_sokoban.png"

	gte = GameTemplateEvent.create :name=>"Extra life", :description=>"Event triggered when the player died", :event_type=>"extra_file", :game_template_id=>GameTemplate.first.id
	gte.save!

	g = Game.create :name=>"My instance of Mario game", :description=>"Game instance example", :avatar_url=>"http://t2.gstatic.com/images?q=tbn:ANd9GcSSBLq0UP6o9Z-WXXDch-lgX3kgX51ivUqp16exYZcD-NGdpSX3Rw", :game_template_id=>GameTemplate.first.id
	g.save!

	em = EventMapping.create :game_id => Game.first.id, :game_template_event_id => GameTemplateEvent.first.id, :lo_id => Lo.first.id
	em.save!

	puts "Populate finish"
  end
end