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
  	Dir.mkdir "#{Rails.root}/public/scorm/4/"
  	FileUtils.cp(File.join(Rails.root, 'public/scorm_examples/AncientWeaponsQuiz.zip'), File.join(Rails.root, 'public/scorm/4/AncientWeaponsQuiz.zip'))
  	Dir.mkdir "#{Rails.root}/public/scorm/5/"
  	FileUtils.cp(File.join(Rails.root, 'public/scorm_examples/WeaponsPicturesQuiz.zip'), File.join(Rails.root, 'public/scorm/5/WeaponsPicturesQuiz.zip'))
  	Dir.mkdir "#{Rails.root}/public/scorm/6/"
  	FileUtils.cp(File.join(Rails.root, 'public/scorm_examples/MedievalArmorQuiz.zip'), File.join(Rails.root, 'public/scorm/6/MedievalArmorQuiz.zip'))
  	Dir.mkdir "#{Rails.root}/public/scorm/7/"
  	FileUtils.cp(File.join(Rails.root, 'public/scorm_examples/WeaponsTimelineQuiz.zip'), File.join(Rails.root, 'public/scorm/7/WeaponsTimelineQuiz.zip'))

  	#first scorm file with its learning object
	sf1 = ScormFile.create!  :name  => "Rabbittakeaway",
	                        :description   => "Minigame to learn maths with rabbits",
	                        :avatar_url => "/images/rabbittakeaway_300.jpg",
						    :source =>  File.open(File.join(Rails.root, 'public/scorm/1/rabbittakeaway.zip'))

	#second scorm file with its learning object
	sf2 = ScormFile.create!  :name  => "Golf",
	                        :description   => "SCORM package that explains everything about golf",
	                        :avatar_url => "/images/golf1.jpg",
						    :source =>  File.open(File.join(Rails.root, 'public/scorm/2/golf_n_sco.zip'))

	#third scorm file with its learning object
	sf3 = ScormFile.create!  :name  => "Hiddencraft",
	                        :description   => "Hiddencraft mini game to learn maths",
	                        :avatar_url => "/images/hidden-craft.jpg",
						    :source =>  File.open(File.join(Rails.root, 'public/scorm/3/hiddencraft.zip'))

	#Weapons 1 scorm file: Drag and drop texts
	sf4 = ScormFile.create!  :name  => "Ancient Weapons",
	                        :description   => "Quiz about ancient weapons",
	                        :avatar_url => "/images/AncientWarWeapons.jpg",
						    :source =>  File.open(File.join(Rails.root, 'public/scorm/4/AncientWeaponsQuiz.zip'))

	#Weapons 2 scorm file: Drag and drop images
	sf5 = ScormFile.create!  :name  => "Weapons Pictures",
	                        :description   => "Drag and Drop Quiz with weapons pictures",
	                        :avatar_url => "/images/chuKoNu.jpg",
						    :source =>  File.open(File.join(Rails.root, 'public/scorm/5/WeaponsPicturesQuiz.zip'))

	#Weapons 3 scorm file: Armor hotspot
	sf6 = ScormFile.create!  :name  => "Medieval Armor",
	                        :description   => "Hotspot Quiz with a medieval armor",
	                        :avatar_url => "/images/medievalArmor.jpg",
						    :source =>  File.open(File.join(Rails.root, 'public/scorm/6/MedievalArmorQuiz.zip'))

	#Weapons 4 scorm file: Sequence Quiz
	sf7 = ScormFile.create!  :name  => "Weapons Timeline",
	                        :description   => "Weapons Timeline Quiz",
	                        :avatar_url => "/images/weaponsTimeline.jpg",
						    :source =>  File.open(File.join(Rails.root, 'public/scorm/7/WeaponsTimelineQuiz.zip'))

	#now three game templates
	oArena = GameTemplate.create! 	:name=>"Onslaught Arena", 
								:description=>"Battle hordes of classic medieval monsters in this fast-paced arcade shooter", 
								:avatar_url=>"/images/game_OnslaughtArena.jpg"

	sokoban = GameTemplate.create! 	:name=>"Sokoban",
								:description=>"Sokoban is a type of transport puzzle, in which the player pushes diamonds around in a warehouse", 
								:avatar_url=>"/images/game_sokoban.png"

	nPark = GameTemplate.create! 	:name=>"Natural Park", 
								:description=>"Go meet and feed the lynxes in this park.", 
								:avatar_url=>"/images/game_dpark.png"

	#Now the events of the templates
	oArenaEvent1 = GameTemplateEvent.create! :name=>"Extra weapon", :description=>"Event triggered when the player achieved a new weapon", :event_type=>"extra_weapon", :game_template_id=>oArena.id, :id_in_game=>1
	sokobanEvent1 = GameTemplateEvent.create! :name=>"Extra live", :description=>"Event triggered when the devil catches the player", :event_type=>"extra_life", :game_template_id=>sokoban.id, :id_in_game=>1

	#Now the games

	#oArena
	oArenaInstance = Game.create! :name=>"Onslaught Arena", :description=>"Onslaught Arena instance example", :avatar_url=>"/images/gameInstance_OnslaughtArena.jpg", :game_template_id=>oArena.id

	#Event mapping for the oArena game
	(sf4.ids+sf5.ids+sf6.ids+sf7.ids).uniq.each do |lo_id|
		EventMapping.create :game_id => oArenaInstance.id, :game_template_event_id => -1, :lo_id => lo_id
	end
	EventMapping.create! :game_id => oArenaInstance.id, :game_template_event_id => oArenaEvent1.id, :lo_id => -2 #-2 is the convention for random


	#oArena without wildcard LO
	oArenaInstance2 = Game.create! :name=>"Medieval Monsters", :description=>"Onslaught Arena instance example built without using LO wildcards", :avatar_url=>"/images/gameInstance_OnslaughtArena.jpg", :game_template_id=>oArena.id

	#Event mapping for the oArena game
	(sf4.ids+sf5.ids+sf6.ids+sf7.ids).uniq.each do |lo_id|
		EventMapping.create! :game_id => oArenaInstance2.id, :game_template_event_id => oArenaEvent1.id, :lo_id => lo_id
	end


	#sokoban
	sokobanInstance = Game.create! :name=>"Sokoban Example", :description=>"Sokoban instance example", :avatar_url=>"/images/devilAvatar.gif", :game_template_id=>sokoban.id
	
	#Event mapping for the sokoban game
	Lo.all_ids.each do |lo_id|
		EventMapping.create :game_id => sokobanInstance.id, :game_template_event_id => -1, :lo_id => lo_id
	end
	EventMapping.create! :game_id => sokobanInstance.id, :game_template_event_id => sokobanEvent1.id, :lo_id => -2 #-2 is the convention for random


	#sokoban with SCOs
	sokobanInstance2 = Game.create! :name=>"Sokoban SCO", :description=>"Sokoban instance example with SCOs", :avatar_url=>"/images/scorm_logo.jpg", :game_template_id=>sokoban.id
	#Event mapping for the sokoban game
	EventMapping.create! :game_id => sokobanInstance2.id, :game_template_event_id => sokobanEvent1.id, :lo_id => sf1.los.first.id

	puts "Populate finish"
  end
end