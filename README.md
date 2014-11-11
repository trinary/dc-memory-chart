dc-memory-chart
===============

Chart various things about the ruby VM from DCs. If you don't know what this means, don't worry about it.

### HOWTO
 * clone this repo
 * scp a service_memory.log file from a DC host, save it locally.
 * pipe service_memory.log through the gen-data.sh script and save it as a file in data/
  * `cat service_memory.log | sh ./gen-data.sh > data/dc-memory.json`, data/*.json is .gitignored
 * in app.js, change the d3.json() path to point at whatever file you saved in data/ (eg data/dc-memory.json)
 * serve the project statically: `python -m SimpleHTTPServer` is a good way to go
 * point a browser at it.
 
### TODO
 
* automation of log collection and parsing
* get a list of available log files for display
* track PID changes (identify service crashes/restarts)
* make the mouseover prettier and more useful
* pan/zoom over longer timelines
* multi-data-set selection? Log axes? Long term trend identifcation?
