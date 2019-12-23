(function() {
  const questions = [
    {
      question: "Was ist NICHT Bestandteil eines Baums?",
      answers: {
        a: "Wurzel",
        b: "Blatt",
        c: "Stamm"
      },
      correctAnswer: "c"
    },
    /*{
      question: "Welche Art maschinellen Lernens kann durch Decision Trees unterstützt werden?",
      answers: {
        a: "überwachtes Lernen",
        b: "unüberwachtes Lernen",
        c: "bestärkendes Lernen",
      },
      correctAnswer: "a"
    },*/
    {
      question: "Welche Aussage zum besten Split stimmt?",
      answers: {
        a: "Der beste Split sollte möglichst gut zwischen den Kategorien trennen.",
        b: "Der beste Split führt zum Baum mit der höchsten Genauigkeit.",
      },
      correctAnswer: "a"
    },
    {
      question: "Welche Aussage ist korrekt?",
      answers: {
        a: "Die zu erwartenden Konsequenzen bei bestimmten Merkmalskombinationen stehen in den Blättern des Baums.",
        b: "Decision Trees werden dem Algorithmus vom Nutzer bereitgestellt.",
        c: "Zu einem Datenset gibt es nur einen Decision Tree.",
      },
      correctAnswer: "a"
    },
    {
      question1: "Eine Familie möchte entscheiden ob sie zum Skifahren aufbricht. Dabei stehen ihr die folgenden Angaben zur Verfügung.<br /> Welcher Entscheidungsbaum bildet die möglichen Überlegungen der Familie korrekt ab?  <br /> <center><table border width=50% height=60% style='font-size: 0.6em;'><tr><th>Wochenende</th><th>Entfernung > 100km</th><th>Sonnenschein</th><th>Label</th></tr><tr><td>ja</td><td>ja</td><td>nein</td><td><b>nein</b></td></tr><tr><td>ja</td><td>nein</td><td>ja</td><td><b>ja</b></td></tr><tr><td>nein</td><td>ja</td><td>nein</td><td><b>nein</b></td></tr><tr><td>nein</td><td>nein</td><td>ja</td><td><b>ja</b></td></tr></table></center>",
      answers: {
        a: "<img src='static/images/ausflug.png' alt='Entscheidungsbaum 1' width='25%' height='25%'>",
        b: "<img src='static/images/ausflug2.png' alt='Entscheidungsbaum 2' width='35%' height='35%'>",
        c: "beide sind korrekt",
      },
      correctAnswer: "c"
    }/*,
    {
      question: "Der Algorithmus liefert das Ergebnis, dass es regnen wird. Das bedeutet ...",
      answers: {
        a: "ich sollte einen Schirm mitnehmen, denn es wird auf jeden Fall regnen.",
        b: "nichts! Was weiß der Computer schon?",
        c: ", dass wir überprüfen sollten, wie aussagekräftig dieses Ergebnis ist.",
      },
      correctAnswer: "c"
    }*/
  ];

  function buildQuiz() {

    // for each question...
    questions.forEach((currentQuestion, questionNumber) => {
      // we'll want to store the list of answer choices
      const answers = [];

      // and for each available answer...
      for (letter in currentQuestion.answers) {
        // ...add an HTML radio button
        answers.push(
          `<label>
             <input type="radio" name="question${questionNumber}" value="${letter}" required>
              ${letter} :
              ${currentQuestion.answers[letter]}
           </label>`
        );
      }

      // add this question and its answers to the output
      if (typeof currentQuestion.question1 === 'undefined'){
        output.push(
          `<div class="slide">
             <div class="question"> ${currentQuestion.question} </div>
             <div class="answers"> ${answers.join("")} </div>
           </div>`
        );
      } else {
        output.push(
          `<div class="slide">
             <div class="question1"> ${currentQuestion.question1} </div>
             <div class="answers"> ${answers.join("")} </div>
           </div>`
        );
      }

    });

    // finally combine our output list into one string of HTML and put it on the page
    quizContainer.innerHTML = output.join("");
  }

  function showResults() {
    // gather answer containers from our quiz
    const answerContainers = quizContainer.querySelectorAll(".answers");

    // keep track of user's answers
    let numCorrect = 0;
    var detailed_results = "";
    var allAnswered = true;

    // for each question...
    questions.forEach((currentQuestion, questionNumber) => {
      // find selected answer
      const answerContainer = answerContainers[questionNumber];
      const selector = `input[name=question${questionNumber}]:checked`;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;

      if(userAnswer === undefined) {
        allAnswered = false;
      }

      if(!allAnswered) {
        return;
      }
      if (typeof currentQuestion.question1 === 'undefined'){
        detailed_results +=   "<div class='row'><div class='col-md-3'></div><div class='col-md-6'><div class='alert alert-light' role='alert' style='padding: 10px; border-radius: 5px;'><h4 class='alert-heading'>" +currentQuestion.question + "</h4><hr><ul style='list-style: none;'>";
        //Iterate over answers
        for(var cur_answer in currentQuestion.answers) {
            if(currentQuestion.answers.hasOwnProperty(cur_answer)) {
                if(cur_answer == currentQuestion.correctAnswer && cur_answer == userAnswer) {
                    detailed_results += "<li style='color: green;'> <u>" + cur_answer + ") " + currentQuestion.answers[cur_answer]  + "</u></li>";
                }
                else if(cur_answer == currentQuestion.correctAnswer) {
                  detailed_results += "<li style='color: green;'>" +  cur_answer + ") " + currentQuestion.answers[cur_answer]  + "</li>";
                }
                else if(cur_answer == userAnswer){
                    detailed_results += "<u>" + cur_answer + ") " + currentQuestion.answers[cur_answer]  + "</u><br />";
                }
                else{
                    detailed_results += cur_answer + ") " + currentQuestion.answers[cur_answer]  + "<br />";
                }
            }
        }
      } else {
        detailed_results += "<div class='row'><div class='col-md-3'></div><div class='col-md-6'><div class='alert alert-light' role='alert' style='padding: 10px; border-radius: 5px;'><h4 class='alert-heading'>" +currentQuestion.question1 + "</h4><hr><ul style='list-style: none;'>";
        //Iterate over answers
        for(var cur_answer in currentQuestion.answers) {
            if(currentQuestion.answers.hasOwnProperty(cur_answer)) {
                if(cur_answer == currentQuestion.correctAnswer && cur_answer == userAnswer) {
                  detailed_results += "<li style='color: green;'> <u>" + cur_answer + ") " + currentQuestion.answers[cur_answer]  + "</u></li>";
                }
                else if(cur_answer == currentQuestion.correctAnswer){
                  detailed_results += "<li style='color: green;'> " + cur_answer + ")" + currentQuestion.answers[cur_answer] + "</li><br />";
                }
            }
        }
      }

      console.log(currentQuestion.answers);
      detailed_results += "</ul></div></div></div>";

      // if answer is correct
      if (userAnswer === currentQuestion.correctAnswer) {
        // add to the number of correct answers
        numCorrect++;

        // color the answers green
        answerContainers[questionNumber].style.color = "green";
      } else {
        // if answer is wrong or blank
        // color the answers red
        answerContainers[questionNumber].style.color = "red";
      }
    });

    if(allAnswered === false) {
      Swal.fire({
        title: 'Achtung!',
        text: 'Bitte alle Fragen beantworten!',
        type: 'info',
        confirmButtonText: 'Schließen'
      })
      return;
    }
    window.scrollTo(0, 0);
    // show number of correct answers out of total
    resultsContainer.innerHTML = `<h2>Zusammenfassung</h2><b>Ergebnis: ${numCorrect} von ${questions.length} möglichen Punkten</b>`;
    resultsContainer.innerHTML += '<br /> Hier siehst du nochmal alle Fragen des Quiz und ihre Lösungen. Deine Antworten werden unterstrichen. Die korrekten Antworten sind grün.'
    forwardButton.style.display = "inline-block";
    //hide buttons and questions
    $(".question").remove();
    $(".answers").remove();
    $(".quiz").remove();
    $("#previous").hide();
    $("#next").hide();
    $("#submit").hide();
    $("#wdh").hide();
    $("#detailed_results").html(detailed_results);
  }

  function showSlide(n) {
    slides[currentSlide].classList.remove("active-slide");
    slides[n].classList.add("active-slide");
    currentSlide = n;
    //nextButton.disabled = true;

    if (currentSlide === 0) {
      previousButton.style.display = "none";
      forwardButton.style.display = "none";
    } else {
      previousButton.style.display = "inline-block";
    }

    if (currentSlide === slides.length - 1) {
      nextButton.style.display = "none";
      submitButton.style.display = "inline-block";
      forwardButton.style.display = "none";
    } else {
      nextButton.style.display = "inline-block";
      submitButton.style.display = "none";
      forwardButton.style.display = "none";
    }
  }

  function showNextSlide() {
    showSlide(currentSlide + 1);
  }

  function showPreviousSlide() {
    showSlide(currentSlide - 1);
  }

  function forwardToNextSite() {
    window.location="/example";
  }



  const quizContainer = document.getElementById("quiz");
  const resultsContainer = document.getElementById("points");
  const submitButton = document.getElementById("submit");

  // display quiz right away
  const output = [];
  buildQuiz();

  const previousButton = document.getElementById("previous");
  const nextButton = document.getElementById("next");
  const forwardButton = document.getElementById("forward");
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;
  previousButton.style.top = (0 + slides[0].offsetHeight) + "px";
  nextButton.style.top = (0 + slides[0].offsetHeight) + "px";
  forwardButton.style.top = (0 + slides[0].offsetHeight) + "px";
  submitButton.style.top = (0 + slides[0].offsetHeight) + "px";


  showSlide(0);

  // on submit, show results
  submitButton.addEventListener("click", showResults);
  previousButton.addEventListener("click", showPreviousSlide);
  nextButton.addEventListener("click", showNextSlide);
  forwardButton.addEventListener("click", forwardToNextSite);

})();
