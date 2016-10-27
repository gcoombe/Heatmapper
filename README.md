# Heatmapper

##Before deploying

This app interacts with the mapbox api so you will need an access token.  Accounts are free up to 5,000 requests a month. (https://www.mapbox.com/)

## To run

1. Activate virtualenv
1. `pip install -r requirements.txt`
1. `npm install or yarn install`
1. Install ruby
1. Install sass: `gem install sass`
1. Webpack and compile sass files: `grunt`
1. Create file instance/application.cfg (relative to root)
1. In config file add line "MAPBOX_KEY"=<your mapbox key>" See above for directions to get key
1. `sh run.sh`