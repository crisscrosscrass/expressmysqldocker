# Express NODEJS MySQL Docker-Compose Appication

A very basic example of Express App that use a Database like MySQL in order to build a CRUD (Create, Read, Update & Delete ) App in a Docker Enviroment

This example was create using the [azjishlay](https://github.com/azjishlay/todo-app)'s Github Project, with a lot of tweaks.

# Prerequisites

- this project has alot of depencies to work well together, in order to start this project make sure you have docker and docker-compose installed

- i decided to use the mysql database for this project because i wanted to use a tool called "adminer" in order to have access to the database at any given time without installing another 3rd party software like SQL Manager or something similiar. Here is a mssql sample

```
   database:
     image: "mcr.microsoft.com/mssql/server:2019-latest"
     container_name: databaseserver
     user: root
     ports:
         - '1433:1433'
     environment:
             SA_PASSWORD: "examplepassword"
             ACCEPT_EULA: "Y"
             MYSQL_ROOT_PASSWORD: "examplepassword"
             MYSQL_DATABASE: "exampledb"
     volumes:
         - appsqlproperties:/dbproperties
         - databasedata:/var/opt/mssql
```

in in case you wanna try it out, but adminer doesn't support export Data for this kind of database right now. Otherwise i suggest that you stick with mysql right now. (in case adminer get an update that support mssql or oracle database i may will update this repo)

- i created this repo also with future usabilty to access the database from another project, just keep in mind that you have to change the login credentials based on the usage! e.g.

_outside docker enviroment_

```
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'examplepassword',
  database: 'exampledb',
  port: 3306
});
```

_inside docker enviroment_

```
const con = mysql.createConnection({
  host: 'database',
  user: 'root',
  password: 'examplepassword',
  database: 'exampledb',
  port: 3306
});
```

# Overview TechStack

## Docker & Docker-Compose

Docker - Container Enviroment (basically to run software in a seperated enviroment without installing them locally)
Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application's services.

## dockerize [jwilder/dockerize](https://github.com/jwilder/dockerize)

dockerize is a utility to simplify running applications in docker containers. In this project i use this awesome tool to prevent the express app to start before the database is ready to use e.g.

```
dockerize -wait tcp://database:3306 -timeout 10s
```

## Adminer (Admin tool to access the database and adjust data inside database)

http://localhost:8080/

```
Login
System: MySQL
Server: database
Username: root
Password: examplepassword
```

## MySQL (Database for this project to store all data)

http://localhost:3306/ (you can't access this Database from the browser, thats why we have adminer)
In the docker-compose file we added a startup.sql

```
CREATE USER 'sample_user'@'%' IDENTIFIED BY 'password';
GRANT ALL ON *.* TO 'sample_user'@'%';
FLUSH PRIVILEGES;
select * from mysql.user;

CREATE DATABASE `todo`;
USE `todo`;
CREATE TABLE `todo`.`todo_list` (
	`id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)) ENGINE = InnoDB;
```

that will create a sample_user that we use in order to access the database and give him permission to write also into the database, in this project we use

## Express NodeJS

http://localhost:8000/

this is the main app where we use our backend in order to call the database and add, modify or delete data from the databae. e.g. once your container has been started, the main app you can open with this url.

In case you wanna add a sample item you can open this url http://localhost:8000/createSample in the browser. (check out the cli console logs)

### RestPoints

#### activate Stream Listener (Listener)

```
curl -H Accept:text/event-stream http://localhost:8000/events
```

#### POST Request (Writer)

post JSON Data to the Server which then will be pushed to the events

```
curl -X POST -H "Content-Type: application/json" -d '{ \"firstName\":\"Harry\",   \"lastName\":\"Potter\",   \"eMail\":\"h.potter@hogwarts.com\",   \"salary\":\"9001\"}' -s http://localhost:8000/fact
```

or

```
curl -X POST -H "Content-Type: application/json" -d '{ "firstName":"Harry",   "lastName":"Potter",  "eMail":"h.potter@hogwarts.com",  "salary":"9001"}' -s http://localhost:8000/fact
```

(depending on your system enviroment settings)

get Request / create sample item

```
curl http://localhost:8000/createSample
```

## EJS

EJS is a simple templating language that lets you generate HTML markup with plain JavaScript. No religiousness about how to organize things. No reinvention of iteration and control-flow. It's just plain JavaScript. This project is really small and for small projects like this EJS is perfect to render some backend items.

# Getting Started

It should be very easy to start up this project by just running the

```
docker-compose up
```

or

```
sudo docker-compose up
```

(depends how your system enviroment has been set, especially docker deamon)

Command. Make sure you are inside the main folder with your cli before entering the command. Once all images has been downloaded and all containers have been started, you should see a message like this:

```
expressnodejsapp    | YYYY/MM/DD 07:39:28 Connected to tcp://database:3306
expressnodejsapp    | start node server
expressnodejsapp    |
expressnodejsapp    | > app@1.0.0 start /
expressnodejsapp    | > node server.js
expressnodejsapp    |
expressnodejsapp    | YYYY/MM/DD-07:39:28 /server.js:110:10
expressnodejsapp    | INFO Starting Server, listening to request on port 8000
```

All you need to do now, is go to http://localhost:8000/ and you should see a simple standard page with same sample usage about EJS.

If you go to http://localhost:8080/ you should see the Adminer Tool (Website where you can access your database inside docker)

```
Login
System: MySQL
Server: database
Username: root
Password: examplepassword
```

the Database has also a new table called "todo_list" which you can fill easily with open this url http://localhost:8000/createSample and you will recieve a message "Item has been saved successfully!". All you have to do afterwards is checking the db with something like:

```
select * from todo_list;
```

If case you want to check how many clients are connected to his website app right now, you can open this website here
http://localhost:8000/status

Another cool thing is you can open a the stream connection by opening this url:
http://localhost:8000/events

you will see an empty array but if you send an event to the stream like

```
curl -X POST -H "Content-Type: application/json" -d '{ \"firstName\":\"Harry\",   \"lastName\":\"Potter\",   \"eMail\":\"h.potter@hogwarts.com\",   \"salary\":\"9001\"}' -s http://localhost:8000/fact
```

or

```
curl -X POST -H "Content-Type: application/json" -d '{ "firstName":"Harry",   "lastName":"Potter",  "eMail":"h.potter@hogwarts.com",  "salary":"9001"}' -s http://localhost:8000/fact
```

(depending on your system enviroment settings)

you will recieve instant info :) (all stream subscribed users will recieve the msg)

# Summary

This project is just an example of using Express-Node-MySQL+EJS all together in a docker enviroment. You can control the enviroment via the browser by opening certain urls like http://localhost:8000/createSample or using the curl command http://localhost:8000/createSample to fill the database and all that kind of stuff.

This app contains also sockets as an example that can be used via CLI or from the browser Console.

You can also use this project as a native js app and just run the database in docker like:

```
sudo docker-compose up database
```

But keep in mind if you want to have access on the database from outside the "docker world" make sure you use "localhost" instead of "database" when calling a database via request :)

# FAQ

## Is the data been stored once i shutdown the docker container?

Yes! I defined docker volumes for the database, as long you have the volumes, all your data will be loaded during startup / restart.

The good thing about adminer is you can also backup your data from time to time and even if you don't have the volumes anymore you can import your backups in order to restore your data into the database with just a few clicks.
