var $parseAppID = "pIExtoasaOfJ7gcdolMP0ZOPvtyUnIEujWSB5lr0";
var $parseJSKey = "qPUc6tZMOgUWdjSs5iOMTk7k1UoBQKsA2XzTuNy3";

var $fbUserID = "";
var $fbUserName = "";
var $artistBrowseHistoryArr = new Array();

Parse.initialize($parseAppID, $parseJSKey);

var saveArtistName = function saveArtistName($artist) {
	var artistBrowseHistory = Parse.Object.extend("artistBrowseHistory");

	//Instantiate an object of the ListItem class
	var artistBrowseHistory = new artistBrowseHistory();

	//listItem is now the object that we want to save, so we assign the properties that we want on it.
	artistBrowseHistory.set("userID", $fbUserID);
	artistBrowseHistory.set("userName", $fbUserName);
	artistBrowseHistory.set("artistName", $artist);

	//We call the save method, and pass in success and failure callback functions.
	artistBrowseHistory.save(null, {       
		success: function(item) {
			//console.log(item);
			getSearchHistory();
		},
		error: function(gameScore, error) {
			//console.log(gameScore + error);
		}
	});
};

var getSearchHistory = function getSearchHistory() {

	$("#historyLoader").css("display","block");
	$("#noHistory").css("display","none");

	var artistBrowseHistory = Parse.Object.extend("artistBrowseHistory");

	//This time, we use Parse.Query to generate a new query, specifically querying the ListItem table.
	var query = new Parse.Query(artistBrowseHistory);

	//We set constraints on the query.
	query.equalTo('userID', $fbUserID)
	query.limit = 100;
	query.descending('createdAt');

	//We submit the query and pass in callback functions.
	query.find({
		success: function(results) {
			//console.log(results);
			$artistBrowseHistoryArr = []; 
			for (var i = 0; i < results.length; i++) {
				$artistBrowseHistoryArr[i] = results[i].attributes.artistName;
			};
			if($artistBrowseHistoryArr.length > 0) {
				var $searchHistory = "<h4><span class='label label-default'>Search history: </span></h4>";
				for (var i = 0; i < $artistBrowseHistoryArr.length; i++) {
					$searchHistory += "<li><a href='' class='searchHistoryCls' id='" + $artistBrowseHistoryArr[i] + "'>" + $artistBrowseHistoryArr[i] + "</a></li>";
				};
				
				$("#searchHistory").html($searchHistory);
				$("#searchHistory").show();
			} else {
				$("#searchHistory").hide();
				$("#noHistory").css("display","block");
			}
			$("#historyLoader").css("display","none");
		},
		error: function(error) {
			$("#historyLoader").css("display","none");
			//console.log(error);
		}

	});

};