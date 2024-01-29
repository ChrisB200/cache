# CACHE - Digital Skills Project
**CACHE** is a simple website that will allow users to track and manage their finances. To manage their finances, they will link their bank account with the application. They can then access their transactions, create savings goals, and calculate their expected pay. The solution will use third party APIs such as Plaid, for bank account linking, and ChatGPT for chatbot functionality. The main goal is to help shopping addiction.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)

## Overview
This website will be a full stack application. The frontend will be created using React JS (JavaScript web framework). The backend will use Python 3.9.18 and will use the Flask libary to handle web requests. The third party APIs will be ChatGPT, for chatbot functionality, and Plaid, for banking functionality. These APIs will communicate with the Python app. Both the frontend and backend will be hosted on AWS amplify and the database will be hosted on AWS RDS.

Some tools that you will need are:
- Anaconda to manage Python libraries and environments.
- Docker to containerise the Python app so that it will run the same on different machines.
- MySQL Workbench to be able to create a database that will work with the Python App.
- Postman to test all the Python App endpoints during development.
- Node so that you can run the frontend locally.

## Installation
### Anaconda
### Docker
### MySQL Workbench
### Postman
### Node

## Usage
### Pulling the Project
There are 2 branches. There is the main branch which is used by AWS Amplify to update the changes in the cloud. NEVER EDIT THIS BRANCH UNTIL THE APP IS COMPLETE. This is because it will push the changes in the cloud, and if the app is not tested corrcetly it can cause downtime. The development branch is the branch that you should edit and is the branch that will run locally on your machine. To pull this branch you use this command.

```git
git clone https://github.com/ChrisB200/cache.git -b development
```

### Python
#### Project Structure
![Image of the directory structure](images/directory-structure.png)

Here is the structure of the backend. The main.py file is there to run the program. The environment.yml file stores all the external libraries so that it is easy to download. The dockerfile tells docker how to build the application. The buildspec.yml file is something to do with amplify, just don't change it. The .env file stores all the environment variables, this is only for development. 

Then there is an app folder. This app folder contains 2 other folders and some additional files. The routes folder categorises endpoints by their function. For instance, the auth.py file will be the code for all endpoints relating to authentication. The scripts folder stores all the external python files that I have created. for instance utils.py stores all functions that are used a lot. 

You might see in each folder there is a __init__.py file. This file turns the whole folder into like a python module. there is one in app which will combine everything and there is one in routes and scripts. This just makes it easier to run it. The models.py file stores all the database tables. The plaid_config.py sets up plaid for external use.
#### Flask
#### Plaid