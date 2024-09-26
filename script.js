window.onload = function() {
    loadStoredQueries();
};

document.getElementById('new-question-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value.trim();
    const question = document.getElementById('question').value.trim();

    if (title.length > 20) {
        alert("Query title should not exceed 20 characters.");
        return;
    }

    if (title && question) {
        addQuestion(title, question);
        document.getElementById('new-question-form').reset();
    } else {
        alert("Both query and details are required!");
    }
});

document.getElementById('search-query').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const questions = document.querySelectorAll('.question');
    questions.forEach(function(question) {
        question.style.display = question.innerText.toLowerCase().includes(query) ? 'block' : 'none';
    });
});

function addQuestion(title, question) {
    const questionObj = { title, question };
    let storedQuestions = JSON.parse(localStorage.getItem('questions')) || [];
    storedQuestions.push(questionObj);
    localStorage.setItem('questions', JSON.stringify(storedQuestions));
    appendQuestionToUI(title, question);
}

function appendQuestionToUI(title, question) {
    const questionsList = document.getElementById('questions-list');
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');
    questionDiv.innerText = title;
    questionDiv.addEventListener('click', function() {
        displayQuestionDetails(title, question);
    });
    questionsList.appendChild(questionDiv);
}

function displayQuestionDetails(title, question) {
    document.getElementById('question-title').innerText = title;
    document.getElementById('question-body').innerText = question;
    document.getElementById('question-form').style.display = 'none';
    document.getElementById('response-section').style.display = 'block';
    document.getElementById('responses-list').innerHTML = ''; 
    loadResponses(title); 
}

document.getElementById('response-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const comment = document.getElementById('comment').value.trim();
    if (name && comment) {
        addResponse(document.getElementById('question-title').innerText, name, comment);
        document.getElementById('response-form').reset();
    } else {
        alert("Both name and comment are required!");
    }
});

document.getElementById('back-btn').addEventListener('click', function() {
    document.getElementById('question-form').style.display = 'block';
    document.getElementById('response-section').style.display = 'none';
});

function addResponse(title, name, comment) {
    const responseObj = { name, comment };
    let storedResponses = JSON.parse(localStorage.getItem('responses')) || {};
    if (!storedResponses[title]) {
        storedResponses[title] = [];
    }
    storedResponses[title].push(responseObj);
    localStorage.setItem('responses', JSON.stringify(storedResponses));
    appendResponseToUI(name, comment);
}

function appendResponseToUI(name, comment) {
    const responsesList = document.getElementById('responses-list');
    const responseDiv = document.createElement('div');
    responseDiv.classList.add('response');
    responseDiv.innerHTML = `<strong>${name}:</strong> ${comment}`;
    responsesList.appendChild(responseDiv);
}

function loadStoredQueries() {
    const storedQuestions = JSON.parse(localStorage.getItem('questions')) || [];
    storedQuestions.forEach(function(question) {
        appendQuestionToUI(question.title, question.question);
    });
}

function loadResponses(title) {
    const storedResponses = JSON.parse(localStorage.getItem('responses')) || {};
    const responses = storedResponses[title] || [];
    responses.forEach(function(response) {
        appendResponseToUI(response.name, response.comment);
    });
}