function sortRow(row) {
  var currentScore = parseInt(row.find('.col-md-2:first').text());
  var $higherRows = $('.row').not(row).filter(function() {
    return parseInt($(this).find('.col-md-2:first').text()) <= currentScore;
  });
  if ($higherRows.length > 0) {
    row.insertBefore($higherRows.first());
  }
}

function sortAllRows() {
  var $rows = $(".row").detach(); 

  var sortedRows = $rows.toArray().sort(function(a, b) {
    var scoreA = parseInt($(a).find(".col-md-2:first").text());
    var scoreB = parseInt($(b).find(".col-md-2:first").text());
    return scoreB - scoreA;
  });

  $("#teams").append(sortedRows);
}

function display_scoreboard(scoreboard){
  $("#teams").empty();
  $.each(scoreboard, function(index, team){
    addTeamView(team.id, team.name, team.score, index);
  });
  sortAllRows();
}

function addTeamView(id, name, score, index){
  var team_template = $(`<div class="row" data-id="${id}"></div>`);
  var name_template = $("<div class = col-md-5></div>");
  var score_template = $("<div class = col-md-2></div>");
  var button_template = $("<div class = col-md-2></div>");
  var increase_button = $("<button class = increase-button>+</button>");
  $(increase_button).click(function(){
    increase_score(id);
  });
  name_template.text(name);
  score_template.text(score);
  button_template.append(increase_button);
  team_template.append(name_template);
  team_template.append(score_template);
  team_template.append(button_template);
  $("#teams").append(team_template);
}

function increase_score(id){
  var team_id = {"id": id}
  $.ajax({
    type: "POST",
    url: "increase_score",                
    dataType : "json",
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify(team_id),
    success: function(result){
      var teamRow = $(`.row[data-id="${id}"]`);
      var scoreEl = teamRow.find(".col-md-2:first");
      scoreEl.text(parseInt(scoreEl.text()) + 1);
      sortRow(teamRow);
    },
    error: function(request, status, error){
        console.log("Error");
        console.log(request)
        console.log(status)
        console.log(error)
    }
  });
}

$(document).ready(function(){
  display_scoreboard(scoreboard);
})
