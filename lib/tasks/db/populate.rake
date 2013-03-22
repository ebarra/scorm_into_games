

sf = ScormFile.create! :created_at => Time.now,
                        :updated_at => Time.at(rand(Time.now.to_i)),
                        :name  => "Scorm Title",
                        :description   => "This is an example",
                        :avatar_url => "http://www.example.com"
sf.save!

lo = Lo.create :scorm_file_id=>ScormFile.first.id
lo.save!

gt = GameTemplate.create :name=>"Mario", :description=>"Game example", :avatar_url=>"http://www.example.com"
gt.save!

gte = GameTemplateEvents.create :name=>"Extra life", :description=>"Event triggered when the player died", :event_type=>"extra_file", :game_template_id=>GameTemplate.first.id
gte.save!

g = Game.create :name=>"My instance of Mario game", :description=>"Game instance example", :avatar_url=>"http://www.example.com", :game_template_id=>GameTemplate.first.id
g.save!

em = EventMapping.create :game_id => Game.first.id, :game_template_event_id => GameTemplateEvents.first.id, :lo_id => Lo.first.id
em.save!



