var _rep;
var highScore=0;
var currentWinner="";
var teamArray=[];
var assetPath="./assets/";
var baseImageWidth=70;

$("document").ready(init);
function init(){
    // getScores();
    displayScores(JSON.parse(`[{"id":1,"studentName":"Adrian Mustafa","teamName":"aol","pointsEarned":0},{"id":2,"studentName":"Aida Blinstrubyte","teamName":"aol","pointsEarned":0},{"id":3,"studentName":"Daniel Viramontes","teamName":"aol","pointsEarned":0},{"id":4,"studentName":"Ben Resnicoff","teamName":"aol","pointsEarned":0},{"id":5,"studentName":"Steve Kavuu","teamName":"aol","pointsEarned":0},{"id":6,"studentName":"Jake Wagner","teamName":"aol","pointsEarned":1350},{"id":7,"studentName":"Matt Hiatt","teamName":"napster","pointsEarned":0},{"id":8,"studentName":"Justin Albert","teamName":"napster","pointsEarned":500},{"id":9,"studentName":"Flory Ann Evia","teamName":"napster","pointsEarned":0},{"id":10,"studentName":"Erik Tomlinson","teamName":"napster","pointsEarned":0},{"id":11,"studentName":"Toni Rose Debelen","teamName":"napster","pointsEarned":0},{"id":12,"studentName":"Alex Eesley","teamName":"napster","pointsEarned":0},{"id":13,"studentName":"Zach Smelcer","teamName":"netscape","pointsEarned":0},{"id":14,"studentName":"Kevin Miller","teamName":"netscape","pointsEarned":0},{"id":15,"studentName":"Trey Jahner","teamName":"netscape","pointsEarned":0},{"id":16,"studentName":"Elizabeth Reuter","teamName":"netscape","pointsEarned":0},{"id":17,"studentName":"Aaron Ray","teamName":"netscape","pointsEarned":0},{"id":18,"studentName":"Justin Yocus","teamName":"netscape","pointsEarned":0},{"id":19,"studentName":"Ryan Wills","teamName":"winamp","pointsEarned":0},{"id":20,"studentName":"John Cushing","teamName":"winamp","pointsEarned":0},{"id":21,"studentName":"Katie Reid-Anderson","teamName":"winamp","pointsEarned":0},{"id":22,"studentName":"Michael Chang","teamName":"winamp","pointsEarned":0},{"id":23,"studentName":"Benjamin Dionysus","teamName":"winamp","pointsEarned":1150},{"id":24,"studentName":"Olivia Park","teamName":"winamp","pointsEarned":0},{"id":25,"studentName":"Agnes Chueng","teamName":"xanga","pointsEarned":1000},{"id":26,"studentName":"Max Jeanty","teamName":"xanga","pointsEarned":0},{"id":27,"studentName":"Sarah Barkley","teamName":"xanga","pointsEarned":0},{"id":28,"studentName":"Sam Fullerton","teamName":"xanga","pointsEarned":0},{"id":29,"studentName":"Chris Kalama","teamName":"xanga","pointsEarned":0},{"id":30,"studentName":"Owen Roth","teamName":"xanga","pointsEarned":0}]`))
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
        console.log("Team "+team.teamName+", level:"+level);
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