
-- DB Operations for our project 1 "Expense tracker"

-- 1. CREATING TABLES

-- USERS TABLE
CREATE TABLE users (
userId NUMBER,
fname VARCHAR2(50) NOT NULL,
lname VARCHAR2(50) NOT NULL,
email VARCHAR2(50) NOT NULL,
username VARCHAR2(50) NOT NULL,
password VARCHAR2(20) NOT NULL,
roleId NUMBER NOT NULL,

CONSTRAINT pk_users
PRIMARY KEY (userId),

CONSTRAINT fk_users
FOREIGN KEY (roleId)
REFERENCES roles (roleId)
);


-- ROLES TABLE
CREATE TABLE roles (
roleId NUMBER,
roleName VARCHAR2(50),

CONSTRAINT pk_roles
PRIMARY KEY (roleId)
);

-- REIMBURSEMENT TABLES
CREATE TABLE reimbursements (
reimbId NUMBER,
amount NUMBER (30,2),
submittedOn TIMESTAMP,
resolvedOn TIMESTAMP,
description VARCHAR2(250),
RECEIPT BLOB,
author NUMBER,
resolver NUMBER,
statusId NUMBER,
typeId NUMBER,

CONSTRAINT pk_reimb
PRIMARY KEY (reimbId),

CONSTRAINT fk_reimb_users
FOREIGN KEY (author)
REFERENCES users (userId),

CONSTRAINT fk_reimb_userResolver
FOREIGN KEY (resolver)
REFERENCES users (userId),

CONSTRAINT fk_reimb_status
FOREIGN KEY (statusId)
REFERENCES status (statusId),

CONSTRAINT fk_reimb_types
FOREIGN KEY (typeId)
REFERENCES types (typeId)
);

-- REMBURSEMENT STATUS TABLE 
CREATE TABLE status (
statusId NUMBER,
statusName VARCHAR(10),

CONSTRAINT pk_status
PRIMARY KEY (statusId)
);

-- REIMBURSMENT TYPES TABLE
CREATE TABLE types (
typeId NUMBER,
typeName VARCHAR2(10),

CONSTRAINT pk_type
PRIMARY KEY (typeId)
);

-- SEQUENCES AND TRIGGERS TO CREATE AUTO ID ON INSERT

--1. Sequence for users
CREATE SEQUENCE userId_factory
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999999999999999
    CYCLE;
    /  
    -- Trigger - user id
    CREATE OR REPLACE TRIGGER userId_trig
    BEFORE INSERT
    ON users
    FOR EACH ROW
    BEGIN
        SELECT userId_factory.NEXTVAL
        INTO: new.userId
        FROM dual;
    END;
    /
    
-- 2. SEQUENCE FOR roles tables
CREATE SEQUENCE roleId_factory
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999999999999999
    CYCLE;
    / 
    -- Trigger - role id
    CREATE OR REPLACE TRIGGER roleId_trig
    BEFORE INSERT
    ON roles
    FOR EACH ROW
    BEGIN
        SELECT roleId_factory.NEXTVAL
        INTO: new.roleId
        FROM dual;
    END;
    /

-- 3. SEQUENCE FOR reimbursements tables
CREATE SEQUENCE reimbId_factory
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999999999999999
    CYCLE;
    / 
    -- Trigger - reimb id
    CREATE OR REPLACE TRIGGER reimbId_trig
    BEFORE INSERT
    ON reimbursements
    FOR EACH ROW
    BEGIN
        SELECT reimbId_factory.NEXTVAL
        INTO: new.reimbId
        FROM dual;
    END;
    /
    
-- 4. SEQUENCE FOR status tables
CREATE SEQUENCE statusId_factory
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999999999999999
    CYCLE;
    / 
    -- Trigger - status id
    CREATE OR REPLACE TRIGGER statusId_trig
    BEFORE INSERT
    ON status
    FOR EACH ROW
    BEGIN
        SELECT statusId_factory.NEXTVAL
        INTO: new.statusId
        FROM dual;
    END;
    /
    
    -- 5. SEQUENCE FOR types tables
CREATE SEQUENCE typeId_factory
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 999999999999999
    CYCLE;
    / 
    -- Trigger - type id
    CREATE OR REPLACE TRIGGER typeId_trig
    BEFORE INSERT
    ON types
    FOR EACH ROW
    BEGIN
        SELECT typeId_factory.NEXTVAL
        INTO: new.typeId
        FROM dual;
    END;
    /
    
COMMIT;

-- Set the timestamp to default.
ALTER TABLE reimbursements
MODIFY submittedOn DEFAULT LOCALTIMESTAMP;

-- Set pending as default status id
ALTER TABLE reimbursements
MODIFY statusId DEFAULT 1;


-- A PROCEDURE TO INSERT DATA IN REIMBURSEMENT TABLE
CREATE OR REPLACE PROCEDURE insert_reimb (amount IN NUMBER, description IN VARCHAR2, author IN NUMBER, typeId IN NUMBER)
IS  
BEGIN
    INSERT INTO reimbursements(amount, description, author, typeId)
    VALUES(amount, description, author, typeId);   
END;
/

--BEGIN
--insert_reimb(250, 'Went out with friends! Hahah! Who cares!!', 1, 4);
--END;

-- A PROCEDURE TO PROCESS REIMBURSMENT REQUESTS
CREATE OR REPLACE PROCEDURE process_reimb (reimbId IN NUMBER, decision IN VARCHAR2, resolverId IN NUMBER)
IS
BEGIN
    IF
    decision = 'Approved'
    THEN
    UPDATE reimbursements
    SET resolvedOn = LOCALTIMESTAMP, resolver = resolverId, statusId = 2
    WHERE reimbId = reimbId;
    ELSIF
    decision = 'Denied'
    THEN
    UPDATE reimbursements
    SET resolvedOn = LOCALTIMESTAMP, resolver = resolverId, statusId = 3
    WHERE reimbId = reimbId;
    END IF;
END;
/

--BEGIN
--process_reimb(1,'Denied', 1);
--END;

COMMIT;


