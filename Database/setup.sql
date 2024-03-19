--Drop tables --
DEALLOCATE ALL;
DROP INDEX IF EXISTS Username;
DROP VIEW IF EXISTS User_Permissions;
DROP TABLE IF EXISTS Ticket;
DROP TABLE IF EXISTS User_Status;
DROP TABLE IF EXISTS TicketStatus;
DROP TABLE IF EXISTS Rental;
DROP TABLE IF EXISTS Card;
DROP TABLE IF EXISTS Application;
DROP TABLE IF EXISTS Customer;
DROP TABLE IF EXISTS Role_Permission;
DROP TABLE IF EXISTS User_Role;
DROP TABLE IF EXISTS Permissions;
DROP TABLE IF EXISTS Roles;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Car;
DROP TABLE IF EXISTS CarStatus;
DROP TABLE IF EXISTS CarTracking;
DROP TABLE IF EXISTS Station;
DROP TABLE IF EXISTS PaymentType;
DROP TABLE IF EXISTS ApplicationStatus;
DROP TABLE IF EXISTS AccountStatus;
DROP TABLE IF EXISTS StateProvince;

CREATE TABLE TicketStatus(
	StatusID SERIAL PRIMARY KEY,
	Name VARCHAR(15) NOT NULL
);

INSERT INTO TicketStatus (StatusID, Name) VALUES (1, 'Open'),
	(2, 'Assigned'),
	(3, 'Resolved');

CREATE TABLE Ticket(
	TicketID SERIAL PRIMARY KEY,
	Name VARCHAR(50),
	Email VARCHAR(50),
	Phone VARCHAR(11),
	Submitted TIMESTAMP,
	Comment TEXT,
	StatusID INT,
	FOREIGN KEY (StatusID)
		REFERENCES TicketStatus(StatusID)
);

-- Creates Index for Ticket table on Submitted and status --
CREATE INDEX Time ON Ticket (StatusID);


INSERT INTO Ticket (TicketID, Name, Email, Phone, Submitted, Comment, StatusID) VALUES (1, 'Adam', 'adam@gmail.com', '12223334444', '2017-01-03 00:00:00', 'Not enough shapes', 1),
	(2, 'Brian', 'brian@gmail.com', '12223334444', '2017-01-03 00:00:00', 'Too many shapes', 2),
	(3, 'Carol', 'carol@gmail.com', '12223334444', '2017-01-03 00:00:00', 'My spoon is too big', 3);

-- Generate StateProvince lookup table --
CREATE TABLE StateProvince(
	StateProvinceID SERIAL PRIMARY KEY,
	StateProvinceName VARCHAR(50)
);

-- Populates StateProvince table with some sample data --
INSERT INTO StateProvince (StateProvinceID, StateProvinceName) VALUES (1, 'New York');

-- Generate AccountStatus lookup table --
CREATE TABLE AccountStatus(
	StatusID SERIAL PRIMARY KEY,
	StatusName VARCHAR(50)
);

-- Populates AccountStatus table with some sample data --
INSERT INTO AccountStatus (StatusID, StatusName) VALUES (1, 'Good');

-- Generate ApplicationStatus lookup table --
CREATE TABLE ApplicationStatus(
	StatusID SERIAL PRIMARY KEY,
	StatusName VARCHAR(50)
);

-- Populates AccountStatus table with some sample data --
INSERT INTO ApplicationStatus (StatusID, StatusName) VALUES (1, 'Created'),
	(2, 'Accepted'),
	(3, 'Denied');

-- Generate PaymentType lookup table --
CREATE TABLE PaymentType(
	PaymentTypeID SERIAL PRIMARY KEY,
	PaymentType VARCHAR(20)
);

-- Populates PaymentType table with some sample data --
INSERT INTO PaymentType (PaymentTypeID, PaymentType) VALUES (1, 'Mastercard');

-- Generate Station table --
CREATE TABLE Station(
	StationID SERIAL PRIMARY KEY,
	StationName VARCHAR(20),
	MinLatitude NUMERIC(8,6),
	MaxLatitude NUMERIC(8,6),
	MinLongitude NUMERIC(8,6),
	MaxLongitude NUMERIC(8,6),
	IsClosed BOOLEAN NOT NULL
);

-- Populates Station table with some sample data --
INSERT INTO Station (StationID, StationName, MinLatitude, MaxLatitude, MinLongitude, MaxLongitude, IsClosed) VALUES (1, 'RIT', 43.0813185, 43.081585, -77.677650, -77.678876, FALSE);

-- Generate CarStatus table --
CREATE TABLE CarStatus(
	StatusID SERIAL PRIMARY KEY,
	Name VARCHAR(20)
);

-- Populates CarStatus lookup table with some sample data --
INSERT INTO CarStatus (StatusID, Name) VALUES (1, 'Available'),
	(2, 'Unavailable'),
	(3, 'Rented'),
	(4, 'Non-operational');

-- Generate Car table --
CREATE TABLE Car(
	CarID SERIAL PRIMARY KEY,
	CarStatusID INT NOT NULL,
	StationID INT NOT NULL,
	FOREIGN KEY (CarStatusID)
		REFERENCES CarStatus (StatusID),
	FOREIGN KEY (StationID)
		REFERENCES Station (StationID)
);

-- Populates Car lookup table with some sample data --
INSERT INTO Car (CarID, CarStatusID, StationID) VALUES (1, 1, 1);

--generate the car tracking table --
CREATE TABLE CarTracking(
	CarID INT,
	Time TIMESTAMP,
	Latitude NUMERIC(8,6),
	Longitude NUMERIC(8,6),
	PRIMARY KEY (CarID, Time),
	FOREIGN KEY (CarID)
		REFERENCES Car(CarID)
);

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
	StateProvinceID INT NOT NULL,
	FOREIGN KEY (StateProvinceID)
		REFERENCES StateProvince (StateProvinceID)
);

-- Creates Index for User table on username --
CREATE INDEX Username ON Users (Username);

-- Populates Users table with some sample data --
INSERT INTO Users (Username, Password, FirstName, LastName, Email, Address, ZipCode, City, StateProvinceID) VALUES ('aaa', 'aaa', 'Alfred', 'Albertson', 'aaa@gmail.com', '123 Street', '12345', 'Rochester', 1),
	('bbb', 'bbb', 'Bruce', 'Batman', 'bbb@gmail.com', '321 Street', '12345', 'Rochester', 1),
	('ccc', 'ccc', 'Candice', 'Campbell', 'ccc@gmail.com', '231 Street', '12345', 'Rochester', 1),
	('ddd', 'ddd', 'Daniel', 'Denkins', 'ddd@gmail.com', '231 Street', '12345', 'Rochester', 1),
	('eee', 'eee', 'Evelyn', 'Escaflone', 'eee@gmail.com', '231 Street', '12345', 'Rochester', 1);


-- Table containing the statuses of various users --
CREATE TABLE User_Status(
	UserStatusID SERIAL PRIMARY KEY,
	UserID INT NOT NULL,
	StatusID INT NOT NULL,
	CurrentStatus BOOLEAN NOT NULL,
	Reason TEXT,
	StatusApply TIMESTAMP,
	StatusChange TIMESTAMP,
	FOREIGN KEY (UserID) 
		REFERENCES Users(UserID),
	FOREIGN KEY (StatusID)
		REFERENCES AccountStatus (StatusID)
);

CREATE INDEX CurrentStatus ON User_Status (UserID, CurrentStatus);

-- Generate Role table --
Create Table Roles(
	RoleID SERIAL PRIMARY KEY,
	Title Varchar(25) NOT NULL
);

INSERT INTO Roles (RoleID, Title) VALUES (1, 'Administrator'),
	(2, 'User'),
	(3, 'Mechanic'),
	(4, 'Customer'),
	(5, 'Customer Service');

-- Generate Permissions table --
CREATE TABLE Permissions(
	PermissionID SERIAL PRIMARY KEY,
	Description Text NOT NULL
);

--Populates the Permissions table --
INSERT INTO Permissions (PermissionID, Description) VALUES (1, 'Manage Cars'),
	(2, 'Car Reports'),
	(3, 'View Users'),
	(4, 'Manage Customer Accounts'),
	(5, 'Manage Customer Account Requests'),
	(6, 'Manage Reservations'),
	(7, 'Customer Reports'),
	(8, 'Reservation Reports'),
	(9, 'Answer Inquiries'),
	(10, 'View Car Availability'),
	(11, 'Reserve Car'),
	(12, 'Manage Employee Accounts'),
	(13, 'Request Customer Account');

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
INSERT INTO User_Role (UserID, RoleID) VALUES (1,1),
	(2,2),
	(3,3)
	(4,4),
	(5,5);

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
INSERT INTO Role_Permission (RoleID, PermissionID) VALUES (1,1),
	(1,2),
	(1,3),
	(1,4),
	(1,5),
	(1,6),
	(1,7),
	(1,8),
	(1,9),
	(1,12),
	(2,13),
	(3,1),
	(3,2),
	(4,10),
	(5,3),
	(5,5),
	(5,6),
	(5,7),
	(5,8),
	(5,9);

-- Creates view with a user's permissions
CREATE VIEW User_Permissions AS SELECT u.UserID AS id,
		u.Username as Name,
		r.Title as Title,
		perm.Description AS Description,
		acc.StatusName
	FROM Users u
		INNER JOIN User_Role ur ON (u.UserID = ur.UserID)
		INNER JOIN Roles r ON (ur.RoleID = ur.RoleID)
		INNER JOIN Role_Permission rp ON (r.RoleID = rp.RoleID)
		INNER JOIN Permissions perm ON (rp.PermissionID = perm.PermissionID)
		INNER JOIN User_Status us ON (u.UserID = us.UserID)
		INNER JOIN AccountStatus acc ON (us.StatusID = acc.StatusID)
	WHERE us.CurrentStatus IS TRUE;

-- Creates prepared statement for getting a user's permissions --
PREPARE User_Perms (TEXT) AS
	SELECT Description
	FROM User_Permissions
	WHERE Name = $1
	GROUP BY Description;

-- Generate Customer table --
CREATE TABLE Customer(
	CustomerID SERIAL Primary Key,
	LicenseNumber VARCHAR(10),
	LicenseExpires DATE,
	StateProvinceID INT NOT NULL,
	UserID INT NOT NULL,
	FOREIGN KEY (UserID)
		REFERENCES Users (UserID)
);

-- Generate Application Table --
CREATE TABLE Application(
	ApplicationID SERIAL Primary Key,
	SubmitDate DATE NOT NULL,
	ApplicationStatusID INT,
	CustomerID INT NOT NULL,
	FOREIGN KEY (CustomerID)
		REFERENCES Customer (CustomerID)
);

-- Generate Card Table --
CREATE TABLE Card(
	CardID SERIAL Primary Key,
	PaymentTypeID INT,
	CardName VARCHAR(100) NOT NULL,
	CardNumber VARCHAR(16) NOT NULL,
	ExpirationDate VARCHAR(5),
	CVV VARCHAR(3) NOT NULL,
	CustomerID INT NOT NULL,
	FOREIGN KEY (PaymentTypeID)
		REFERENCES PaymentType (PaymentTypeID),
	FOREIGN KEY (CustomerID)
		REFERENCES Customer (CustomerID)
);

-- Generate Card Table --
CREATE TABLE Rental(
	RentalID SERIAL Primary Key,
	CustomerID INT NOT NULL,
	CarID INT,
	PickupStationID INT NOT NULL,
	ScheduledPickupTime TIMESTAMP,
	PickupTime TIMESTAMP,
	DropoffStationID INT NOT NULL,
	ScheduledDropoffTime TIMESTAMP,
	DropoffTime TIMESTAMP,
	Rate DECIMAL,
	Fees DECIMAL,
	CardID INT NOT NULL,
	FOREIGN KEY (CustomerID)
		REFERENCES Customer (CustomerID),
	FOREIGN KEY (CarID)
		REFERENCES Car (CarID),
	FOREIGN KEY (PickupStationID)
		REFERENCES Station (StationID),
	FOREIGN KEY (DropoffStationID)
		REFERENCES Station (StationID),
	FOREIGN KEY (CardID)
		REFERENCES Card (CardID)
);
