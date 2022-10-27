CREATE DATABASE IF NOT EXISTS db_erp;

USE db_erp;

CREATE TABLE IF NOT EXISTS tb_entity (
  id int(11) NOT NULL,
  name_company varchar(100) DEFAULT '',
  nick_trade varchar(100) DEFAULT '',
  aniversary date DEFAULT NULL,
  createdAt datetime NOT NULL,
  updatedAt datetime NOT NULL,
  tb_linebusiness_id int(11) DEFAULT NULL,
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

CREATE TABLE tb_institution (
  id int(11) NOT NULL,
  active char(1) DEFAULT NULL,
  createdAt datetime DEFAULT NULL,
  updatedAt datetime DEFAULT NULL,
  PRIMARY KEY (id)
) ;

CREATE TABLE tb_institution_has_user (
  tb_institution_id int(11) NOT NULL,
  tb_user_id int(11) NOT NULL,
  kind varchar(20) DEFAULT NULL,
  active char(1) DEFAULT NULL,
  createdAt datetime DEFAULT NULL,
  updatedAt datetime DEFAULT NULL,
  PRIMARY KEY (tb_user_id,tb_institution_id),
  KEY tb_institution_id (tb_institution_id),
  KEY updatedAt (updatedAt),
  CONSTRAINT tb_institution_has_user_ibfk_1 FOREIGN KEY (tb_user_id) REFERENCES tb_user (id),
  CONSTRAINT tb_institution_has_user_ibfk_2 FOREIGN KEY (tb_institution_id) REFERENCES tb_institution (id)
);

CREATE TABLE tb_company (
  id int(11) NOT NULL,
  cnpj char(14) NOT NULL DEFAULT '0',
  ie varchar(45) DEFAULT NULL,
  im varchar(45) DEFAULT NULL,
  iest varchar(45) DEFAULT NULL,
  dt_foundation date DEFAULT NULL,
  crt char(1) DEFAULT NULL,
  crt_modal char(1) DEFAULT NULL,
  ind_ie_destinatario varchar(1) DEFAULT NULL,
  iss_ind_exig char(2) DEFAULT NULL,
  iss_retencao char(1) DEFAULT NULL,
  iss_inc_fiscal char(1) DEFAULT NULL,
  iss_process_number varchar(50) DEFAULT NULL,
  send_xml_nfe_only char(1) DEFAULT NULL,
  createdAt datetime NOT NULL,
  updatedAt datetime NOT NULL  
) ;

CREATE TABLE tb_person (
  id int(11) NOT NULL,
  cpf char(11) NOT NULL,
  rg char(20) DEFAULT NULL,
  rg_dt_emission date DEFAULT NULL,
  rg_organ_issuer varchar(45) DEFAULT NULL,
  rg_state_issuer int(11) DEFAULT NULL,
  birthday date DEFAULT NULL,
  tb_profession_id int(11) DEFAULT NULL,
  createdAt datetime DEFAULT NULL,
  updatedAt datetime DEFAULT NULL
) ;

CREATE TABLE tb_person (
  id int(11) NOT NULL,
  cpf char(11) NOT NULL,
  rg char(20) DEFAULT NULL,
  rg_dt_emission date DEFAULT NULL,
  rg_organ_issuer varchar(45) DEFAULT NULL,
  rg_state_issuer int(11) DEFAULT NULL,
  birthday date DEFAULT NULL,
  tb_profession_id int(11) DEFAULT NULL,
  createdAt datetime DEFAULT NULL,
  updatedAt datetime DEFAULT NULL
);

CREATE TABLE tb_country (
  id int(11) NOT NULL,
  name varchar(100) DEFAULT NULL,
  createdAt datetime DEFAULT NULL,
  updatedAt datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE tb_country   ADD PRIMARY KEY (id);
COMMIT;

CREATE TABLE tb_state (
  id int(11) NOT NULL,
  tb_country_id int(11) NOT NULL,
  abbreviation varchar(2) DEFAULT NULL,
  name varchar(100) DEFAULT NULL,
  createdAt datetime DEFAULT NULL,
  updatedAt datetime DEFAULT NULL
);

ALTER TABLE tb_state
  ADD PRIMARY KEY (id),
  ADD KEY fk_state_to_country (tb_country_id);

ALTER TABLE tb_state
  ADD CONSTRAINT fk_state_to_country FOREIGN KEY (tb_country_id) REFERENCES tb_country (id);
COMMIT;

CREATE TABLE tb_city (
  id int(11) NOT NULL,
  tb_state_id int(11) NOT NULL,
  ibge varchar(20) DEFAULT NULL,
  name varchar(100) DEFAULT NULL,
  aliq_iss decimal(10,2) NOT NULL DEFAULT '0.00',
  population int(11) DEFAULT '0',
  density decimal(10,2) DEFAULT '0.00',
  area decimal(10,2) DEFAULT '0.00',
  createdAt datetime DEFAULT NULL,
  updatedAt datetime DEFAULT NULL
);

ALTER TABLE tb_city
  ADD PRIMARY KEY (id),
  ADD KEY fk_city_to_state (tb_state_id);
ALTER TABLE tb_city
  ADD CONSTRAINT fk_city_to_state FOREIGN KEY (tb_state_id) REFERENCES tb_state (id);
COMMIT;


CREATE TABLE tb_address (
  id int(11) NOT NULL,
  street varchar(100) NOT NULL DEFAULT 'não informado',
  nmbr varchar(10) DEFAULT 'sn',
  complement varchar(100) DEFAULT NULL,
  neighborhood varchar(100) DEFAULT NULL,
  region varchar(100) DEFAULT NULL,
  kind varchar(100) NOT NULL DEFAULT '',
  zip_code varchar(15) DEFAULT NULL,
  tb_country_id int(11) NOT NULL,
  tb_state_id int(11) NOT NULL,
  tb_city_id int(11) NOT NULL,
  main char(1) NOT NULL DEFAULT 'Y',
  longitude varchar(20) DEFAULT NULL,
  latitude varchar(20) DEFAULT NULL,
  createdAt datetime NOT NULL,
  updatedAt datetime NOT NULL
);
ALTER TABLE tb_address
  ADD PRIMARY KEY (id,kind),
  ADD KEY fk_country_to_address (tb_country_id),
  ADD KEY fk_state_to_address (tb_state_id),
  ADD KEY fk_city_to_address (tb_city_id);
ALTER TABLE tb_address
  ADD CONSTRAINT fk_city_to_address FOREIGN KEY (tb_city_id) REFERENCES tb_city (id),
  ADD CONSTRAINT fk_country_to_address FOREIGN KEY (tb_country_id) REFERENCES tb_country (id),
  ADD CONSTRAINT fk_state_to_address FOREIGN KEY (tb_state_id) REFERENCES tb_state (id);
COMMIT;

CREATE TABLE tb_institution (
  id int(11) NOT NULL,
  active char(1) DEFAULT NULL,
  createdAt datetime DEFAULT NULL,
  updatedAt datetime DEFAULT NULL
);
ALTER TABLE tb_institution
  ADD PRIMARY KEY (id);
COMMIT;
CREATE TABLE tb_phone (
  id int(11) NOT NULL DEFAULT '0',
  kind varchar(20) NOT NULL,
  contact varchar(100) DEFAULT NULL,
  number varchar(20) DEFAULT NULL,
  address_kind varchar(100) DEFAULT '',
  createdAt datetime DEFAULT NULL,
  updatedAt datetime DEFAULT NULL
) ;
ALTER TABLE tb_phone
  ADD PRIMARY KEY (id,kind),
  ADD KEY id (id,kind);
COMMIT;
CREATE TABLE tb_mailing_group (
  id int(11) NOT NULL,
  description varchar(100) DEFAULT NULL,
  createdAt datetime NOT NULL,
  updatedAt datetime NOT NULL,
  PRIMARY KEY (id)
);
create TABLE tb_entity_has_mailing (
  tb_entity_id int(11) NOT NULL,
  tb_mailing_id int(11) NOT NULL,
  tb_mailing_group_id int(11) NOT NULL,
  createdAt datetime NOT NULL,
  updatedAt datetime NOT NULL,
  PRIMARY KEY (tb_entity_id,tb_mailing_id,tb_mailing_group_id),
  KEY tb_mailing_id (tb_mailing_id),
  KEY tb_mailing_group_id (tb_mailing_group_id)
);
CREATE TABLE tb_stock_list (
  id int(11) NOT NULL,
  tb_institution_id int(11) NOT NULL,  
  description varchar(45) DEFAULT NULL,
  main char(1) DEFAULT 'N',
  active char(1) DEFAULT 'S',
  createdAt datetime DEFAULT NULL,
  updatedAt datetime DEFAULT NULL,  
  PRIMARY KEY (id,tb_institution_id)
)
