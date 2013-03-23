# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130323114536) do

  create_table "event_mappings", :force => true do |t|
    t.integer  "game_template_event_id"
    t.integer  "game_id"
    t.integer  "lo_id"
    t.datetime "created_at",             :null => false
    t.datetime "updated_at",             :null => false
  end

  create_table "game_template_events", :force => true do |t|
    t.integer  "game_template_id"
    t.string   "name"
    t.string   "description"
    t.string   "event_type"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "game_templates", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.string   "avatar_url"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "games", :force => true do |t|
    t.integer  "game_template_id"
    t.string   "name"
    t.string   "description"
    t.string   "avatar_url"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "los", :force => true do |t|
    t.integer  "scorm_file_id"
    t.string   "lo_type"
    t.string   "scorm_type"
    t.string   "href"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "scorm_files", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.string   "avatar_url"
    t.datetime "created_at",          :null => false
    t.datetime "updated_at",          :null => false
    t.string   "source_file_name"
    t.string   "source_content_type"
    t.integer  "source_file_size"
    t.datetime "source_updated_at"
  end

end
