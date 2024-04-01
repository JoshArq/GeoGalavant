--Drop tables --
DEALLOCATE ALL;
DROP INDEX IF EXISTS Username;
DROP VIEW IF EXISTS User_Permissions;
DROP TABLE IF EXISTS Maintenance;
DROP TABLE IF EXISTS User_Status;
DROP TABLE IF EXISTS Ticket;
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
DROP TABLE IF EXISTS CarTracking;
DROP TABLE IF EXISTS Car CASCADE;
DROP TABLE IF EXISTS CarStatus CASCADE;
DROP TABLE IF EXISTS Station CASCADE;
DROP TABLE IF EXISTS PaymentType;
DROP TABLE IF EXISTS ApplicationStatus;
DROP TABLE IF EXISTS AccountStatus;
DROP TABLE IF EXISTS StateProvince;
DROP TABLE IF EXISTS Fee;

-- CREATE TABLE TicketStatus(
-- 	StatusID SERIAL PRIMARY KEY,
-- 	Name VARCHAR(15) NOT NULL
-- );

-- INSERT INTO TicketStatus (StatusID, Name) VALUES (1, 'Open'),
-- 	(2, 'Assigned'),
-- 	(3, 'Resolved');

-- Generate StateProvince lookup table --
CREATE TABLE StateProvince(
	StateProvinceID INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	StateProvinceName VARCHAR(50)
);

-- Populates StateProvince table with some sample data --
-- US states & DC in ABC order, except for NY --
INSERT INTO StateProvince (StateProvinceName) VALUES ('NY'),
	('AL'),
	('AK'),
	('AZ'),
	('AR'),
	('CA'),
	('CO'),
	('CT'),
	('DE'),
	('DC'),
	('FL'),
	('GA'),
	('HI'),
	('ID'),
	('IL'),
	('IN'),
	('IA'),
	('KS'),
	('KY'),
	('LA'),
	('ME'),
	('MD'),
	('MA'),
	('MI'),
	('MN'),
	('MS'),
	('MO'),
	('MT'),
	('NE'),
	('NV'),
	('NH'),
	('NJ'),
	('NM'),
	('NC'),
	('ND'),
	('OH'),
	('OK'),
	('OR'),
	('PA'),
	('RI'),
	('SC'),
	('SD'),
	('TN'),
	('TX'),
	('UT'),
	('VT'),
	('VA'),
	('WA'),
	('WV'),
	('WI'),
	('WY');




-- Generate AccountStatus lookup table --
CREATE TABLE AccountStatus(
	StatusID INT PRIMARY KEY,
	StatusName VARCHAR(50)
);

-- Populates AccountStatus table with some sample data --
INSERT INTO AccountStatus (StatusID, StatusName) VALUES (1, 'Needs Approval'),
	(2, 'Suspended'),
	(3, 'Active'),
	(4, 'Denied'),
	(5, 'Terminated');

-- -- Generate ApplicationStatus lookup table --
-- CREATE TABLE ApplicationStatus(
-- 	StatusID INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
-- 	StatusName VARCHAR(50)
-- );

-- -- Populates AccountStatus table with some sample data --
-- INSERT INTO ApplicationStatus (StatusID, StatusName) VALUES (1, 'Created'),
-- 	(2, 'Accepted'),
-- 	(3, 'Denied');

-- Generate PaymentType lookup table --
CREATE TABLE PaymentType(
	PaymentTypeID INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	PaymentType VARCHAR(20)
);

-- Populates PaymentType table with some sample data --
INSERT INTO PaymentType (PaymentTypeID, PaymentType) VALUES (1, 'Mastercard'),
(2, 'Visa'),
(3, 'American Express'),
(4, 'Discover');

-- Generate Station table --
CREATE TABLE Station(
	StationID INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	StationName VARCHAR(20),
	Address TEXT,
	MinLatitude NUMERIC(8,6),
	MaxLatitude NUMERIC(8,6),
	MinLongitude NUMERIC(8,6),
	MaxLongitude NUMERIC(8,6),
	IsClosed BOOLEAN NOT NULL
);

-- Populates Station table with some sample data --
INSERT INTO Station (StationName, Address, MinLatitude, MaxLatitude, MinLongitude, MaxLongitude, IsClosed) VALUES ('RIT', '1 Lomb Memorial Dr, Rochester, NY 14623', 43.0813185, 43.081585, -77.677650, -77.678876, FALSE),
('Bryan Street', '9 Bryan St, Rochester, NY 14613', 43.184155, 43.184313, -77.637184, -77.637841,  FALSE),
('Clinton', '291 Upper Falls Blvd, Rochester, NY 14605', 43.169961, 43.170105, -77.610052, -77.610736, FALSE);

-- Generate CarStatus table --
CREATE TABLE CarStatus(
	StatusID INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	Name VARCHAR(20)
);

-- Populates CarStatus lookup table with some sample data --
INSERT INTO CarStatus (StatusID, Name) VALUES (1, 'Available'),
	(2, 'Unavailable'),
	(3, 'Rented'),
	(4, 'Non-operational');

-- Generate Car table --
CREATE TABLE Car(
	CarID INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	CarStatusID INT NOT NULL,
	StationID INT NOT NULL,
	FOREIGN KEY (CarStatusID)
		REFERENCES CarStatus (StatusID),
	FOREIGN KEY (StationID)
		REFERENCES Station (StationID)
);

-- Populates Car lookup table with some sample data --
INSERT INTO Car (CarStatusID, StationID) VALUES (1, 1),
	(1,2),
	(1,3);

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
	UserID INT GENERATED BY DEFAULT AS IDENTITY Primary Key,
	Username VARCHAR(50) UNIQUE NOT NULL,
	Password VARCHAR(50) NOT NULL,
	AccountCreated TIMESTAMP DEFAULT NOW() NOT NULL,
	FirstName VARCHAR(50) NOT NULL,
	LastName VARCHAR(50) NOT NULL,
	Email VARCHAR(75) NOT NULL,
	Address VARCHAR(100) NOT NULL,
	ZipCode VARCHAR(5) NOT NULL,
	City VARCHAR(40) NOT NULL,
	AssociatedCity VARCHAR(40) DEFAULT 'Rochester' NOT NULL,
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
	('eee', 'eee', 'Evelyn', 'Escaflone', 'eee@gmail.com', '231 Street', '12345', 'Rochester', 1),
	('fff', 'fff', 'Fiona', 'Flowers', 'fff@gmail.com', '231 Street', '12345', 'Rochester', 1),
	('ggg', 'ggg', 'Giovanni', 'Gorgonzola', 'ggg@gmail.com', '231 Street', '12345', 'Rochester', 1);


-- Table containing the statuses of various users --
CREATE TABLE User_Status(
	UserStatusID INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	UserID INT NOT NULL,
	StatusID INT NOT NULL,
	CurrentStatus BOOLEAN DEFAULT TRUE NOT NULL,
	ReasonApplied TEXT,
	ReasonRemoved TEXT,
	StatusApply TIMESTAMP DEFAULT NOW(),
	StatusChange TIMESTAMP,
	FOREIGN KEY (UserID) 
		REFERENCES Users(UserID),
	FOREIGN KEY (StatusID)
		REFERENCES AccountStatus (StatusID)
);

CREATE INDEX CurrentStatus ON User_Status (UserID, CurrentStatus);

INSERT INTO User_Status (UserID, StatusID, ReasonApplied) VALUES (1,3,'Created Account'),
	(2,3,'Created Account'),
	(3,3,'Created Account'),
	(4,3,'Created Account'),
	(5,3,'Created Account'),
	(6, 3, 'Created Account'),
	(7,3,'Created Account');

-- Generate Role table --
Create Table Roles(
	RoleID INT PRIMARY KEY,
	Title Varchar(25) NOT NULL
);


INSERT INTO Roles (RoleID, Title) VALUES (1, 'System Administrator'),
	(2, 'Business Administrator'),
	(3, 'Manager'),
	(4, 'Mechanic'),
	(5, 'Customer Service'),
	(6, 'Customer'),
	(7, 'User');


-- Generate Permissions table --
CREATE TABLE Permissions(
	PermissionID INT PRIMARY KEY,
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
	(3,3),
	(4,4),
	(5,5),
	(6,6),
	(7,7);

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
	(7,13),
	(6,10),
	(6,11),
	(5,3),
	(5,4),
	(5,5),
	(5,6),
	(5,7),
	(5,8),
	(5,9),
	(4,1),
	(4,2),
	(3,1),
	(3,2),
	(3,3),
	(3,4),
	(3,5),
	(3,6),
	(3,7),
	(3,8),
	(3,9),
	(1,2),
	(1,3),
	(1,4),
	(1,5),
	(1,6),
	(1,7),
	(1,8),
	(1,9),
	(1,12);


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
	CustomerID INT GENERATED BY DEFAULT AS IDENTITY Primary Key,
	LicenseNumber VARCHAR(10),
	LicenseExpires DATE,
	StateProvinceID INT NOT NULL,
<<<<<<< HEAD
	StripeID VARCHAR (40),
=======
	HasAppliedBefore BOOLEAN NOT NULL,
	HasAgreedToTerms BOOLEAN NOT NULL,
>>>>>>> main
	UserID INT NOT NULL,
	FOREIGN KEY (UserID)
		REFERENCES Users (UserID),
	FOREIGN KEY (StateProvinceID)
		REFERENCES StateProvince (StateProvinceID)
);

INSERT INTO Customer (LicenseNumber, LicenseExpires, StateProvinceID, UserID, HasAppliedBefore, HasAgreedToTerms) VALUES ('2222222222', '2026-04-10', 1, 6, FALSE, TRUE),
('33333333', '2028-11-27', 1, 7, FALSE, TRUE);

CREATE TABLE Ticket(
	TicketID INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	Name VARCHAR(50) NOT NULL,
	Email VARCHAR(50) NOT NULL,
	Phone VARCHAR(11) NOT NULL,
	Submitted TIMESTAMP DEFAULT NOW() NOT NULL,
	Comment TEXT NOT NULL,
	-- StatusID INT,
	IsOpen BOOLEAN DEFAULT TRUE NOT NULL,
	ClosedBy INT,
	FOREIGN KEY (ClosedBy)
		REFERENCES Users (UserID)
	-- FOREIGN KEY (StatusID)
	-- 	REFERENCES TicketStatus(StatusID)
);

-- Creates Index for Ticket table on Submitted and status --
CREATE INDEX Time ON Ticket (Submitted);

INSERT INTO Ticket (Name, Email, Phone, Comment) VALUES ('Adam', 'adam@gmail.com', '12223334444', 'Not enough shapes'),
	('Brian', 'brian@gmail.com', '12223334444', 'Too many shapes'),
	('Carol', 'carol@gmail.com', '12223334444', 'My spoon is too big');


-- -- Generate Application Table --
-- CREATE TABLE Application(
-- 	ApplicationID INT GENERATED BY DEFAULT AS IDENTITY Primary Key,
-- 	SubmitDate DATE NOT NULL,
-- 	ApplicationStatusID INT,
-- 	CustomerID INT NOT NULL,
-- 	FOREIGN KEY (CustomerID)
-- 		REFERENCES Customer (CustomerID)
-- );

-- Generate Card Table --
CREATE TABLE Card(
	CardID INT GENERATED BY DEFAULT AS IDENTITY Primary Key,
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

INSERT INTO Card (PaymentTypeID, CardName, CardNumber, ExpirationDate, CVV, CustomerID) VALUES (1, 'Alfred Albertson', '5197362776927374', '09/25', '109', 1);

-- Generate rental Table --
CREATE TABLE Rental(
	RentalID INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
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
	ConfirmationNumber VARCHAR(10) NOT NULL,
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

--generate table to track Maintenance of gyrocars --
CREATE TABLE Maintenance(
	MaintenanceID INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	MaintenanceStart TIMESTAMP NOT NULL,
	HasDamage BOOLEAN NOT NULL,
	ServicePerformed TEXT NOT NULL,
	MaintenanceLocation INT NOT NULL,
	Car INT NOT NULL,
	FOREIGN KEY (MaintenanceLocation)
		REFERENCES Station (StationID),
	FOREIGN KEY (Car)
		REFERENCES Car (CarID)
);


--generate table to track variable fees --
CREATE TABLE Fee(
	FeeID INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	City VARCHAR(50) NOT NULL,
	HourlyRate DECIMAL NOT NULL,
	DailyMaximum DECIMAL NOT NULL
);

INSERT INTO Fee (City, HourlyRate, DailyMaximum) VALUES ('Rochester', 21.99, 120)