class Game < ActiveRecord::Base
  #attr_accessible :created_at, :updated_at, :name, :description, :avatar_url
  
  belongs_to :game_template
  has_many :event_mappings, :dependent => :destroy
  has_many :game_template_events, :through => :game_template
  

	def events
		events = [];
		self.event_mappings.each do |mapping|
			event = GameTemplateEvent.find_by_id(mapping.game_template_event_id);
			unless events.include?event
				events.push(event);
			end
		end
		return events;
	end


	def los
		los = [];
		self.event_mappings.each do |mapping|
			unless los.include?mapping.lo
				los.push(mapping.lo);
			end
		end
		return los;
	end


	def settings
		settings = Hash.new
		settings["name"]=self.name;
		settings["description"]=self.description;
		settings["avatar"]=self.avatar_url;
		settings["event_mapping"] = [];

		event_ids = [];
		self.event_mappings.each do |mapping|
			unless event_ids.include?mapping.game_template_event_id
				event_ids.push(mapping.game_template_event_id);
			end
		end

		event_ids.each do |event_id|
			los = [];
			self.event_mappings.find_all_by_game_template_event_id(event_id).each do |mapping|
				los.push(mapping.lo_id);
			end
			mapping = Hash.new;
			mapping["event_id"] = event_id;
			mapping["lo_id"] = los;
			settings["event_mapping"].push(mapping);
		end
		return settings
	end
	
end
