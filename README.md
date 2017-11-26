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
ASAP
    - 1. Get MongoDB/Mongoose up and running - write a short how to on how each person can get it running on their computer
      or link youtube video
      		- Will
	- 1. Display Songs, make the styling actually look non shitty.  Put login button on top right.
			- Henry & Jeffrey
	- 1.5. Req to update playlist
			- Austin
	- 1.5.  Req to start playing playlist

Next Steps (they rely on the ASAP shit)
    - 2. Write function to post to DB from songs
    		- Michael
    - 2. set up get request to our DB to fetch songs
    		- Austin/Michael

Next, Next Steps:
	- 3. Implement Youtube API
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
