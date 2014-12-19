require 'rubygems'
require 'bundler/setup'
require 'sinatra'
require 'json'

get '/' do
  erb :index
end

get '/files' do
  files = ["Please choose a file"].concat Dir.entries(settings.root + '/public/data').select {|f| f =~ /\.json$/}
  [200, {'Content-Type' =>  'application/json'}, files.to_json]
end
