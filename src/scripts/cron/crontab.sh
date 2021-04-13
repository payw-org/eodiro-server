# run `crontab -e` to edit crontab
# copy and paste the crons below
#
# (optional) restart cron service when its timezone does not follow the system timezone
# > sudo service cron stop
# > sudo service cron start

# [path-to-node]: ex) /home/~/node/v13/bin/node
# [path-to-cron]: ex) /home/~/build/scripts/cron

# update random nicknames at 00:00
0 0 * * * [path-to-node] [path-to-cron]/update-random-nicknames

# check board candidate votes at 00:00
0 0 * * * [path-to-node] [path-to-cron]/check-board-candidate-votes

# check notice every 15 minutes
*/15 * * * * [path-to-node] [path-to-cron]/check-notice

# clear pending users every 30 minutes
*/30 * * * * [path-to-node] [path-to-cron]/clear-pending-users

# backup db everyday at 00:00
0 0 * * * [path-to-node] [path-to-cron]/backup-db

# seed cafeteria menus at 03:00 everyday
# 0 3 * * * NODE_ENV=production [path-to-node] [path-to-cron]/seed-cafeteria-menus
