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