pipeline {
    agent any

    environment {
        IMAGE_NAME = 'brahimbk/frontend'
        IMAGE_TAG = 'latest'
    }

    stages {

        stage('1 - Checkout') {
            steps {
                git branch: 'frontB',
                    url: 'https://github.com/pediNephro/frontend.git',
                    credentialsId: 'github-credentials'
                echo 'Code pulled from GitHub'
            }
        }

        stage('2 - Docker Build') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                echo 'Docker image built'
            }
        }

        stage('3 - Docker Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                    sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }
    }

    post {
        success {
            echo "Frontend image pushed: ${IMAGE_NAME}:${IMAGE_TAG}"
        }
        failure {
            echo "Pipeline failed"
        }
        always {
            sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
        }
    }
}