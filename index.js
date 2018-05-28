//import uuid from 'uuid'

const uuid = require('uuid')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/test', (req, res) => res.render('pages/index'))
  .get('/', (req, res) =>{
    const boxSDK = require('box-node-sdk');  // Box SDK
    const fs = require('fs');                // File system for config
    const FILENAME = "config.json";
    // Fetch config file for instantiating SDK instance
    const configJSON = JSON.parse(fs.readFileSync(FILENAME));

    // Instantiate instance of SDK using generated JSON config
     const sdk = boxSDK.getPreconfiguredInstance(configJSON);

     var serviceAccountClient = sdk.getAppAuthClient('enterprise');

     // Set app user details
     const userName = 'APP USER '+ uuid.v4();
     const spaceAmount = 1073741824;
     let userId;

    // Create app user
    serviceAccountClient.enterprise.addAppUser(
       userName, 
     {
        space_amount: spaceAmount
      },
  callback
);

function callback(err, res) {
  if (!err) 
  {  
     let folderId;
     userId = res.id;
     console.log(`App user ${res.id} is created successful`);

     var appUserClient = sdk.getAppAuthClient('user', userId);

     // Set folder values
    const folderName = 'FOLDER NAME 1'+ uuid.v4() ;
    //const folderId = uuid.v4();

     // Create folder
     appUserClient.folders.create('0', folderName, (err, res) => {
       folderId = res.id;
      console.log(`folder ${res.id} is created successful`);
      // Set upload values
      const fileName = 'test.txt';

      // Create file upload stream
      const stream = fs.createReadStream(fileName);

       // Upload file
       appUserClient.files.uploadFile(
           folderId, 
          fileName, 
           stream, 
           callback);

function callback(err, response) {
  // HANDLE ERROR CASE AND RESPONSE
  console.log(`upload file`);
  res.send('upload file successful');
}
     });

    /* serviceAccountClient.folders.create('0', folderName, (err, res) => {
      console.log(`create folder`);
     });*/
     
  }
}

/*let session = box.getPreconfiguredInstance(configFile);

// Don't be thrown off by the method name:
// This method works with Managed Users and App Users if you have the correct scopes on your application.
session.getAppUserTokens(userId)
    .then((userTokenObject) => {
        console.log(userTokenObject.accessToken);
    }); */
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
