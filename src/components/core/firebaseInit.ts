import { getApp, getApps, initializeApp } from 'firebase/app'
import * as dotenv from 'dotenv'

dotenv.config()

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: 'meisterveda-portfolio.firebaseapp.com',
    projectId: 'meisterveda-portfolio',
    storageBucket: 'meisterveda-portfolio.appspot.com',
    messagingSenderId: '420597744370',
    appId: '1:420597744370:web:b51c8293c5df88616a466b',
    measurementId: 'G-CNZQ6QRSGH',
}

// Initialize Firebase

export const app =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
