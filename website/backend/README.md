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

#### NOTE!!!
make sure port:5000 is not occupied by using:

 `curl -X OPTIONS http://localhost:5000/api/signup -i`
 if "`Server: AirTunes/800.74.5`" is there, go to system settings -> air reciever -> an disable it.

 After, you should re-run the command and see something like:

`HTTP/1.1 200 OK
Server: Werkzeug/3.1.3 Python/3.11.5
Date: Mon, 01 Dec 2025 21:56:57 GMT
Content-Type: text/html; charset=utf-8
Allow: OPTIONS, POST
Content-Length: 0
`