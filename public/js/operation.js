/* Create a cache object */
var cache = new LastFMCache();

/* Create a LastFM object, please use your own key for real world usage */
var lastfm = new LastFM({
	apiKey    : '1cf7a83ad1d07c57597963c41f1669a6',
	apiSecret : 'f971773f8cb6112b475574dcb4553139',
	cache     : cache
});

$(document).ready(function(){
	checkLoginState();
	$("#artist").focus();
	//$("#historyLoader").css("display","block");
	//getCurrentUserInfo();
});

$("#artistSearchForm").submit(function(){
	var $artist = $("#artist").val();
	if($artist == "") {
		$("#warnMsg").html("<strong>Warning!</strong> Please enter artist name.");
		$("#warnMsg").show();
		return;
	}
	$("#noHistory").css("display","none");
	$("#loader").css("display","block");
	/* Load some artist info. */
	lastfm.artist.getInfo({artist: $artist}, {success: function(data){
		$("#warnMsg").hide();
		$("#errMsg").hide();
		$("#loader").css("display","none");
		//console.log(data);
		// save artist name into parse class (start)
		saveArtistName($artist);
		// save artist name into parse class (end)			
			if(typeof(data.artist.mbid)!="undefined") {
				var $mbid = data.artist.mbid;
			}
			
			if(typeof(data.artist.name)!="undefined") {
				var $name = data.artist.name;
			}
			
			if(typeof(data.artist.ontour)!="undefined") {
				var $ontour = data.artist.ontour;
			}
			
			if(typeof(data.artist.streamable)!="undefined") {
				var $streamable = data.artist.streamable;
			}
			
			if(typeof(data.artist.url)!="undefined") {
				var $artistURL = data.artist.url;
			}
			
			// brandmembers (start)
			if(typeof(data.artist.bandmembers)!="undefined") {
				var $bandMembers = data.artist.bandmembers.member;
				var $bandMembersTB = "";
				for (var i = 0; i < $bandMembers.length; i++) {
					var $bandMembersYearFrom = $bandMembers[i].yearfrom;
					var $bandMembersYearTo = $bandMembers[i].yearto;
					if(typeof($bandMembersYearFrom) == "undefined") {
						$bandMembersYearFrom = "-"
					}
					if(typeof($bandMembersYearTo) == "undefined") {
						$bandMembersYearTo = "-"
					}
					$bandMembersTB += "<tr>";
					$bandMembersTB += "<td>" + (i+1) + "</td>";					
					$bandMembersTB += "<td>" + $bandMembers[i].name + "</td>";
					$bandMembersTB += "<td>" + $bandMembersYearFrom + "</td>";
					$bandMembersTB += "<td>" + $bandMembersYearTo + "</td>";
					$bandMembersTB += "</tr>";
				};
				$("#bandMembersTB").html($bandMembersTB);
				$("#bandMembersPanel").show();
			} else {
				$("#bandMembersPanel").hide();
			}
			// brandmembers (end)

			//bio (start)
			if(typeof(data.artist.bio)!="undefined") {
				var $summaryBio = data.artist.bio.summary;
				$summaryBio = $summaryBio.trim();
				var $publishedBio = data.artist.bio.published;
				var $yearFormedBio = data.artist.bio.yearformed;
				if(typeof(data.artist.bio.formationlist)!="undefined") {
					var $yearFormationFrom = data.artist.bio.formationlist.formation.yearfrom;
					var $yearFormationTo = data.artist.bio.formationlist.formation.yearto;
				}
				if(typeof(data.artist.bio.links)!="undefined") {
					var obj = data.artist.bio.links.link;
					$wikiLinkText = obj[Object.keys(obj)[0]];
					var $wikiLinkHref = data.artist.bio.links.link.href;
					var $wikiLinkRel = data.artist.bio.links.link.rel;
				}
				var $placeFromBio = data.artist.bio.placeformed;
			}
			//bio (end)

			//images (start)
			if(typeof(data.artist.image)!="undefined") {
				var obj = data.artist.image[0];
				$smlImageLink = obj[Object.keys(obj)[0]];
				var obj = data.artist.image[2];
				$imageLink = obj[Object.keys(obj)[0]];
			}
			//images (end)

			// Similar artists (start)
			if(typeof(data.artist.similar.artist)!="undefined") {
				var $similarArtist = "<h4><span class='label label-default'>Similar Artist: </span></h4>";
				for (var i = 0; i < data.artist.similar.artist.length; i++) {
					var obj = data.artist.similar.artist[i].image[1];
					$similarArtistImg = obj[Object.keys(obj)[0]];
					var $similarArtistName = data.artist.similar.artist[i].name;
					var $similarArtistURL = data.artist.similar.artist[i].url;
					$similarArtist += "<div class='col-xs-6 col-md-1'>";
					$similarArtist += "<a href='" + $similarArtistURL + "' class='thumbnail similarArtistCls' target='_blank' id='"+ $similarArtistName + "'>";
					$similarArtist += "<img src='" + $similarArtistImg + "'  /> "+ $similarArtistName;
					$similarArtist += "</a>";
					$similarArtist += "</div>";
				};
				$("#similarArtist").html($similarArtist);
				$("#similarArtist").show();
			} else {
				$("#similarArtist").hide();
			}
			// Similar artists (end)

			//stats (start)
			if(typeof(data.artist.stats)!="undefined") {
				var $listenersStats = data.artist.stats.listeners;
				$listenersStats = $listenersStats.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				var $playcountStats = data.artist.stats.playcount;
				$playcountStats = $playcountStats.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}
			//stat (end)

			//tag (start)
			if(typeof(data.artist.tags.tag)!="undefined") {
				var $tag = "<h4><span class='label label-default'>Tags: </span></h4>";
				for (var i = 0; i < data.artist.tags.tag.length; i++) {
					var $tagName = data.artist.tags.tag[i].name;
					var $tagURL = data.artist.tags.tag[i].url;
					$tag += "<li><a href='" + $tagURL + "'>" + $tagName + "</a></li> ";
				};
				if(typeof(data.artist.tags.tag.length)=="undefined") {
					var $tagName = data.artist.tags.tag.name;
					var $tagURL = data.artist.tags.tag.url;
					$tag += "<li><a href='" + $tagURL + "'>" + $tagName + "</a></li> ";
				}
				$("#tag").html($tag);
				$("#tag").show();
			} else {
				$("#tag").hide();
			}
			//tag (end)

			//jumbo Tron (start)
			var $jumboTronInfo = "<h1><a href=" + $artistURL + "><img src='" + $imageLink + "' />" + $name + "</a></h1>";
			$jumboTronInfo += "<p><small>" + $playcountStats + " plays ("+ $listenersStats + " listeners)</small></p>";						
			if(typeof($placeFromBio) !="undefined") {
				$jumboTronInfo += "<p>Place from: <small>" + $placeFromBio + "</small></p>";			
			}
			$jumboTronInfo += "<p>" + $summaryBio + "</p>";			
			$("#artistJumboTron").html($jumboTronInfo);
			$("#artistJumboTron").show();
			//jumbo Tron (end)


			lastfm.artist.getTopTracks({artist: $artist, limit: 12}, {success: function(data){
                			//console.log(data);
                			if(typeof(data.toptracks.track)!="undefined") {
					var $topTrack = "<h4><span class='label label-default'>Top tracks: </span></h4>";
					for (var i = 0; i < data.toptracks.track.length; i++) {
						if(typeof(data.toptracks.track[i].image)!="undefined") {
							var obj = data.toptracks.track[i].image[1];
							$topTrackImg = obj[Object.keys(obj)[0]];
						} else {
							$topTrackImg = $smlImageLink;
						}
						var $topTrackName = data.toptracks.track[i].name;
						var $topTrackURL = data.toptracks.track[i].url;
						var $topTrackPlayCount = data.toptracks.track[i].playcount;
						$topTrackPlayCount = $topTrackPlayCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
						var $topTrackListeners = data.toptracks.track[i].listeners;
						$topTrackListeners = $topTrackListeners.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
						var $topTrackDuration = data.toptracks.track[i].duration;
						var $min = Math.floor($topTrackDuration / 60);
						var $sec = $topTrackDuration - $min * 60;
						$topTrackDuration = $min + ":" + $sec;
						$topTrack += "<div class='col-xs-6 col-md-2'>";
						$topTrack += "<div class='thumbnail'>";						
						$topTrack += "<a href='" + $topTrackURL + "' class='thumbnail' title='"+$topTrackName+"'>";
						if($topTrackName.length>20) {
							var $topTrackNameTrunc = $topTrackName.substring(0, 17)+"...";
							$topTrack += "<img src='" + $topTrackImg + "'  /> "+ $topTrackNameTrunc;
						} else {
							$topTrack += "<img src='" + $topTrackImg + "'  /> "+ $topTrackName;
						}
						$topTrack += "</a>";
						$topTrack += "<p>Play count: " + $topTrackPlayCount + "</p>";
						$topTrack += "<p>Listeners: " + $topTrackListeners + "</p>";
						$topTrack += "<p>Duration: " + $topTrackDuration + "</p>";
						$topTrack += "</div>";
						$topTrack += "</div>";
					};
					$("#topTracks").html($topTrack);
					$("#topTracks").show();
				} else {
					$("#topTracks").hide();
				}

            		}});

		}, error: function(code, message){
			$("#loader").hide();
			$("#errMsg").html("<strong>Oh snap!</strong> " + message + ". Please re-enter artist name.");
			$("#errMsg").show();
		}
	});
});	

$(document).on("click", ".similarArtistCls, .searchHistoryCls", function(e){
	e.preventDefault();
	var $similarArtistID = e.target.id;
	if($similarArtistID=="") {
		$similarArtistID = $(e.target).parent().attr('id');
	}
	$("#noHistory").css("display","none");
	$("#artist").val($similarArtistID);
	$("#artistSearchForm").trigger("submit");
	$("* , html,body").scrollTop(0);
});