import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import axios from 'axios'
import * as dotenv from 'dotenv'

dotenv.config()

const firestore = admin.firestore()

interface Projects {
    name: string
    description: string
    markdown: string
    updatedAt: string
    url: string
    topics: string[]
    homepageUrl: string
    owner: string
}
// '45 23 * * 6' 0 0 */3 * *
export const githubProjects = functions
    .runWith({ secrets: ['GIT_AUTH_KEY'] })
    .pubsub.schedule('0 0 */3 * *')
    .onRun(async () => {
        try {
            const data = JSON.stringify({
                query: `query {
                          organization(login: "vedacomputing") {
                            repositories(
                              affiliations: OWNER
                              orderBy: {field: UPDATED_AT, direction: DESC}
                              isFork: false
                              isLocked: false
                              first: 10
                              privacy: PUBLIC
                            ) {
                              edges {
                                node {
                                  description
                                  name
                                  url
                                  repositoryTopics(first: 1) {
                                    edges {
                                      node {
                                        topic {
                                          name
                                        }
                                      }
                                    }
                                  }
                                  homepageUrl
                                  updatedAt
                                  owner {
                                    login
                                  }
                                }
                              }
                            }
                          }
                          repositoryOwner(login: "meisterveda") {
                            repositories(
                              affiliations: OWNER
                              isFork: false
                              isLocked: false
                              first: 10
                              orderBy: {field: UPDATED_AT, direction: DESC}
                              privacy: PUBLIC
                            ) {
                              edges {
                                node {
                                  description
                                  name
                                  url
                                  repositoryTopics(first: 1) {
                                    edges {
                                      node {
                                        topic {
                                          name
                                        }
                                      }
                                    }
                                  }
                                  homepageUrl
                                  updatedAt
                                  owner {
                                    login
                                  }
                                }
                              }
                            }
                          }
                        }`,
                variables: {},
            })

            const config = {
                method: 'post',
                url: 'https://api.github.com/graphql',
                headers: {
                    Authorization: JSON.stringify(
                        process.env.GIT_AUTH_KEY
                    ).replace(/['"]+/g, ''),
                    'Content-Type': 'application/json',
                },
                data: data,
            }

            const projectsFetch = await axios(config)

            const repoData = projectsFetch.data.data
            const organizationRepos = repoData.organization.repositories.edges
            const personalRepos = repoData.repositoryOwner.repositories.edges
            const projects = organizationRepos.concat(personalRepos)
            projects.map(async (project: any) => {
                const data: Projects = {
                    name: project.node.name,
                    description: project.node.description,
                    markdown: project.node.name + '.txt',
                    updatedAt: project.node.updatedAt,
                    url: project.node.url,
                    topics: [],
                    homepageUrl: project.node.homepageUrl,
                    owner: project.node.owner.login,
                }
                project.node.repositoryTopics.edges.map(
                    (icon: { node: { topic: { name: string } } }) => {
                        return data.topics.push(icon.node.topic.name)
                    }
                )
                return await firestore
                    .collection('projects')
                    .doc(data.name)
                    .set(data)
            })
        } catch (error) {
            functions.logger.error(error)
        }
    })

export const repoCleaner = functions.pubsub
    .schedule('0 0 */3 * *')
    .onRun(async () => {
        try {
            const projects = await firestore
                .collection('projects')
                .orderBy('updatedAt')
                .limit(20)
                .get()
            console.log(projects)
            projects.docs.map(async (project) => {
                const config = {
                    method: 'post',
                    url:
                        'https://api.github.com/repos/' +
                        project.data().owner +
                        '/' +
                        project.data().name,
                    headers: {
                        Authorization: JSON.stringify(
                            process.env.GIT_AUTH_KEY
                        ).replace(/['"]+/g, ''),
                        'Content-Type': 'application/json',
                    },
                }

                const response = await axios(config)
                console.log(response.status)
                if (response.status !== 200) {
                    await firestore
                        .collection('projects')
                        .doc(project.data().name)
                        .delete()
                }
            })
        } catch (error) {
            functions.logger.error(error)
        }
    })
