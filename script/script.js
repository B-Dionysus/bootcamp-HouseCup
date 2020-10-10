var _rep;
var highScore=0;
var currentWinner="";
var teamArray=[];
var assetPath="./assets/";
var baseImageWidth=70;

$("document").ready(init);
function init(){
     getScores();
}
function getScores(){
    const corsAnywhere = `https://cors-anywhere.herokuapp.com/`;
    const houseCupAPI = `https://nu-chi-house-cup.herokuapp.com/api/students/`;
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": corsAnywhere+houseCupAPI,
        "method": "GET"
    }             
    $.ajax(settings).done(function (response) {
        displayScores(response);
    });
}


function displayScores(response){
    // The API returns an array of students
    for(student of response){
        var newTeam=true;
        // But we need to make our own array of teams
        for(team of teamArray){
            // If the student is on a team that is in our array
            // then we add their names to the team object
            if(team.teamName===student.teamName){
                newTeam=false;  // This team is already in our array
                team.members.push(student.studetnName);
                team.score+=student.pointsEarned;
                // If this team has the current high score, update our variables
                if(team.score>highScore){
                     highScore=team.score;
                     currentWinner=team.teamName;
                }
            }
        }            
        // If this student is on a team that we don't have in our
        // array yet, then we need to build the team object
        // and then add it to our array, and then add the student data
        if(newTeam){
            var team={};
            team.teamName=student.teamName;
            team.icon=student.teamName+".png";
            team.score=student.pointsEarned;
            team.members=[];
            team.members.push(student.studentName);
            teamArray.push(team);
        }     
    }
    // Now that everyone's points have been added
    // sort the array based on the total score
    teamArray.sort(scoreSort);
    // Now that we have all the data nicely sorted into teams
    // We can display it on the screen!
    buildTeamPyramid();
}
// We want a pyramid, where the top level, with the current winner, is the
// only column in the row. Then the next level has two columns (with two houses)
// and the three, and so on.
function buildTeamPyramid(){
    var level=0;
    var cols=0;
    var pyramid=$("<div>").addClass("container text-center");
    var tier;
    for(team of teamArray){
        var teamIcon=$("<div>").attr("id",team.teamName);
        teamIMG=$("<img>").attr("src",assetPath+team.icon);

        // In addition, we make the current winner 1.75 times larger, and scale the others
        // based on what percentage of points they have compared to the current winner.
        var teamWidth=baseImageWidth+((baseImageWidth*1.75)*(team.score/highScore))+"px";
        teamIMG.css("width",teamWidth);
        teamIcon.append(teamIMG);

        // And of course we print the team's score
        scoreDisplay=$("<span>");
        scoreDisplay.addClass("scoreBG");
        scoreDisplay.append($("<h3>").text(team.score));
        teamIcon.append(scoreDisplay);

        // Now that we've assembled all the data, we have to figure out where
        // to put it. If it's a new tier, then we make a new row and start adding to it
        if(cols>=level){
            cols=0;
            level++;
            tier=$("<div>").addClass("row").attr("data-level",level);
            tier.append($("<div>").addClass("col").append(teamIcon));
            pyramid.append(tier);
        }
        // If not, then we can just keep adding to the tier we have
        else 
            tier.append($("<div>").addClass("col").append(teamIcon));    
        cols++;
    }
    // Then we add all the tiers to the pyramid 
    pyramid.append(tier);
    // And add the pyrmid to the document
    $("body").append(pyramid);

    // The first element in teamArray is the current currentWinner. Let's make a huge
    // version of their icon as a backdrop!
    var winningIcon=assetPath+teamArray[0].icon;
    var backdrop=`<div class="container-fluid" id="backdrop" style="background-image: url('${winningIcon}');"></div>`;
    $("body").append(backdrop);
}


// scoreSort is sent two scores, and returns a positive number
// is the second one is bigger, and a negative number if the
// first one is bigger
function scoreSort(a, b){
    return b.score-a.score;
}