#/bin/bash

DEPLOY_FOLDER="../deploys/questionario/"

rsync -avh  backend/* $DEPLOY_FOLDER --exclude node_modules --delete
cd frontend
npm run build
cd ..
rsync -av frontend/dist/* $DEPLOY_FOLDER/public --exclude *.map



