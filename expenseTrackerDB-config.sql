-- Create a DB for our expense tracker project. 
-- Revature project 1. 

CREATE USER expenseTracker
IDENTIFIED BY p4ssw0rd
DEFAULT TABLESPACE users
TEMPORARY TABLESPACE temp
QUOTA 10M ON users;

-- grant connection to this new database
GRANT connect to expenseTracker;
GRANT resource to expenseTracker;
GRANT create session TO expenseTracker;
GRANT create table TO expenseTracker;
GRANT create view TO expenseTracker;

/*
for creating new connections: 

SID is usually ORCL

To check whether the new database was created, we navigate to other users and check if the newly
created database is present. 
*/