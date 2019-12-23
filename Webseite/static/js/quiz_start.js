(function() {
  const myQuestions = [
    {
      question: "Was ist ein typisches Beispiel für ein Programm das Maschinelles Lernen nutzt?",
      answers: {
        a: "Spracherkennung digitaler Assistenten",
        b: "Sprachausgabe",
        c: "Texteditor"
      },
      correctAnswer: "a"
    },
    {
      question: "Was gehört zu den Grundprinzipien Maschinellen Lernens?",
      answers: {
        a: "Spracherkennung",
        b: "Programmierung",
        c: "Mustererkennung"
      },
      correctAnswer: "c"
    },
    {
      question: "Was beschreibt Maschinelles Lernen am besten?",
      answers: {
        a: "Computer lernen selbstständig.",
        b: "Computer treffen intelligente Entscheidungen.",
        c: "Computer nutzen Labels um zu lernen.",
      },
      correctAnswer: "a"
    },
    /*{
      question: "Überwachtes Lernen zeichnet sich dadurch aus, dass ...",
      answers: {
        a: "die Trainingsdaten ohne Labels genutzt werden.",
        b: "während des Lernens ein Programmierer eingreifen muss.",
        c: "der Algorithmus auf Labels angewiesen ist.",
      },
      correctAnswer: "c"
    },*/
    {
      question: "Das Prinzip von Belohnung und Bestrafung ist essenzieller Bestandteil des unüberwachten Lernens",
      answers: {
        a: "stimmt",
        b: "stimmt nicht",
      },
      correctAnswer: "b"
    },
    /*{
      question: "Automatisierte Spam-Filter sind ...",
      answers: {
        a: "ein Regressionsproblem.",
        b: "ein Klassifikationsproblem.",
        c: "weder Klassifikationsproblem noch Regressionsproblem.",
      },
      correctAnswer: "b"
    }*/
  ];

  function buildQuiz() {
    // we'll need a place to store the HTML output
    const output = [];

    // for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {
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
      output.push(
        `<div class="slide">
           <div class="question"> ${currentQuestion.question} </div>
           <div class="answers"> ${answers.join("")} </div>
         </div>`
      );
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
    myQuestions.forEach((currentQuestion, questionNumber) => {
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
                  detailed_results += cur_answer + ") " + currentQuestion.answers[cur_answer] + "<br />";
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
    resultsContainer.innerHTML = `<h2>Zusammenfassung</h2><b>Ergebnis: ${numCorrect} von ${myQuestions.length} möglichen Punkten</b>`;
    resultsContainer.innerHTML += '<br /> Hier siehst du nochmal alle Fragen des Quiz.  Deine Antworten werden unterstrichen. Die korrekten Antworten sind grün.'
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
    window.location="/decisiontree";
  }
  const quizContainer = document.getElementById("quiz");
  const resultsContainer = document.getElementById("points");
  const submitButton = document.getElementById("submit");

  // display quiz right away
  buildQuiz();



  const previousButton = document.getElementById("previous");
  const nextButton = document.getElementById("next");
  const forwardButton = document.getElementById("forward");
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  showSlide(0);

  // on submit, show results
  submitButton.addEventListener("click", showResults);
  previousButton.addEventListener("click", showPreviousSlide);
  nextButton.addEventListener("click", showNextSlide);
  forwardButton.addEventListener("click", forwardToNextSite);

})();
