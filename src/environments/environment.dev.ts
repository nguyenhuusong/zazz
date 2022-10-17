const host = {
  socketServer: 'wss://localhost:6999',
  authServer: 'https://dev-auth.unicloudgroup.com.vn', 
  apiServer: 'https://dev.api.unicloudgroup.com.vn', 
  apShomeServer: 'https://dev.api.apiresident.unicloudgroup.com.vn',
  apiCoreServer: 'https://dev.api.core.unicloudgroup.com.vn',
  apiHrmServer: 'https://dev.api.hrm.unicloudgroup.com.vn',
  uploadServer: 'https://data.sunshinegroup.vn/api/v1/FileHandler',
  // cloudFunction: 'https://us-central1-sunshine-super-app.cloudfunctions.net' //dev
  cloudFunction: 'https://asia-northeast1-sunshine-app-production.cloudfunctions.net' //product
};

const authenSettings = {
  authority: host.authServer,
  client_id: 'web_s_hrm_prod',
  redirect_uri: 'https://dev-web-hrm.unicloudgroup.com.vn/auth-callback',
  post_logout_redirect_uri: 'https://dev-web-hrm.unicloudgroup.com.vn',
  response_type: 'id_token token',
  scope: 'openid profile api_sre api_home_service api_core_bigtec api_hrm_bigtec',
  filterProtocolClaims: true,
  loadUserInfo: true,
  automaticSilentRenew: true,
  silent_redirect_uri: 'https://dev-web-hrm.unicloudgroup.com.vn/silent-refresh.html'

};


const firebase = {
  apiKey: 'AIzaSyAb3orVc8nnGT0L2JgbdzXrRND393mFiFU',
  authDomain: 'sunshine-app-production.firebaseapp.com',
  databaseURL: 'https://sunshine-app-production.firebaseio.com',
  projectId: 'sunshine-app-production',
  storageBucket: 'sunshine-app-production.appspot.com'
  // apiKey: 'AIzaSyAczqJoNnTDPPLktoPtQ694IH38sR8wX6w',
  // authDomain: 'sunshine-super-app.firebaseapp.com',
  // databaseURL: 'https://sunshine-super-app.firebaseio.com',
  // projectId: 'sunshine-super-app',
  // storageBucket: 'sunshine-super-app.appspot.com',
  // messagingSenderId: '504497996884',
  // appId: '1:504497996884:web:e07732b704e759529819c1',
};

export const environment = {
  production: true,
  apiBase: host.apiServer,
  apiHrmBase: host.apiHrmServer,
  apiShomeBase: host.apShomeServer,
  apiCoreBase: host.apiCoreServer,
  socketServer: host.socketServer,
  cloudFunctionServer: host.cloudFunction,
  authenSettings: authenSettings,
  uploadServer: host.uploadServer,
  firebase
};









