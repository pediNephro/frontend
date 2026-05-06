pipeline {
    agent any

    environment {
        DOCKER_HUB_REPO = 'azizos07/frontend'
        SERVICE_NAME = 'frontend'
        NAMESPACE = 'pedinephro'
        TAG = 'latest'
        K8S_CONTEXT = 'kind-pedinephro-cluster'
    }

    stages {

        stage('Pre-checks') {
            steps {
                sh '''
                    set -e
                    echo "Checking kubectl..."
                    kubectl version --client

                    echo "Checking cluster access..."
                    kubectl config use-context ${K8S_CONTEXT}
                    kubectl get nodes
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    set -e

                    echo "Deploying ${SERVICE_NAME}..."

                    kubectl set image deployment/${SERVICE_NAME} \
                        ${SERVICE_NAME}=${DOCKER_HUB_REPO}:${TAG} \
                        -n ${NAMESPACE}

                    kubectl rollout restart deployment/${SERVICE_NAME} -n ${NAMESPACE}

                    kubectl rollout status deployment/${SERVICE_NAME} -n ${NAMESPACE}
                '''
            }
        }

        stage('Verify') {
            steps {
                sh '''
                    echo "Pods:"
                    kubectl get pods -n ${NAMESPACE} -l app=${SERVICE_NAME}

                    echo "Service:"
                    kubectl get svc -n ${NAMESPACE}
                '''
            }
        }
    }

    post {
        success {
            echo "✅ CD deployment successful"
        }
        failure {
            echo "❌ CD deployment failed"
        }
    }
}