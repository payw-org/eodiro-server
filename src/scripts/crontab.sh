# run `crontab -e` to edit crontab
# copy and paste the crons below

# update random nicknames at 00:00
0 0 * * * NODE_ENV=production /home/ubuntu/.nvm/versions/node/v13.14.0/bin/node /home/ubuntu/eodiro/server/build/src/scripts/update-random-nicknames

# seed cafeteria menus at 03:00 everyday
0 3 * * * NODE_ENV=production /home/ubuntu/.nvm/versions/node/v13.14.0/bin/node /home/ubuntu/eodiro/server/build/src/scripts/seed-cafeteria-menus

# garbage collect files every 3 hours
0 */3 * * * NODE_ENV=production /home/ubuntu/.nvm/versions/node/v13.14.0/bin/node /home/ubuntu/eodiro/server/build/src/scripts/garbage-collect-files

# clear pending users every 30 minutes
*/30 * * * * NODE_ENV=production /home/ubuntu/.nvm/versions/node/v13.14.0/bin/node /home/ubuntu/eodiro/server/build/src/scripts/clear-pending-users
