// Funções para mostrar/esconder respostas e tradução
function toggleAnswer(questionNumber) {
    const answer = document.getElementById('answer' + questionNumber);
    answer.classList.toggle('hidden-answer');
    answer.classList.toggle('show-answer');
}

function toggleTranslation() {
    const translation = document.getElementById('translation');
    translation.classList.toggle('hidden-answer');
    translation.classList.toggle('show-answer');
}

// Função de fala unificada (substitui a antiga 'speak3')
function speak(text, speed = 1.0) {
    if (!('speechSynthesis' in window)) {
        alert('Seu navegador não suporta a funcionalidade de fala.');
        return;
    }
    window.speechSynthesis.cancel(); // Cancela falas anteriores
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = speed;
    speechSynthesis.speak(utterance);
}


// --- Início da Lógica do Diálogo Interativo ---
let currentDialogueLine = 0;
let isPlaying = false;
let isPaused = false;
let dialogueTimeout;

const dialogueLines = [
    "Look, mommy! A red car!",
    "Yes, darling. And what shape is the wheel?",
    "It's a circle!"
];

function playDialogue() {
    if (isPaused) {
        isPlaying = true;
        isPaused = false;
        window.speechSynthesis.resume();
        updateDialogueControls();
    } else if (!isPlaying) {
        isPlaying = true;
        isPaused = false;
        currentDialogueLine = 0;
        updateDialogueControls();
        playNextLine();
    }
}

function pauseDialogue() {
    if (isPlaying && !isPaused) {
        isPaused = true;
        isPlaying = false;
        window.speechSynthesis.pause();
        clearTimeout(dialogueTimeout);
        updateDialogueControls();
    }
}

function stopDialogue() {
    isPlaying = false;
    isPaused = false;
    currentDialogueLine = 0;
    window.speechSynthesis.cancel();
    clearTimeout(dialogueTimeout);
    updateDialogueControls();
    clearHighlight();
}

function playFromLine(lineIndex) {
    stopDialogue();
    currentDialogueLine = lineIndex;
    isPlaying = true;
    isPaused = false;
    updateDialogueControls();
    playNextLine();
}

function playNextLine() {
    if (!isPlaying || currentDialogueLine >= dialogueLines.length) {
        stopDialogue();
        return;
    }
    highlightLine(currentDialogueLine);
    const speed = parseFloat(document.getElementById('dialogueSpeed').value);
    const utterance = new SpeechSynthesisUtterance(dialogueLines[currentDialogueLine]);
    utterance.rate = speed;
    utterance.lang = 'en-US';
    utterance.onend = () => {
        if (isPlaying) {
            dialogueTimeout = setTimeout(() => {
                currentDialogueLine++;
                playNextLine();
            }, 1000); // Pausa de 1 segundo entre as falas
        }
    };
    window.speechSynthesis.speak(utterance);
}

function highlightLine(lineIndex) {
    clearHighlight();
    const line = document.querySelector(`[data-line="${lineIndex}"]`);
    if (line) {
        line.classList.add('playing');
    }
}

function clearHighlight() {
    document.querySelectorAll('.dialogue-line').forEach(line => {
        line.classList.remove('playing');
    });
}

function updateDialogueControls() {
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');

    playBtn.disabled = isPlaying && !isPaused;
    pauseBtn.disabled = !isPlaying || isPaused;
    stopBtn.disabled = !isPlaying && !isPaused;
}

// --- Fim da Lógica do Diálogo Interativo ---


// --- Início da Lógica do Quiz ---
const quizConfig = {
    totalQuestions: 8,
    correctAnswers: {
        q1: 'b', q2: 'c', q3: 'c', q4: 'b',
        q5: 'c', q6: 'b', q7: 'c', q8: 'c'
    },
    explanations: {
        q1: { correct: 'Correto! "Green" significa verde em inglês.', incorrect: 'Errado! A resposta correta é "Green" para verde.' },
        q2: { correct: 'Correto! "Triangle" significa triângulo e tem três lados.', incorrect: 'Errado! A resposta correta é "Triangle" (triângulo), que tem três lados.' },
        q3: { correct: 'Correto! O sol é amarelo ("Yellow").', incorrect: 'Errado! A resposta correta é "Yellow" (amarelo) para a cor do sol.' },
        q4: { correct: 'Correto! "Star" significa estrela em inglês.', incorrect: 'Errado! A resposta correta é "Star" para estrela.' },
        q5: { correct: 'Correto! Rodas são círculos ("Circle").', incorrect: 'Errado! A resposta correta é "Circle" (círculo) para a forma das rodas.' },
        q6: { correct: 'Correto! "Notebook" significa caderno em inglês.', incorrect: 'Errado! A resposta correta é "Meu caderno é preto" ("Notebook" significa caderno).' },
        q7: { correct: 'Correto! Quadrados ("Square") têm quatro lados iguais.', incorrect: 'Errado! A resposta correta é "Square" (quadrado), que tem quatro lados iguais.' },
        q8: { correct: 'Correto! O céu diurno é azul ("Blue").', incorrect: 'Errado! A resposta correta é "Blue" (azul) para a cor do céu durante o dia.' }
    }
};

function openQuizModal() {
    document.getElementById('quizModal').style.display = 'flex';
    document.getElementById('quizForm').reset();
    document.body.classList.add('modal-open');
}

function closeQuizModal() {
    document.getElementById('quizModal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function openResultModal() {
    document.getElementById('resultModal').style.display = 'flex';
    document.body.classList.add('modal-open');
}

function closeResultModal() {
    document.getElementById('resultModal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function checkQuiz() {
    let score = 0;
    const results = [];
    const form = document.getElementById('quizForm');
    
    for (let i = 1; i <= quizConfig.totalQuestions; i++) {
        const questionName = `q${i}`;
        const selectedOption = form.querySelector(`input[name="${questionName}"]:checked`)?.value;
        const isCorrect = selectedOption === quizConfig.correctAnswers[questionName];
        
        if (isCorrect) score++;
        
        results.push({
            question: i,
            isCorrect,
            explanation: isCorrect 
                ? quizConfig.explanations[questionName].correct
                : quizConfig.explanations[questionName].incorrect
        });
    }
    
    showResults(score, results);
}    

function showResults(score, results) {
    const scoreElement = document.getElementById('scoreText');
    const resultsContainer = document.getElementById('quizResults');
    
    scoreElement.innerHTML = `
        Você acertou <span class="text-wine font-bold">${score}/${quizConfig.totalQuestions}</span> questões!
        <p class="font-baskerville text-lg mt-2 text-navy">${getScoreMessage(score, quizConfig.totalQuestions)}</p>
    `;
    
    resultsContainer.innerHTML = results.map(result => `
        <div class="p-4 rounded-lg ${result.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'} mb-3">
            <p class="font-baskerville font-bold ${result.isCorrect ? 'text-green-800' : 'text-red-800'}">
                Questão ${result.question}: ${result.isCorrect ? '✅ Acertou!' : '❌ Errou'}
            </p>
            <p class="font-baskerville mt-2 text-navy">${result.explanation}</p>
        </div>
    `).join('');
    
    closeQuizModal();
    openResultModal();
}

function getScoreMessage(score, total) {
    const percentage = (score / total) * 100;
    
    if (percentage >= 90) return '🏆 Excelente! Você domina cores e formas em inglês!';
    if (percentage >= 70) return '👍 Muito bom! Você conhece bem cores e formas em inglês!';
    if (percentage >= 50) return '👌 Bom trabalho! Revise um pouco mais para melhorar!';
    return '✏️ Continue praticando! Revise as cores e formas para melhorar!';
}
// --- Fim da Lógica do Quiz ---


// Adiciona Event Listeners quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const speedSelector = document.getElementById('dialogueSpeed');
    if (speedSelector) {
        speedSelector.addEventListener('change', function() {
            document.getElementById('speedIndicator').textContent = this.value + 'x';
        });
    }
});
