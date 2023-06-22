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
