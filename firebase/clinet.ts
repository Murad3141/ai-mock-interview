import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDJq_xxSmjDqrjFVQ-MfsVwjeSI7qlAEKc",
  authDomain: "prepwise-43017.firebaseapp.com",
  projectId: "prepwise-43017",
  storageBucket: "prepwise-43017.appspot.com",
  messagingSenderId: "350057923161",
  appId: "1:350057923161:web:9ae9a515e06504a643a748",
  measurementId: "G-N8PDWRKWDE",
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
