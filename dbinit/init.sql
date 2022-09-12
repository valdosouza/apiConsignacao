CREATE DATABASE IF NOT EXISTS db_erp;

USE db_erp;

CREATE TABLE IF NOT EXISTS tb_entity (
  id int(11) NOT NULL,
  name_company varchar(100) DEFAULT '',
  nick_trade varchar(100) DEFAULT '',
  aniversary date DEFAULT NULL,
  created_at datetime NOT NULL,
  updated_at datetime NOT NULL,
  tb_line_business_id int(11) DEFAULT NULL,
  note blob,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tb_mailing (
  id int(11) NOT NULL,
  email varchar(100) NOT NULL,
  createdAt datetime NOT NULL,
  updatedAt datetime NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
);

CREATE TABLE tb_user (
  id INT(11) NOT NULL,
  password varchar(100) DEFAULT NULL,
  kind varchar(20) NOT NULL DEFAULT 'sistema',
  salt varchar(255) DEFAULT NULL,
  tb_device_id int(11) NOT NULL DEFAULT '0',
  active char(1) NOT NULL DEFAULT 'S',
  activation_key varchar(255) DEFAULT NULL,
  createdAt datetime DEFAULT NULL,
  updatedAt datetime DEFAULT NULL,
  PRIMARY KEY (id,kind)
);
