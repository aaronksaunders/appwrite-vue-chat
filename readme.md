Appwrite Chat With Ionic Vue
==


>NOTE : when setting up app in Appwrite set the host to `cloud.appwrite.io` or else realtime will not work on device

## Setup Appwrite Project
- set up a project in Appwrite Cloud, be sure to set the host to `cloud.appwrite.io`
- set authentication to `email`
- create a database
- create a collection, in the collection there are three fields

    | Field Name | Required | Type |
    |--------|----------|------| 
    | `message`     | true| String 512 |
    | `owner`       | true | String 128 |
    | `displayName` | false | String 128 |

- in  Collection > Settings set Update the permissions so that users can create documents and turn on "Document Security"
- Be sure to get the `ProjectID`, `DatabaseID`, `CollectionID`; you will need them for the `.env` file which will be used by the application

## Setup Ionic Vue App

you must modify the `capacitor.config.ts` file for the application to work properly on ios. 
```javascript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'appwrite-chat',
  webDir: 'dist',
  // when building for IOS you must set the host name,
  // when building for Android you can remove the server config
  server : {
    hostname : 'cloud.appwrite.io',
    androidScheme: 'https'
  },
  plugins: {
    CapacitorCookies: {
      enabled: true,
    }
  },

};

export default config;

```

Make sure you set you `.env` file properly using the values from your Appwrite Project. There is an example file, `.env.example` you can use to help ensure you collect the proper environment variables

```javascript
VITE_APPWRITE_ENDPOINT=
VITE_APPWRITE_PROJECT=
VITE_APPWRITE_DB=
VITE_APPWRITE_COLLECTION=
```

