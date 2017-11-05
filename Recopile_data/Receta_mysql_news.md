# Start with MySQL

## Install MySQL
apt-get install mysql-server
apt-get install  r-cran-rmysql libmariadbclient-dev

## Connect to MySQL
mysql -u root -p

## Create DB
create database noticias;

## Change DB
use noticias;

## Create tables

### articulo has info about the article and includes sentiment analysis.
CREATE TABLE articulo (
	id_noticia int not null auto_increment,
	fecha varchar(20),
	titulo varchar(200),
	texto_noticia varchar(5000),
	url varchar(200),
	sentiment_value float,
	name_tag_scale float,
	primary key (id_noticia)
);


### tags has info about the tags of each news. It is related to articulo by id_noticia
CREATE TABLE tags (
	id_tag int not null auto_increment,
	id_noticia int,
	visitas varchar(2000),
	name_tag varchar(60),
	primary key (id_tag)
);

## To connect to your local DB
user = root
password = root
host = localhost

