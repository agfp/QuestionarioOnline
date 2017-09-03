#/bin/bash

DEPLOY_FOLDER="../deploys/questionario/"

cd views/questionnaires
sed -i -- 's/{"key":"key","token":"token"}/<%- parameters %>/g' *.ejs
cd ../..

rsync -avh  backend/* $DEPLOY_FOLDER --exclude node_modules --exclude *.map  --delete
#cd frontend
#npm run build
#cd ..
#rsync -av frontend/dist/* $DEPLOY_FOLDER/public --exclude *.map



