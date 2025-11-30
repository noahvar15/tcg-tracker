# Setup

Run quickRun.py to generate a secret key. **OR** just reuse the secret_key generated below. 

Then create a .env file in the following format:

`
DB_HOST=localhost
DB_USER=User
DB_PASSWORD=Password
DB_NAME=tcg_tracker
SECRET_KEY=ac7babacad1d1e51fee370064cb7d6732988a7689b6c1fe7a0103252dde98363
`


Then you can run the actual backend + frontend

### Running Backend:
In the terminal run (Mac) 
`
export FLASK_APP=app.py
export FLASK_ENV=development
flask run
`