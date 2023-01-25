echo "express app wait database server"
dockerize -wait tcp://database:3306 -timeout 10s

echo "start node server"
# node server.js
npm run start