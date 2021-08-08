Prepare file `hosts` with machines, env for test and
prod (`.env_test` and `.env`), then run:
```
ansible-playbook playbook.yml -i hosts // whole configuration
ansible-playbook environment.yml -i hosts // environment variables only
```