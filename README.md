# wtc-backend
## dev
### migrations
```
mvn flyway:migrate
```

## production
### first time deploy
The following must be done manually after ansible execution:
- configuration of HTTPS (Requesting certificate) for Nginx
### release
To deploy version from test to prod use `swap_release.sh`
* prod https://whentheycry.ru
* test https://whentheycry.ru/test