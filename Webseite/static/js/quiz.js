var currentQuestionNo = 0;
var points = 0;
var rightAnswerPoints = 10;
var currentQuestion;

var questions = [
  {
    "id":"1",
    "question" : "Was macht man mit einer Programmiersprache?",
    "answers" : {
      "A":"Wandern",
      "B":"Kochen",
      "C":"Programmieren",
      "D":"Zeichnen"
    }, 
    "right":"C"
  },{
    "id":"2",
    "question" : "Wie nennt man einen Fehler in einem Computerprogramm?",
    "answers" : {
      "A":"Bug",
      "B":"Hat",
      "C":"Pen",
      "D":"Code"
    }, 
    "right":"A"
  }
];

function showNextQuestion() {
  if (currentQuestionNo >= questions.length) {
    showEnd();
    currentQuestionNo = 0;
  }
  console.log("Loading Question:" + currentQuestionNo);
  currentQuestion = questions[currentQuestionNo];
  $("#qno").text(currentQuestionNo+1);
  $("#question_text").text(currentQuestion.question);
  $("#answer_a").text(currentQuestion.answers.A);
  $("#answer_b").text(currentQuestion.answers.B);
  $("#answer_c").text(currentQuestion.answers.C);
  $("#answer_d").text(currentQuestion.answers.D); 
  
  $(".answer").removeClass("btn-primary btn-danger btn-success btn-default");
  $(".answer").addClass("btn-default");
}

function getRightAnswer() {
  return currentQuestion.right;
}