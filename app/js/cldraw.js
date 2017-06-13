$(".drawOptionButtons").hide();
var championsLeague = {
  potentialTeams: [],
  // callback(result){
  //   this.potentialTeams = JSON.parse(result);
  // }
  getAllTeams(){
    return $.ajax({
        url: 'functions.php?selectAllUEFAClubs',
        type: 'GET'
    });
  }
};
var groupStageTeams = [];
function prepareTeamsForDraw(){
  $(".potentialTeams").remove();
  championsLeague.getAllTeams().done(function(result){
    championsLeague.potentialTeams = JSON.parse(result);
    $(".drawOptionButtons").show();
    groupStageTeams = [];
    // choose groupStageTeams out of all potentialTeams until groupStageTeams is filled with 32 teams
    (function (){
      // choose any 32 teams from potentialTeams
      if (groupStageTeams.length === 0 ) {
        (function(){
          while (groupStageTeams.length < 32) {
            for (let i = 0; i < championsLeague.potentialTeams.length; i++) {
              if (Math.random() <= 0.5) {
                let teamSuccessfullySelected = championsLeague.potentialTeams[i];
                let country = teamSuccessfullySelected.club_country;
                let clubsFromSameCountry = groupStageTeams.filter(x => x.club_country == country);
                if (clubsFromSameCountry.length <= 3) {
                  groupStageTeams.push(teamSuccessfullySelected);
                  championsLeague.potentialTeams.splice(championsLeague.potentialTeams.indexOf(teamSuccessfullySelected), 1);
                }
                if (groupStageTeams.length === 32) {
                  return;
                }
              }
            }
          }
        })();
      }
      // sort the chosen clubs by ranking
      groupStageTeams.sort((a,b) => a.club_ranking - b.club_ranking);
      // fill pots from 1 to 4, each consisting of 8 teams
      (function fillPots(){
        for (var i = 0; i <= groupStageTeams.length-1; i++) {
          var club = groupStageTeams[i];
          var image = document.createElement("IMG");
          image.src=`${club.club_logo_url}`;
          $("li.team")[i].prepend(image);
          $("li.team")[i].append( document.createTextNode( club.club_name ) );
        }
      })();
    })();
  });
}

var groupA = {group_name: 'Group A', group_nations: []};
var groupB = {group_name: 'Group B', group_nations: []};
var groupC = {group_name: 'Group C', group_nations: []};
var groupD = {group_name: 'Group D', group_nations: []};
var groupE = {group_name: 'Group E', group_nations: []};
var groupF = {group_name: 'Group F', group_nations: []};
var groupG = {group_name: 'Group G', group_nations: []};
var groupH = {group_name: 'Group H', group_nations: []};
var allGroups = [groupA, groupB, groupC, groupD, groupE, groupF, groupG, groupH];
// draw each next team until pots are empty
$(".drawNext").click(function drawNext(){
  if($(".potsArea li.team").length > 0){
    // get the pot of the next team to be drawn
    var currentPot = $(".potsArea li.team:first").parent().siblings(".pot").text();
    var currentPotNumber = Number(currentPot.match(/\d/));
    // number of teams remaining in this pot
    var numberOfteamsInPot = $(`.pot:contains(${currentPot})`)
    .siblings(".teamsInPot").find("li.team").length;
    // get a random team from the current pot
    var drawnTeam = $(`.pot:contains(${currentPot})`)
    .siblings(".teamsInPot").find("li.team")
    .get(Math.round(Math.random()*(numberOfteamsInPot-1)));
    // then we move team to some group but first find out its nation
    // find out the club's country
    var clubName = drawnTeam.textContent;
    var clubCountry = groupStageTeams.filter(x => x.club_name == clubName)[0].club_country;
    // compare the club's nation with nation arrays of each group
    var groupsAvailableForThisClub = [groupA, groupB, groupC, groupD, groupE, groupF, groupG, groupH];
    // loop through ALL groups to scan each of them for the same nations as the one of the currently selected club
    for (let i = 0; i<allGroups.length; i++){
      // inside each particular possible group, scan for the same nation's presence
      // if there are 4 teams in this group, don't count this group as a possibility
      if (allGroups[i].group_nations.length >= currentPotNumber) {
        groupsAvailableForThisClub.splice(groupsAvailableForThisClub.indexOf(allGroups[i]), 1);
        continue;
      }
      for (let a = 0; a<allGroups[i].group_nations.length; a++) {
        // if the club's country matches a country in this current group that we're looping through, don't count this group as a possibility
        if (clubCountry == allGroups[i].group_nations[a]) {
          groupsAvailableForThisClub.splice(groupsAvailableForThisClub.indexOf(allGroups[i]), 1);
          break;
        }
      }
    }
    if (groupsAvailableForThisClub.length > 0) {
      var finalGroupForThisClub = groupsAvailableForThisClub[Math.round(Math.random()*(groupsAvailableForThisClub.length-1))].group_name;
      // push finalGroupForThisClub into the relevant group's nations array
      for (var c = 0; c < allGroups.length; c++){
        // loop through all groups and find match with finalGroupForThisClub
        if (allGroups[c].group_name == finalGroupForThisClub){
          allGroups[c].group_nations.push(clubCountry);
          break;
        }
      }
      // find group and cell where to move the drawnTeam to
      var possibleCells = $(`.groupName:contains(${finalGroupForThisClub})`)
      .siblings("table").find("td");
      for (let c = 0; c < possibleCells.length; c++) {
        if (possibleCells[c].innerHTML == "") {
          possibleCells[c].append(drawnTeam);
          break;
        }
      }
    } else {
      console.log('no place for this team');
      // groupsAvailableForThisClub = [groupA, groupB, groupC, groupD, groupE, groupF, groupG, groupH];
      // for (let g = 0; g < allGroups.length; g++) {
      //   if (allGroups[g].group_nations.length < currentPotNumber) {
      //     var groupForForcedDraw = allGroups[g].group_name;
      //     break;
      //   }
      // }
      // // push club's nation to the list of nations in the forced group
      // for (let p = 0; p < allGroups.length; p++){
      //   // loop through all groups and find match with finalGroupForThisClub
      //   if (allGroups[p].group_name == groupForForcedDraw) {
      //     allGroups[p].group_nations.push(clubCountry);
      //     break;
      //   }
      // }
      // var possibleCells = $(`.groupName:contains(${groupForForcedDraw})`)
      // .siblings("table").find("td");
      // for (let c = 0; c < possibleCells.length; c++) {
      //   if (possibleCells[c].innerHTML == "") {
      //     possibleCells[c].append(drawnTeam);
      //     break;
      //   }
      // }
    }
    if ($(".potsArea li.team").length == 0) {
      $(".drawNext").hide();
      $(".potsArea").hide();
      $(".groupsArea").after(`<div class="alert alert-info drawCompleted">Draw completed</div>`);
    }
  }
});
