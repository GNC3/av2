const questions = [
    { type: "multiple", question: "Qual desses animais são mamíferos?", options: ["Pato", "Gavião", "Javali", "Sapo", "Peixe"], answer: "Javali" },
    { type: "split", question: "Qual desses é um animal de 4 patas?", options: ["Cavalo", "Avestruz"], answer: "Cavalo" },
    { type: "multiple", question: "Quais desses têm penas?", options: ["Cavalo", "Girafa", "Peixe", "Sapo", "Águia"], answer: "Águia" },
    { type: "split", question: "Qual desses animais voa?", options: ["Avestruz", "Flamingo"], answer: "Flamingo" },
    { type: "multiple", question: "Qual animal que muda de forma?", options: ["Sapo", "Peixe", "Cavalo", "Hipopótamo", "Leão"], answer: "Sapo" }
];

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
let currentQuestionIndex = 0;
let score = 0;

const clickSound = document.getElementById("click-sound");
const successSound = document.getElementById("success-sound");

shuffleArray(questions);

function updateProgressBar() {
    const progress = document.getElementById("progress");
    const percentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    progress.style.width = `${percentage}%`;
}

function loadQuestion() {
    updateProgressBar();
    const questionData = questions[currentQuestionIndex];
    document.getElementById("question").textContent = questionData.question;
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";
    
    shuffleArray([...questionData.options]).forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => checkAnswer(option, button);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(option, buttonElement) {
    const isCorrect = option === questions[currentQuestionIndex].answer;
    
    // Play click sound
    clickSound.currentTime = 0;
    clickSound.play();

    // Visual feedback
    buttonElement.classList.add(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
        score++;
    }

    // Disable all buttons
    const buttons = document.querySelectorAll('#options button');
    buttons.forEach(btn => btn.disabled = true);

    // Wait for animation before moving to next question
    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            showResult();
        }
    }, 1000);
}

function showResult() {
    document.getElementById("result-modal").classList.remove("hidden");
    const scoreElement = document.getElementById("score");
    const messageElement = document.getElementById("message");
    
    scoreElement.textContent = `Pontuação: ${score}/${questions.length}`;
    
    if (score === questions.length) {
        messageElement.textContent = "Perfeito! Você acertou todas!";
        successSound.play();
    } else if (score > questions.length / 2) {
        messageElement.textContent = "Muito bem! Continue praticando!";
        successSound.play();
    } else {
        messageElement.textContent = "Continue tentando, você consegue melhorar!";
    }
    
    document.getElementById("restart-btn").classList.remove("hidden");
}

function restartQuiz() {
    score = 0;
    currentQuestionIndex = 0;
    shuffleArray(questions);
    document.getElementById("result-modal").classList.add("hidden");
    document.getElementById("restart-btn").classList.add("hidden");
    loadQuestion();
}

document.getElementById("restart-btn").addEventListener("click", restartQuiz);

// Initialize the quiz
loadQuestion();