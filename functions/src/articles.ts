import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import axios from 'axios'

admin.initializeApp()

const firestore = admin.firestore()

interface Article {
    title: string
    description: string
    social_image: string
    published_at: string
    reading_time_minutes: string
    tag_list: []
    url: string
}
// '45 23 * * 6'
export const fetchArticle = functions.pubsub
    .schedule('every 5 minutes')
    .onRun(async () => {
        try {
            const articlesFetch = await axios({
                method: 'get',
                url: 'https://dev.to/api/articles?username=meisterveda&state=fresh',
            })

            articlesFetch.data.map(async (article: Article) => {
                const data: Article = {
                    title: article.title,
                    description: article.description,
                    social_image: article.social_image,
                    published_at: article.published_at,
                    reading_time_minutes: article.reading_time_minutes,
                    url: article.url,
                    tag_list: article.tag_list,
                }
                return await firestore
                    .collection('articles')
                    .doc(data.title)
                    .set(data)
            })
        } catch (error) {
            functions.logger.error(error)
        }
    })
