dc-memory-chart
===============

Chart various things about the ruby VM from DCs. If you don't know what this means, don't worry about it.

### HOWTO
 * clone this repo
 * scp a service_memory.log file from a DC host, save it locally.
 * pipe service_memory.log through the gen-data.sh script and save it as a file in data/
  * `cat service_memory.log | sh ./gen-data.sh > data/dc-memory.json`, data/*.json is .gitignored
 * fire up sinatra: ruby chart.rb
 * point a browser at http://localhost:4567/
 
### TODO
 
* automation of log collection and parsing
* make the mouseover prettier and more useful
* pan/zoom over longer timelines
* multi-data-set selection? Log axes? Long term trend identifcation?
