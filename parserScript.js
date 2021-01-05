/*
	Function which initializes file selector, file reader and content placeholder as global variables
*/
function init() {
	
	window.importedFile = document.getElementById('fileSelector').files[0];
	window.reader = new FileReader();
	window.content;
	window.connectionsFilename = "connections.json";
}
/*
	Puts all elements that are in first array, but are not in second array into third array.
*/
function sortArrays(firstArray, secondArray) {

	var thirdArray = firstArray.filter(function(item) {
		return !secondArray.includes(item); 
	});

	return thirdArray;
}

/*
	Function returns an array of names which are not followers, but are followed
*/
function sortNonFollowers(data) {
	
	return sortArrays(Object.keys(data.following), Object.keys(data.followers));
}

/*
	Function returns an array of names which are not close friends, but are followers
*/
function sortNonClose(data) {
	
	return sortArrays(Object.keys(data.followers), Object.keys(data.close_friends));
}

/*
	Function returns an array of usernames which are not followers, but are close friends
*/
function sortCloseNonFollowers(data) {

	return sortArrays(Object.keys(data.close_friends), Object.keys(data.followers));
}


/*
	Function parses data from the file reader, places data into a string which is used to form html links to the users.
	Depending on the flag used in previous functions, it stores different list of arrays into dataArray which it parses.
*/
function parseData(data, options) {
	/*
		Store data parsed json data into an array depending on the function which called parseData
	*/
	var dataArray;
	if (options == 1) {
		dataArray = Object.keys(data.followers);
	} else if (options == 2) {
		dataArray = Object.keys(data.following);
	} else if (options == 3){
		dataArray = sortNonFollowers(data);
	} else if (options == 4){
		dataArray = Object.keys(data.follow_requests_sent);
	} else if (options == 5){
		dataArray = Object.keys(data.close_friends);
	} else if (options == 6){
		dataArray = sortNonClose(data);
	} else if (options == 7){
		dataArray = sortCloseNonFollowers(data);
	}
	
	/*
		Setting a string template for creating username links.
	*/
	var stringLinkOpen = "<a class=\"usernameLink\"";
	var stringLinkReference = "href=\"https://www.instagram.com/";
	var stringLinkDone = ">";
	var stringLinkClose = "</a>";
	var stringLinkElement = "";
	var finalString = "<h2>List size: " + dataArray.length + "</h2>";
	clearList();
	/*
		Constructing all links as html elements and concatenating them to one string buffer used to construct clickable usernames.
	*/
	for (var i in dataArray) {
		
		stringLinkElement = stringLinkOpen + stringLinkReference + dataArray[i] + "\"" + stringLinkDone + " " + dataArray[i] + stringLinkClose;
		finalString += stringLinkElement;
	}
	
	document.getElementById("linkHolder").innerHTML = finalString;
}

/*
	Function starts reading .json file which was provided by the user and after it finishes reading, it calls parseData to further process data.
*/
function startReading(mode) {
	
	window.importedFile = document.getElementById('fileSelector').files[0];
	if (window.importedFile === undefined)
	{
		alert("Please choose a file to open.");
		return;
	}
	/*
		Check if filename is valid for the mode entered by user.
	*/
	if ((window.importedFile.name != window.connectionsFilename) && (mode < 5 && mode > 0)) {
		alert("Please choose connections.json for this button.");
		return;
	}
	
	window.reader.onload = function() {
		
		window.content = JSON.parse(reader.result);
		parseData(window.content, mode);
		
    };
	window.reader.readAsText(importedFile); 
}


/*
	Checks if the loaded file is connections.json and makes a list of followers
*/
function getFollowers() {
    startReading(1); 
}

/*
	Makes a list of people who are followed
*/
function getFollowing() {

    startReading(2); 
}

/*
	Makes a list of people who are followed and are not followers
*/
function getNonFollowers() {

   startReading(3); 
}

/*
	Makes a list of people who didn't confirm or delete follow request
*/
function getFollowRequests() {

	startReading(4);
}

/*
	Makes a list of people who are close friends
*/
function getCloseFriends() {

	startReading(5);
}

/*
	Makes a list of people who are followers but not close friends
*/
function getNonCloseFollowers() {

	startReading(6);
}

/*
	Makes a list of people who are close friends but not followers
*/
function getCloseNonFollowers(){

	startReading(7);
}

/*
	Clears the html list
*/
function clearList() {
	document.getElementById("linkHolder").innerHTML = "";
}




