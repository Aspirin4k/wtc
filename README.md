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

### cli
Run `wtc-backend cli` command.

Pass desirable command as arguments. Available commands:
- `POST_LOADER` - load new posts from VK and store them into DB
## production
### first time deploy
The following must be done manually after ansible execution:
- configuration of HTTPS (Requesting certificate) for Nginx
- install nvm and node 16
### release
To deploy version from test to prod use `swap_release.sh`