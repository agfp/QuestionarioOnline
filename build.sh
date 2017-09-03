#/bin/bash

BUILD_NAME="HC"

cd frontend
npm run build
cd ..
rsync -av frontend/dist/* backend/public --exclude *.map --exclude index.html

cp frontend/dist/index.html backend/views/questionnaires/$BUILD_NAME.ejs

cd backend/views/questionnaires
sed -i -- 's/{"key":"key","token":"token"}/<%- parameters %>/g' $BUILD_NAME.ejs
cd ../..
