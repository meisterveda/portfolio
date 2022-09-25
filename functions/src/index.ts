/* eslint-disable */

import * as functions from 'firebase-functions'
import axios from 'axios'
import * as admin from 'firebase-admin'

admin.initializeApp()

const firestore = admin.firestore()

exports.getDevtoUserArticles = functions.https.onRequest(async (req, res) => {
    try {
        await getUserArticles()
    } catch (error) {
        res.status(500).send(error)
    }
})

async function getUserArticles() {
    const response = await axios.get(
        'https://dev.to/api/articles?username=meisterveda&state=fresh'
    )
    console.log(JSON.stringify(response.data))
}
