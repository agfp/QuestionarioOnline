#/bin/bash

BUILD_NAME="hc"

cd frontend
npm run build
cd ..
rsync -av frontend/dist/static/css backend/public/static --exclude *.map --delete
rsync -av frontend/dist/static/js backend/public/static --exclude *.map --delete

cp -v frontend/dist/index.html backend/views/questionnaires/$BUILD_NAME.ejs

cd backend/views/questionnaires
sed -i -- 's/{"key":"key","token":"token"}/<%- parameters %>/g' $BUILD_NAME.ejs
#cd ../..
