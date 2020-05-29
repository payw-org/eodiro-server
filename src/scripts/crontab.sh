# run `crontab -e` to edit crontab
# copy and paste the crons below

0 0 * * * NODE_ENV=development /home/ubuntu/.nvm/versions/node/v13.14.0/bin/node /home/ubuntu/eodiro/server/build/src/scripts/update-random-nickname
0 3 * * * NODE_ENV=development /home/ubuntu/.nvm/versions/node/v13.14.0/bin/node /home/ubuntu/eodiro/server/build/src/scripts/seed-cafeteria-menus
