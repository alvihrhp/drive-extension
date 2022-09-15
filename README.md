# Slack Drive


## What is this project:

Slack Drive is a Slack Application that integrate Slack Workspaces with Google Drives Folder. The aim is to be able to manage a Workspace channel and connect them to a Drive Folder related to the channel project. 

Notes: (Only works if a Slack Account is created with a Google Account). Because it needs to be Authenticate by Google to login to Slack Drive


### Features

- You can switch your workspace to manage their channel
- You can connect a Drive Folder to a certain channel (All the members on that channel will automatically get the permission to access the Drive Folder)
- You can disconnect a Drive Folder from a certain channel (All the members permission on that channel will automatically get revoke)
- If a channel is created then it will automatically update the list of Slack channels on the website (just need to refresh it)
- If a channel is deleted then it will automatically update the list of Slack channels on the website and if your channel already connected to a google      drive then all the members permission on that channel will automatically get revoke 
- If a member join to a channel and the channel already have a Google Drive folder connected then it will automatically given a permission to access the Drive folder
- If a member left from a channel and the channel already have a Google Drive folder connected then it will automatically revoke the permission of the user who left the channel


## Initial Project Setup

### Must Have!

1. Node.JS, NPM and Yarn.
2. PostgreSQL
3. Slack/Bolt (For event API)
4. Setup Google Drive API ,Crendtials, and Oauth Consent Screen on Google Cloud Platform Console. 
5. Create a Slack APP on Slack API website

## Before Run App Locally

### Step to get environment from Google
1. Open https://console.cloud.google.com/
2. Click Library
3. Search Google Drive API
4  Click Enable
5. Go back to https://console.cloud.google.com/
6. On OAuth 2.0 Client IDs there is a name for your application
7. Click it and configure the "Authorized JavaScript origins" and "Authorized redirect URIs"
8. Then you can see actions and click download the oauth2.keys.json
9. There you can find the environment need to run this app locally
8. Then open Oauth Consent Screen and add user for testing

### Step to get environment from Slack (HTTP Slack API)
1. Open https://api.slack.com
2. Click "Your Apps"
3. Click "Create New Apps" and Select from scratch
4. Fill the "App Name" and "Select a workspace" that you want to install the Slack App
5. Scroll down "App Credentials" section to get the environment variables
6. Click "Documentation"
7. On Sidebar Click "APIs"
8. And On "Usage guides" click using the web API
9. Click "Find Out!"
10. Search the API that the Slack App needs
11. Open it and see "Required scopes"
12. Back to "Your Apps" and open "Oauth & Permissions"
13. Scroll down untill "Scopes" section and click "Add an Oauth scope" on "User token scopes"
14. Search the scope that API needs and click it
15. Scroll up and click "Install to your workspace"


### DEV

```sh
# Cloning repository
Clone this repository

# Install frontend Dependencies
yarn 

# Copy .env_example key to .env in backend and frontend
cp .env_example .env

# Install backend dependencies
cd backend && npm install

# Migrate database in backend folder
npx prisma migrate dev --name "migrate init"
```

### Step to get environment from Slack (Event API)
1. After setting up DEV
2. Install ngrok
3. run ngrok `./ngrok http [your running port]` on the folder you installed
4. Go to "Your Apps" and on sidebar "Features" section click "Event Subscription"
5. Copy ngrok link and add `/strata/slack/events`
6. Go to backend folder -> open src -> open createApp.ts
7. Change authorize value to token variable
8. open event.ts and just follow the current code


### Why using Yarn for React and NPM for Express ?

Since we're using React as a front-end it would be more stable using yarn than npm.
For the backend we're using Express.JS so it should be alright to use npm.

### PROD

Copy the below link to your browser: 

```sh
https://slack.com/oauth/v2/authorize?client_id=4073518364263.4081498183766&scope=bookmarks:read,bookmarks:write,channels:read,groups:read,im:read,incoming-webhook,mpim:read,team:read,users.profile:read,users:read,users:read.email&user_scope=bookmarks:read,bookmarks:write,channels:read,channels:write,groups:history,groups:write,groups:read,im:read,im:write,mpim:read,team:read,users.profile:read,users:read,users:read.email
```

After that it should open a page that contains: 

<img width="1440" alt="Screen Shot 2022-09-05 at 10 13 09" src="https://user-images.githubusercontent.com/52234049/188353689-98b96efc-c973-407e-afe9-14be5797f9dd.png">

That page is for Slack Drive to ask a permission to install it into your workspace

### Configure
- You can choose which workspace you want to install on the upper right page.
- You can choose which channel or user that you want to inform that your workspace have intergrated to your workspace.

After you configure the above list click `Allow` then it will redirect to Slack Drive login page and a popup will show up that say Slack Drive is installing into your workspace.

<img width="1440" alt="Screen Shot 2022-09-05 at 10 18 55" src="https://user-images.githubusercontent.com/52234049/188354239-94f26bfd-7a0f-4b4c-8846-e86f615e07a7.png">

After you click `Login with Google` it will redirect you to Google Authentication to select your google account

![google_oauth_prompt-879x1024](https://user-images.githubusercontent.com/52234049/188354722-73aa221e-eed8-4012-b20d-26769b61d433.png)

Then after that you will redirect to a google Authorization, which you have to checklist all the Drive permission so Slack Drive can access your Google Drive list

<img width="1440" alt="Screen Shot 2022-09-05 at 10 25 27" src="https://user-images.githubusercontent.com/52234049/188354871-dedf88fa-05c1-4b52-8196-f1884c601c32.png">

After all done, you will redirect to Slack Drive homepage.
