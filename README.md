# CACHE - Digital Skills Project
**CACHE** is a simple website that will allow users to track and manage their finances. To manage their finances, they will link their bank account with the application. They can then access their transactions, create savings goals, and calculate their expected pay. The solution will use third party APIs such as Plaid, for bank account linking, and ChatGPT for chatbot functionality. The main goal is to help shopping addiction.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)

## Overview
This website will be a full stack application. The frontend will be created using React JS (JavaScript web framework). The backend will use Python 3.9.18 and will use the Flask libary to handle web requests. The third party APIs will be ChatGPT, for chatbot functionality, and Plaid, for banking functionality. These APIs will communicate with the Python app. Both the frontend and backend will be hosted on AWS amplify and the database will be hosted on AWS RDS.

Some tools that you will need are:
- Miniconda to manage Python libraries and environments.
- Docker to containerise the Python app so that it will run the same on different machines.
- MySQL Workbench to be able to create a database that will work with the Python App.
- Postman to test all the Python App endpoints during development.
- Node so that you can run the frontend locally.

## Installation
### GitHub CLI
Note

make sure you install Git before installing the GitHub CLI tool. You can do this at the url https://git-scm.com/downloads.

I would use the GitHub CLI tool to be able to pull the repository. go to the url https://cli.github.com ![GitHub web page](images/ghcli-web.png)
This will allow for you to authenticate your credentials with your local git installation. To download the repository using the github cli run this command.
Then in powershell run the command:

```git
gh auth login
```
This should show allow you to use git with your github login.
![GitHub ClI authentication](images/ghcli-authentication.png)
Now in the directory of your choice run this command:

```git
git clone https://github.com/ChrisB200/cache.git -b development
```

![Cloning Git Repository](images/git-clone.png)
This will download the repository from github so that you can start to make changes.
### Miniconda
To install Miniconda you need to go to the url https://docs.conda.io/projects/miniconda/en/latest/index.html ![Miniconda Log in page](images/miniconda-download.png)
Press the __Miniconda3 Windows 64-bit__ link to download the application.
![Installing Miniconda](images/miniconda-wizard.png)
When downloading ensure that you have the checkbox __Add Miniconda3 to my PATH environment variable__ This will ensure you can run the commands in cmd and powershell.
![Minconda CMD](images/miniconda-cmd.png)
To test if __miniconda__ is installed correctly you can type __conda__ into either command prompt or powershell and it should return the tools.

Now in the Cache folder location cd into the src folder, this is where the Python Code is contained. Yeah i know its buried deep into the project but blame AWS lol. Here is the command:
```powershell
cd cache\amplify\backend\api\cachebackend\src
```
![Using CD to find directory](images/cd-into-directory.png)

Now you have to create a virtual environment. This means that you have an isolated python environment with the exact same python version and external libraries as me. This is done by using the environment.yml file in the src folder. The command that you will need to run is this:
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