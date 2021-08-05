# wtc-backend
## dev
### migrations
```
mvn flyway:migrate
```
### api

Run `wtc-backend api` command.

API will be available on port 8080 by default:
```
http://127.0.0.1:8080/hello
```
## production
### first time deploy
The following must be done manually after ansible execution:
- configuration of HTTPS (Requesting certificate) for Nginx
### release
To deploy version from test to prod use `swap_release.sh`