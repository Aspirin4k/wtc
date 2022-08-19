### ssh into server
``` 
ssh root@server -i ./secrets/rushakov.pem
```

### create github runner user
```
adduser github
```

### generate ssh pair
```
ssh-keygen -t rsa
```

### set authorization_keys
```
cat id_rsa.pub > authorized_keys
```

### copy private key
```
scp -i ./secrets/rushakov.pem root@server:/home/github/.ssh/id_rsa ./secrets/github
```

### remove private key from server
``` 
rm /home/github/.ssh/id_rsa
```

### authorize as github
```
ssh github@server -i ./secrets/github 
```

### setup github runner
https://github.com/Aspirin4k/wtc/settings/actions/runners/new?arch=x64&os=linux

### copy service
```
scp -i ./secrets/rushakov.pem ./inf/service/runner.service root@server:/etc/systemd/system
```

### start service as root
```
systemctl start runner.service
```