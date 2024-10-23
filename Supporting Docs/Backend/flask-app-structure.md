# Citizen Science App Backend Structure/Outline
This is an initial overview of the backend app structure. Additional modules may be added as needed. 


CitizenScienceApp/
|
|-- backend/
|	|-- app/
|	|	|-- __init__.py					- Initializes Flask app
|	|	|-- routes/						- API route definitions
|	|	|	|-- __init__.py
|	|	|	|-- auth_routes.py				- Authentication related routes
|   |   |   |-- field_app_routes.py         - Routes for mobile app
|	|	|	|-- projects_routes.py			- Routes for student projects
|	|	|	|-- observations_routes.py		- Routes for handling observations
|	|	|-- services/					- Logic handling
|	|	|	|-- __init__.py				
|	|	|	|-- auth_service.py				- Services for authentication
|	|	|	|-- projects_service.py			- Services for projects
|	|	|	|-- observations_service.py		- Services for authentication
|	|	|-- models/						- Database models (will accommodate join tables as needed)
|	|	|	|-- __init__.py				
|	|	|	|-- users.py				
|	|	|	|-- projects.py		
|	|	|	|-- observations.py	
|	|	|	|-- questions.py	
|	|	|-- utils/						- Utility and helpers
|	|	|	|-- __init__.py				
|	|	|	|-- validators.py				
|	|	|	|-- helpers.py		
|	|	|	|-- visualizations.py	
|	|	|-- config.py					
|	|
|	|-- tests/							- Unit and integration tests
|	|-- requirements.txt				- Backend dependencies/packages	
|	|-- .env							- Environment variables
|	|-- .gitignore				
|
|
|-- mobile-app/
|
|-- admin-web-app/



## Backend Plan to Accomidate 2 FE Apps

### Admin-web-app
flask-login -- username/password authentication
bcrypt for password hashing
protected routes -- @login_required
sessions 

### Mobile App Authentication
code-based access
access codes are stored in db.Projects
need route to verify code and add it to a session
set up persistant session for access to the project -> flask-sessions