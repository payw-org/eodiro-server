## Backup

```zsh
% mysqldump -u [username] -p [database] > backup.sql
```

### gzip

```zsh
% mysqldump -u [username] -p [database] | gzip > backup.sql.gz
```

### With current date

```zsh
% mysqldump -u [username] -p [database] | gzip > backup_$(date +%F.%H%M%S).sql.gz
```

## Restore

```zsh
% mysql -u [username] -p [database] < backup.sql
```

## Crontab

```zsh
crontab -e
```

```
00 23 * * * mysqldump -u [username] -p [database] | gzip > /home/utente/backup.sql.gz
```

### Password

Create `.my.cnf` in the home directory.

```zsh
% touch .my.cnf
```

```zsh
[client]
password=your_pass
```

To keep the password safe, the file should not be accessible to anyone but yourself. To ensure this, set the file access mode to 400 or 600.

```zsh
% chmod 600 .my.cnf
```

[Reference (Stack Overflow)](https://stackoverflow.com/questions/6861355/mysqldump-launched-by-cron-and-password-security/6861458#6861458)
