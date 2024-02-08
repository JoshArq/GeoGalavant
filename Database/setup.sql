--Drop tables --
DEALLOCATE ALL;
DROP INDEX IF EXISTS Username;
DROP VIEW IF EXISTS User_Permissions;
DROP TABLE IF EXISTS Role_Permission;
DROP TABLE IF EXISTS User_Role;
DROP TABLE IF EXISTS Permissions;
DROP TABLE IF EXISTS Roles;
DROP TABLE IF EXISTS Users;

-- Generate user table --
CREATE TABLE Users(
	UserID SERIAL Primary Key,
	Username VARCHAR(50) UNIQUE NOT NULL,
	Password VARCHAR(50) NOT NULL,
	FirstName VARCHAR(50) NOT NULL,
	LastName VARCHAR(50) NOT NULL,
	Email VARCHAR(75) NOT NULL,
	Address VARCHAR(100) NOT NULL,
	ZipCode VARCHAR(5) NOT NULL,
	City VARCHAR(40) NOT NULL,
	-- change this to enum later --
	StateProvince VARCHAR(2) NOT NULL
);

-- Creates Index for User table on username --
CREATE INDEX Username ON Users (Username);

-- Populates Users table with some sample data --
INSERT INTO Users (UserID, Username, Password, FirstName, LastName, Email, Address, ZipCode, City, StateProvince) VALUES
	(1, 'aaa', 'aaa', 'Alfred', 'Albertson', 'aaa@gmail.com', '123 Street', '12345', 'Rochester', 'NY'),
	(2, 'bbb', 'bbb', 'Bruce', 'Batman', 'bbb@gmail.com', '321 Street', '12345', 'Rochester', 'NY'),
	(3, 'ccc', 'ccc', 'Candice', 'Campbell', 'ccc@gmail.com', '231 Street', '12345', 'Rochester', 'NY');

-- Generate Role table --
Create Table Roles(
	RoleID SERIAL PRIMARY KEY,
	Title Varchar(25) NOT NULL
);

INSERT INTO Roles (RoleID, Title) VALUES
	(1, 'Administrator'),
	(2, 'User'),
	(3, 'Mechanic');

-- Generate Permissions table --
CREATE TABLE Permissions(
	PermissionID SERIAL PRIMARY KEY,
	Description Varchar(25) NOT NULL
);

--Populates the Permissions table --
INSERT INTO Permissions (PermissionID, Description) VALUES
	(1, 'View Cars'),
	(2, 'Edit Cars'),
	(3, 'View Users'),
	(4, 'Approve Applications'),
	(5, 'Suspend Users');

-- Generate User_Role table --
CREATE TABLE User_Role(
	UserID INT NOT NULL,
	RoleID INT NOT NULL,
	PRIMARY KEY (UserID, RoleID),
	FOREIGN KEY (UserID)
		REFERENCES Users (UserID),
	FOREIGN KEY (RoleID)
		REFERENCES Roles (RoleID)
);

--Populates the User_Role table --
INSERT INTO User_Role (UserID, RoleID) VALUES
	(1,1),
	(2,2),
	(3,3);

-- Generate Role_Permissions table --
CREATE TABLE Role_Permission(
	PermissionID INT NOT NULL,
	RoleID INT NOT NULL,
	PRIMARY KEY (PermissionID, RoleID),
	FOREIGN KEY (PermissionID)
		REFERENCES Permissions (PermissionID),
	FOREIGN KEY (RoleID)
		REFERENCES Roles (RoleID)
);

--Populates the User_Role table --
INSERT INTO Role_Permission (PermissionID, RoleID) VALUES
	(1,1),
	(2,2),
	(3,3);

-- Creates view with a user's permissions
CREATE VIEW User_Permissions AS 
	SELECT u.UserID AS id,
		u.Username as Name,
		r.Title as Title,
		perm.Description AS Description
	FROM Users u
		INNER JOIN User_Role ur ON (u.UserID = ur.UserID)
		INNER JOIN Roles r ON (ur.RoleID = ur.RoleID)
		INNER JOIN Role_Permission rp ON (r.RoleID = rp.RoleID)
		INNER JOIN Permissions perm ON (rp.PermissionID = perm.PermissionID);

-- Creates prepared statement for getting a user's permissions --
PREPARE User_Perms (TEXT) AS
	SELECT Description
	FROM User_Permissions
	WHERE Name = $1
	GROUP BY Description;

