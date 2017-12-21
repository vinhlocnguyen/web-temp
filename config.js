// Copy this config file to config.js and change the values to values that fit your environment
const DOMAIN = (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.DOMAIN) ? window.__ENV__.DOMAIN : 'http://localhost:8080';

// BUILD VERSION
const BUILD_VERSION = typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.HOSTNAME;
// APPLICATION KEY
const FACEBOOK = {
  APP_ID: '322828988048328',
  SCOPE: encodeURIComponent('public_profile,email')
};

const LINKEDIN = {
  APP_ID: '77oup879xvs1cq',
  STATE_CODE: 'XZqFcIAH4Iydf85pT8iygRpU',
  SCOPE: encodeURIComponent('r_basicprofile r_emailaddress')
};

const AUTHORIZATION_REDIRECT = encodeURIComponent(DOMAIN + '/login');

const GOOGLE_ANALYTICS = {
  TRACK_ID: 'UA-31282630-8'
};

const CALLBACK_URL = encodeURIComponent(DOMAIN + '/callback');
const FORGOT_PASSWORD_CALLBACK = encodeURIComponent(DOMAIN + '/retrieve-password');

const DEFAULT_LANGUAGE = 'en';

const FEATURES = process.env.FEATURES || {};

const SERVICE_RANGE = 2;

const COOKIE_OPTIONS = {
  PATH: '/',
  DOMAIN: (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.COOKIE_DOMAIN) || '.drops.io'
};

const IMAGE = {
  DEFAULT_AVATAR: 'https://www.gravatar.com/avatar?d=mm',
  DEFAULT_CATEGORY: {
    'restaurant': require('./src/web/assets/images/ic-fn-b.svg'),
    'hotel': require('./src/web/assets/images/ic-hotel.svg'),
    'conciergerie': require('./src/web/assets/images/ic-conciergerie.svg'),
    'car wash': require('./src/web/assets/images/ic-carwash.svg'),
    'fitness': require('./src/web/assets/images/ic-fitness.svg'),
    'hairdresser': require('./src/web/assets/images/ic-hairdresser.svg'),
    'laundry': require('./src/web/assets/images/ic-laundry.svg')
  },
  NO_IMAGE: 'https://storage.cloud.google.com/drops-storage-eu-west1/production/placeholder.jpg'
};

//exports modules
module.exports = {
  DOMAIN: DOMAIN,
  FACEBOOK: FACEBOOK,
  LINKEDIN: LINKEDIN,
  AUTHORIZATION_REDIRECT: AUTHORIZATION_REDIRECT,
  GOOGLE_ANALYTICS: GOOGLE_ANALYTICS,
  CALLBACK_URL: CALLBACK_URL,
  FORGOT_PASSWORD_CALLBACK: FORGOT_PASSWORD_CALLBACK,
  DEFAULT_LANGUAGE: DEFAULT_LANGUAGE,
  FEATURES: FEATURES,
  SERVICE_RANGE: SERVICE_RANGE,
  IMAGE: IMAGE,
  BUILD_VERSION: BUILD_VERSION,
  COOKIE_OPTIONS: COOKIE_OPTIONS
};
