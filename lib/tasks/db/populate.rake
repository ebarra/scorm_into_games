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
	sf1 = ScormFile.create!  :name  => "Rabbittakeaway",
	                        :description   => "Minigame to learn maths with rabbits",
	                        :avatar_url => "http://www.rabbittakeaway.co.uk/rabbittakeaway_300.jpg",
						    :source =>  File.open(File.join(Rails.root, 'public/scorm/1/rabbittakeaway.zip'))

	#second scrom file with its learning object
	sf2 = ScormFile.create!  :name  => "Golf",
	                        :description   => "SCORM package that explains everything about golf",
	                        :avatar_url => "http://www.chester.com/images/golf/golf3.jpg",
						    :source =>  File.open(File.join(Rails.root, 'public/scorm/2/golf_n_sco.zip'))

	#third scrom file with its learning object
	sf3 = ScormFile.create!  :name  => "Hiddencraft",
	                        :description   => "Hiddencraft mini game to learn maths",
	                        :avatar_url => "/hidden-craft.jpg",
						    :source =>  File.open(File.join(Rails.root, 'public/scorm/3/hiddencraft.zip'))

    
	#now three game templates
	oArena = GameTemplate.create! 	:name=>"Onslaught Arena", 
								:description=>"Battle hordes of classic medieval monsters in this fast-paced arcade shooter", 
								:avatar_url=>"/assets/game_OnslaughtArena.jpg"

	nPark = GameTemplate.create! 	:name=>"Natural Park", 
								:description=>"Go meet and feed the lynxes in this park.", 
								:avatar_url=>"/assets/game_dpark.png"

	sokoban = GameTemplate.create! 	:name=>"Sokoban", 
								:description=>"Sokoban is a type of transport puzzle, in which the player pushes diamonds around in a warehouse", 
								:avatar_url=>"/assets/game_sokoban.png"

	#Now the events of the templates
	oArenaEvent1 = GameTemplateEvent.create! :name=>"Extra weapon", :description=>"Event triggered when the player achieved a new weapon", :event_type=>"extra_weapon", :game_template_id=>oArena.id
	sokobanEvent1 = GameTemplateEvent.create! :name=>"Extra live", :description=>"Event triggered when the devil catches the player", :event_type=>"extra_life", :game_template_id=>sokoban.id

	#Now the games

	#oArena
	oArenaInstance = Game.create! :name=>"My instance of Onslaught Arena", :description=>"Game instance example", :avatar_url=>"/assets/gameInstance_OnslaughtArena.jpg", :game_template_id=>oArena.id

	#Event mapping for the oArena game
	Lo.all_ids.each do |lo_id|
		EventMapping.create :game_id => oArenaInstance.id, :game_template_event_id => -1, :lo_id => lo_id
	end
	oArenaInstanceEm1 = EventMapping.create! :game_id => oArenaInstance.id, :game_template_event_id => oArenaEvent1.id, :lo_id => -2 #-2 is the convention for random

	puts "Populate finish"
  end
end