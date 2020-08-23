import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

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
const auth = firebase.auth()
const { Timestamp, GeoPoint } = firebase.firestore

// export utils/refs
export {
  db,
  auth,
  Timestamp,
  GeoPoint
}