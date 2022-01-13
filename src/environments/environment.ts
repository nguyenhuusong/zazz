// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const host = {
  socketServer: 'http://125.212.202.15:3000',
  authServer: 'https://api.sunshinegroup.vn:5000',
  apiServer: 'https://api.sunshinegroup.vn',
  apShomeServer: 'https://apiresident.sunshinetech.com.vn',
  apiHrmServer: 'https://apihrm.sunshinetech.com.vn',
  apiCoreServer: 'https://apicore.sunshinetech.com.vn',
  uploadServer: 'https://data.sunshinegroup.vn/api/v1/FileHandler',
  cloudFunction: 'https://us-central1-sunshine-super-app.cloudfunctions.net'
  // cloudFunction: 'https://asia-northeast1-sunshine-app-production.cloudfunctions.net'
};

const authenSettings = {
  authority: host.authServer,
  client_id: 'web_s_hrm_dev',
  redirect_uri: 'http://localhost:4200/auth-callback',
  post_logout_redirect_uri: 'http://localhost:4200',
  response_type: 'id_token token',
  scope: 'openid profile api_sre api_home_service api_core_bigtec api_hrm_bigtec',
  filterProtocolClaims: true,
  loadUserInfo: true,
  automaticSilentRenew: true,
  silent_redirect_uri: 'http://localhost:4200/silent-refresh.html'
};

export const environment = {
  production: false,
  apiBase: host.apiServer,
  socketServer: host.socketServer,
  apiShomeBase: host.apShomeServer,
  apiHrmBase: host.apiHrmServer,
  apiCoreBase: host.apiCoreServer,
  authenSettings: authenSettings,
  cloudFunctionServer: host.cloudFunction,
  uploadServer: host.uploadServer,
  firebase: {
    // apiKey: 'AIzaSyAb3orVc8nnGT0L2JgbdzXrRND393mFiFU',
    // authDomain: 'sunshine-app-production.firebaseapp.com',
    // databaseURL: 'https://sunshine-app-production.firebaseio.com',
    // projectId: 'sunshine-app-production',
    // storageBucket: 'sunshine-app-production.appspot.com'
    apiKey: 'AIzaSyAczqJoNnTDPPLktoPtQ694IH38sR8wX6w',
    authDomain: 'sunshine-super-app.firebaseapp.com',
    databaseURL: 'https://sunshine-super-app.firebaseio.com',
    projectId: 'sunshine-super-app',
    storageBucket: 'sunshine-super-app.appspot.com',
    messagingSenderId: '504497996884',
    appId: '1:504497996884:web:14254d3f5e66c908'
  }
};

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.





