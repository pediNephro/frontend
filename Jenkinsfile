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

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    set -e

                    kubectl config use-context kind-pedinephro-cluster

                    kubectl set image deployment/frontend \
                        frontend=azizos07/frontend:latest \
                        -n pedinephro

                    kubectl rollout status deployment/frontend -n pedinephro
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