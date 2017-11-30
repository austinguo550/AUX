# AUX

## A web application for friends to simultaneously queue spotify songs

## How to run:

	git clone "repo link"
	cd AUX
	npm install
	npm start

## How we are going to develop:

Never push to master.  Branch names should be in the form of: 
	
	dev's initials-change worked on

aka:

	my-fixnavbar

## Actionables:

```
	- 1. Display Songs, make the STYLING LOOK NON SHITTY.  Put login button on top right.
			- Henry & Jeffrey

	- 1. Req to create and req to update playlist
			- WILL
	- 1. Req to start playing playlist
			- WILL
	- 2. create a timer for a front-end fetch req to fetch songs from our db
			- WILL
	- 2. When user creates a room, randomly create a unique "owner ID".  This will be passed into the get Songs function to ensure the only person "getting songs" is the owner of the Room.
		Assume everyone can make rooms for this function ATM.
		 	- AUSTIN
```

## NOTES:
```
Austin - MongoDB setup: 
- mongoose is essentially a wrapper to use Mongo with Node easier
- mongoose models allow us to add stuff to the database through (I think they create a collection for us and add objects to that collection?)
- database in mongo 	= database in mysql
- collection in mongo 	= table in mysql
- document in mongo 	= whatever goes in tables in mysql

References:
https://www.tutorialspoint.com/mongodb/mongodb_overview.htm
https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
https://www.youtube.com/watch?v=9OPP_1eAENg&list=PL4cUxeGkcC9jpvoYriLI0bY8DOgWZfi6u&index=1
```
