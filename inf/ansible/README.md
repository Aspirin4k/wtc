# infrastructure
## schema
At the current moment system consists of:
* AWS
  * CodePipeline + CodeBuild + CodeDeploy + GitHub integration
  * DB instance
  * Deploy server (free tier micro)
* Hetzner
  * Prod server

## how to start
Prepare env for test and prod (`.env_test` and `.env` at `../environment`), then run:
```
ansible-playbook playbook/prod_init.yml -i hosts // whole prod configuration
```
After this you have to manually setup 
[cert for nginx](https://certbot.eff.org/lets-encrypt/ubuntufocal-nginx) (sic!)

Now setup deploy server with
```
ansible-playbook playbook/deploy_init.yml -i hosts // whole deploy configuration
```

## how to add new environment variables
use ../environment/.env and ../environment/.env_test
after this execute
```
ansible-playbook playbook/prod_environment.yml -i hosts
```