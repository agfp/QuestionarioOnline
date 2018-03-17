#/bin/bash

BUILD_NAME="ufmg0"

cd frontend
npm run build
cd ..
rsync -av frontend/dist/static/css backend/public/static --exclude *.map
rsync -av frontend/dist/static/js backend/public/static --exclude *.map

cp -v frontend/dist/index.html backend/views/questionnaires/$BUILD_NAME.ejs

cd backend/views/questionnaires
sed -i -- 's/{"key":"key","token":"token"}/<%- parameters %>/g' $BUILD_NAME.ejs
