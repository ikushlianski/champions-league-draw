'use strict';

// initialize the app
var championsLeague = {
  potentialTeams: [],
  // callback(result){
  //   this.potentialTeams = JSON.parse(result);
  // }
  getAllTeams: function getAllTeams() {
    return $.ajax({
      url: 'functions.php?selectAllUEFAClubs',
      type: 'GET'
    });
  }
};
championsLeague.getAllTeams().done(function (result) {
  championsLeague.potentialTeams = JSON.parse(result);
});
var groupStageTeams = [];
// choose groupStageTeams out of all potentialTeams until groupStageTeams is filled with 32 teams
function prepareTeamsForDraw() {
  // choose any 32 teams
  if (groupStageTeams.length === 0) {
    (function () {
      while (groupStageTeams.length < 32) {
        for (i = 0; i <= championsLeague.potentialTeams.length - 1; i++) {
          if (Math.random() <= 0.95) {
            var teamSuccessfullySelected = championsLeague.potentialTeams[i];
            groupStageTeams.push(teamSuccessfullySelected);
            championsLeague.potentialTeams.splice(championsLeague.potentialTeams.indexOf(teamSuccessfullySelected), 1);
            if (groupStageTeams.length === 32) {
              return;
            }
          }
        }
      }
    })();
  }
  // sort the chosen clubs by ranking
  groupStageTeams.sort(function (a, b) {
    return a.club_ranking - b.club_ranking;
  });
  // fill pots from 1 to 4, each consisting of 8 teams
  (function fillPots() {
    for (i = 0; i <= groupStageTeams.length - 1; i++) {
      var club = groupStageTeams[i];
      var image = document.createElement("IMG");
      image.src = '' + club.club_logo_url;
      $("li.team")[i].append(image);
      $("li.team")[i].append(document.createTextNode(club.club_name));
    }
  })();
}

$(".drawNext").click(function drawNext() {
  if ($("li.team").length > 0) {
    // get the pot of the next team to be drawn
    var currentPot = $("li.team:first").parent().siblings(".pot").text();
    // number of teams remaining in this pot
    var numberOfteamsInPot = $('.pot:contains(' + currentPot + ')').siblings(".teamsInPot").find("li.team").length;
    // get a random team from the current pot
    var drawnTeam = $('.pot:contains(' + currentPot + ')').siblings(".teamsInPot").find("li.team").get(Math.round(Math.random() * (numberOfteamsInPot - 1))).innerHTML;
  }
});