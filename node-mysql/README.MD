# Exemplo Nodejs + Express + MySQL

## Executar aplicação com docker compose

```shell
docker compose up
```

## Executar Nodejs + Express

```shell
docker image build -t node-express .
```

## Executar banco de dados

```shell
# criar volume
docker volume create volume-mysql

# executar o banco
docker run -d --rm --name mysql-express -v volume-mysql:/var/lib/mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=senhadoexpress mysql

docker exec -it mysql-express bash

# criar database com dados
mysql -droot -psenhadoexpress

show databases;

create database express_db;
use express_db;

create table produtos (id int NOT NULL AUTO_INCREMENT primary key, name varchar(255) NOT NULL);
show tables;
insert into produtos (name) values ("IPhone 15");
insert into produtos (name) values ("Playstation 5");

select * from produtos;
```
