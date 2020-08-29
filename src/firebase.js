import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/messaging'

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: "AIzaSyA7cooiwg5EHcOSYxDY4Jnn1UXo1-QayXI",
  authDomain: "apelbulog.firebaseapp.com",
  databaseURL: "https://apelbulog.firebaseio.com",
  projectId: "apelbulog",
  storageBucket: "apelbulog.appspot.com",
  messagingSenderId: "916435105534",
  appId: "1:916435105534:web:c24c0b17949dde84d817af"
}
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
// db.settings({ experimentalForceLongPolling: true })
const auth = firebase.auth()
const storage = firebase.storage()
const RecaptchaVerifier = firebase.auth.RecaptchaVerifier
const increment = firebase.firestore.FieldValue.increment
const { Timestamp } = firebase.firestore

let messaging
if(firebase.messaging.isSupported()) {
  messaging = firebase.messaging()
}

// Offline support
db.enablePersistence()

// export utils/refs
export {
  db,
  auth,
  storage,
  messaging,
  RecaptchaVerifier,
  Timestamp,
  increment
}