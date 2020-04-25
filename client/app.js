var create_quiz_button = document.getElementById("create_quiz_button")
var typeButton = document.getElementById("type_quiz")
var addQuestionButton = document.getElementById("add_question_button")
var enterButton = document.getElementById("join_quiz_button")

var createPage = document.getElementById("createPage")
var enterPage = document.getElementById("enter_page")
var ans1check = document.getElementById("ans1check")
var ans2check = document.getElementById("ans2check")
var ans3check = document.getElementById("ans3check")
var ans4check = document.getElementById("ans4check")
var showQuizButton = document.getElementById("quiz_page_button")
var EditQuizPage = document.getElementById("quizPage")
var chooseQuizButton = document.getElementById("upload_quiz_button");
var title_Global = ""
var pin_GLobal = ""
var QuizBankDiv = document.getElementById("QuizBankDiv");
var QuizList = document.getElementById("quizList")
var QuizBankDisplay = document.getElementById("QuizBankDisplay")


var newpin = function () {
    var pin = Math.round(Math.random() * 9000)  + 1000;
    return pin
}

ans1check.onclick = function() {
    var checkboxes = document.getElementsByName('check')
    checkboxes.forEach((item) => {
        if (item !== ans1check) item.checked = false
    })
}

ans2check.onclick = function() {
    var checkboxes = document.getElementsByName('check')
    checkboxes.forEach((item) => {
        if (item !== ans2check) item.checked = false
    })
}

ans3check.onclick = function() {
    var checkboxes = document.getElementsByName('check')
    checkboxes.forEach((item) => {
        if (item !== ans3check) item.checked = false
    })
}

ans4check.onclick = function() {
    var checkboxes = document.getElementsByName('check')
    checkboxes.forEach((item) => {
        if (item !== ans4check) item.checked = false
    })
}


create_quiz_button.onclick = function(){
    document.getElementById("homePage").style.display = "none";
    document.getElementById("createPage").style.display = "block";
}

chooseQuizButton.onclick = function(){
    document.getElementById("createPage").style.display = "none";
    QuizBankDiv.style.display = "block";
    fetch("http://localhost:8080/quiz").then(function (response) {
      response.json().then(function (data) {
          data.forEach(function(quiz){
                var newDiv = document.createElement("li");
                newDiv.innerHTML = quiz.title
                QuizList.appendChild(newDiv)
                var selectButton = document.createElement("div");
                newDiv.appendChild(selectButton);
                newDiv.onclick = function (){
                    if (confirm("Are you sure you want to delete " + quiz.title + "?"))
                        title_Global = quiz.title
                        pin_GLobal = quiz.pin
                        document.getElementById("pin_display").innerHTML = "Quiz Pin: " + pin_GLobal
                        document.getElementById("title_display").innerHTML = "Quiz Title: " + title_Global
                        QuizBankDiv.style.display = "none";
                        QuizBankDisplay.style.display = "block"
                        getQuiz(quiz.pin)
                }
          })
      });
    });
}
var getQuiz = function(id) {
    fetch("http://localhost:8080/questions/"+id).then ( function (response) {
      response.json().then(function (data) {
        var newUL = document.createElement("ol");
        QuizBankDisplay.appendChild(newUL)
        console.log(data)
        data.forEach(function(questions){
            console.log(questions)
            var newLi = document.createElement("li");
            var ques = document.createElement("div")
            ques.innerHTML = questions.question
            newLi.appendChild(ques)
            console.log(questions.question)

            var classcontainer = document.createElement("div");
            classcontainer.classList.add("answersDisplay")
            newLi.appendChild(classcontainer)

            var ans1 = document.createElement("div");
            ans1.innerHTML = "A.) "+ questions.answer1
            ans1.classList.add("answers")
            classcontainer.appendChild(ans1)

            var ans2 = document.createElement("div");
            ans2.innerHTML = "B.) "+ questions.answer2
            ans2.classList.add("answers")
            classcontainer.appendChild(ans2)

            var ans3 = document.createElement("div");
            ans3.innerHTML = "C.) "+ questions.answer3
            ans3.classList.add("answers")
            classcontainer.appendChild(ans3)

            var ans4 = document.createElement("div");
            ans4.innerHTML = "D.) "+ questions.answer4
            ans4.classList.add("answers")
            classcontainer.appendChild(ans4)

            newUL.appendChild(newLi);
      });

      
    });
});
}

typeButton.onclick = function(){
    var titleInput = document.getElementById("titleInput");
    if (titleInput.value == "") {
        alert("Enter Title of quiz");
        
    }
    else {
    document.getElementById("createPage").style.display = "none";
    document.getElementById("typePage").style.display = "block";
    var titleInput = document.getElementById("titleInput");
    var newTitleInput = encodeURIComponent(titleInput.value);
    pin = newpin()
    var bodyStr = "title="+ newTitleInput;
    bodyStr += "&pin="+ pin.toString();
    console.log("body -> ", bodyStr);
    fetch("http://localhost:8080/quiz", {
        method: "POST",
        body: bodyStr,
        headers: {
          "Content-type": "application/x-www-form-urlencoded", 'Accept': 'application/json'
        }
      }).then(function (response) {
          title_Global = titleInput.value
          pin_GLobal = pin
          document.getElementById("pin_display").innerHTML = "Quiz Pin: " + pin_GLobal
          document.getElementById("title_display").innerHTML = "Quiz Title: " + title_Global
          titleInput.value = ""
      });
    }

}

enterButton.onclick = function () {
    document.getElementById("homePage").style.display = "none";
    enterPage.style.display = "block";
}

addQuestionButton.onclick = function(){
    var questionInput = document.getElementById("questionInput");
    var question = encodeURIComponent(questionInput.value);
    questionInput.value = " "

    var answer1Input = document.getElementById("answer1Input");
    var answer1 = encodeURIComponent(answer1Input.value);
    answer1Input.value = " "

    var answer2Input = document.getElementById("answer2Input");
    var answer2 = encodeURIComponent(answer2Input.value);
    answer2Input.value = " "

    var answer3Input = document.getElementById("answer3Input");
    var answer3 = encodeURIComponent(answer3Input.value);
    answer3Input.value = " "

    var answer4Input = document.getElementById("answer4Input");
    var answer4 = encodeURIComponent(answer4Input.value);
    answer4Input.value = " "

    if (ans1check.checked){
        var correctanswer = answer1;
    }
    else if (ans2check.checked){
        var correctanswer = answer2;
    }
    else if (ans3check.checked){
        var correctanswer = answer3;
    }
    else if (ans4check.checked){
        var correctanswer = answer4;
    }

    var bodyStr = "question="+question;
    bodyStr += "&answer1=" + answer1;
    bodyStr += "&answer2=" + answer2;
    bodyStr += "&answer3=" + answer3;
    bodyStr += "&answer4=" + answer4;
    bodyStr += "&correct_answer=" + correctanswer;
    bodyStr += "&quiz_id=" + pin_GLobal
    console.log(bodyStr)

    fetch("http://localhost:8080/question", {
        // request parameters:
        method: "POST",
        body: bodyStr,
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        }
      }).then(function (response) {
        
        console.log("Server responded!");
      });
}

showQuizButton.onclick = function(){
    document.getElementById("typePage").style.display = "none";
    document.getElementById("quizPage").style.display = "block";
    fetch("http://localhost:8080/questions/" + pin_GLobal).then(function(response){
        response.json().then(function(data){
            var newUL = document.createElement("ul");
            EditQuizPage.appendChild(newUL)
            console.log(data)
            data.forEach(function(questions){
                console.log(questions)
                var newLi = document.createElement("li");
                var ques = document.createElement("div")
                ques.innerHTML = questions.question
                newLi.appendChild(ques)
                console.log(questions.question)

                var classcontainer = document.createElement("div");
                classcontainer.classList.add("answersDisplay")
                newLi.appendChild(classcontainer)

                var ans1 = document.createElement("div");
                ans1.innerHTML = "A.) "+ questions.answer1
                classcontainer.appendChild(ans1)

                var ans2 = document.createElement("div");
                ans2.innerHTML = "B.) "+ questions.answer2
                classcontainer.appendChild(ans2)

                var ans3 = document.createElement("div");
                ans3.innerHTML = "C.) "+ questions.answer3
                classcontainer.appendChild(ans3)

                var ans4 = document.createElement("div");
                ans4.innerHTML = "D.) "+ questions.answer4
                classcontainer.appendChild(ans4)

                var deleteButton = document.createElement("div");
                deleteButton.classList.add("button")
                deleteButton.innerHTML = "Delete";
                deleteButton.onclick = function (){
                    if (confirm("Are you sure you want to delete " + questions.id + "?"))
                      deleteQuestion(questions.id)
                  };
                classcontainer.appendChild(deleteButton)

                var updateButton = document.createElement("div");
                updateButton.classList.add("button")
                updateButton.innerHTML = "Update";
                updateButton.onclick = function (){
                    UpdateQuestion(questions.id,questions.question,questions.answer1,questions.answer2,questions.answer3,questions.answer4,questions.correctanswer, questions.pin);
                };
                classcontainer.appendChild(updateButton);

                newUL.appendChild(newLi);

                
            })
        })
    })
}