# Ambient Reminders

Creating ambient reminders for upcoming appointments.

![image](https://cloud.githubusercontent.com/assets/742934/9568892/34ed9ffa-4f26-11e5-9882-b7629897562c.png)

##Instructions for installing on Linux (tested on 14.04 LTS 64-bit):

1. #### Setting up environment
  * Seting up basic requirements:
  ``` bash 
  sudo apt-get update
  sudo apt-get install git make vim python-dev python-pip
  sudo apt-get install build-essential libssl-dev
  ```
  
  * Setting up USB library:
  ``` bash 
  sudo apt-get install libudev-dev libusb-1.0-0-dev libfox-1.6-dev
  ```
  
2. #### Installing Node.js:
  * See [tutorial here](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server) for other ways:
  ``` bash
  curl https://raw.githubusercontent.com/creationix/nvm/v0.16.1/install.sh | sh
  source ~/.profile
  nvm ls-remote
  nvm install v0.11.16
  nvm use 0.11.16
  node -v
  # See where installed
  which node 
  ```

  You may want to add `nvm use 0.11.16` add the end of your .bashrc/.profile

3. #### Change directory to src and do: 
  ```npm install```
  

4. #### To get the web-server to work:
  Change directory to `/src/controllers/web` and do
  ```npm install```
  and to start the local-server do the following and go to `http://localhost:5000/` in your browser:
  ```node app.js```
