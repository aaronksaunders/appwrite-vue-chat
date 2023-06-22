import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'appwrite-chat',
  webDir: 'dist',
  // when building for IOS you must set the host name,
  // when building for Android you MUST remove the 
  // server config completely
  server : {
    //hostname : 'cloud.appwrite.io',
  },
  plugins: {
    CapacitorCookies: {
      enabled: true,
    }
  },

};

export default config;
