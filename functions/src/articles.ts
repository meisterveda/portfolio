import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import axios from 'axios'

admin.initializeApp()

export const fetchArticle = functions.pubsub
    .schedule('45 23 * * 6')
    .onRun(async () => {
        const devFetch = await axios({
            method: 'get',
            url: 'https://dev.to/api/articles?username=meisterveda&state=fresh',
        })
        console.log(JSON.stringify(devFetch.data))
    })
