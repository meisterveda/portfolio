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
    topics: []
    homepageUrl: string
}

// '45 23 * * 6'
export const fetchProjects = functions
    .runWith({ secrets: ['GIT_AUTH_KEY'] })
    .pubsub.schedule('every 5 minutes')
    .onRun(async () => {
        try {
            const apiData = JSON.stringify({
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
                      }
                    }
                  }
                }
              }`,
                variables: {},
            })
            const token = JSON.stringify(process.env.GIT_AUTH_KEY)
            const projectsFetch = await axios({
                method: 'post',
                url: 'http://api.github.com/graphql',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token.replace(/['"]+/g, ''),
                },
                data: apiData,
            })
            console.log(projectsFetch.data.organization.repositories.edges)
            const organizationRepos =
                projectsFetch.data.organization.repositories.edges
            const personalRepos =
                projectsFetch.data.repositoryOwner.repositories.edges

            const projects = organizationRepos.concat(personalRepos)
            projects.data.map(async (project: Projects) => {
                const data: Projects = {
                    name: project.name,
                    description: project.description,
                    markdown: project.name + '.txt',
                    updatedAt: project.updatedAt,
                    url: project.url,
                    topics: project.topics,
                    homepageUrl: project.homepageUrl,
                }
                return await firestore.collection('projects').add(data)
            })
        } catch (error) {
            functions.logger.error(error)
        }
    })
