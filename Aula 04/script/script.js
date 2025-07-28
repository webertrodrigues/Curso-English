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

// Função de fala para vocabulário e teste de velocidade
function speakWord(text) {
    const speed = document.getElementById('speedControl') ? 
                 parseFloat(document.getElementById('speedControl').value) : 
                 1.0;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.lang = 'en-US';
    
    window.speechSynthesis.speak(utterance);
}

function testSpeed() {
    speakWord("This is a test of the speech speed.");
}


// --- Início da Lógica do Diálogo Interativo ---
let currentDialogueLine = 0;
let isPlaying = false;
let isPaused = false;
let dialogueTimeout;

const dialogueLines = [
    "Excuse me, teacher. Is this a pencil?",
    "No, it's a pen. Do you have a pencil?",
    "Yes, I have a pencil in my bag.",
    "Great! And where is the book?"
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
        q1: 'a', q2: 'b', q3: 'b', q4: 'b',
        q5: 'b', q6: 'a', q7: 'c', q8: 'b'
    },
    explanations: {
        q1: { correct: 'Correto! "Book" começa com som de consoante (/b/), então usamos "a".', incorrect: 'Errado! "Book" começa com som de consoante (/b/), então usamos "a".' },
        q2: { correct: 'Correto! "Apple" começa com som de vogal (/æ/), então usamos "an".', incorrect: 'Errado! "Apple" começa com som de vogal (/æ/), então usamos "an".' },
        q3: { correct: 'Correto! Em inglês, precisamos usar o artigo indefinido "a" antes de "pen".', incorrect: 'Errado! A forma correta é "I have a pen" com o artigo indefinido "a".' },
        q4: { correct: 'Correto! Embora "hour" comece com "h", o som é de vogal (/aʊ/), então usamos "an".', incorrect: 'Errado! Embora "hour" comece com "h", o som é de vogal (/aʊ/), então usamos "an".' },
        q5: { correct: 'Correto! Quando nos referimos a algo específico (a porta em questão), usamos "the".', incorrect: 'Errado! Quando nos referimos a algo específico (a porta em questão), usamos "the".' },
        q6: { correct: 'Correto! "University" começa com som de consoante (/j/), então usamos "a".', incorrect: 'Errado! "University" começa com som de consoante (/j/), então usamos "a".' },
        q7: { correct: 'Correto! "Eraser" começa com som de vogal (/ɪ/), então usamos "an".', incorrect: 'Errado! "Eraser" começa com som de vogal (/ɪ/), então usamos "an".' },
        q8: { correct: 'Correto! Usamos "a" para a cadeira (não específica) e "the" para a janela (específica).', incorrect: 'Errado! Usamos "a" para a cadeira (não específica) e "the" para a janela (específica).' }
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
    
    if (percentage >= 90) return '🏆 Excelente! Você domina os artigos e objetos!';
    if (percentage >= 70) return '👍 Muito bom! Continue praticando!';
    if (percentage >= 50) return '👌 Bom trabalho! Revise as regras dos artigos!';
    return '✏️ Continue estudando! A prática leva à perfeição!';
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
