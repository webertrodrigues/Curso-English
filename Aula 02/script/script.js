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

// Função unificada para pronúncia de letras e números
function speakText(text, isLetter = false) {
    if (!('speechSynthesis' in window)) {
        alert('Seu navegador não suporta síntese de voz. Tente Chrome ou Edge.');
        return;
    }
    
    // Determina qual seletor de velocidade usar
    const speedSelectId = isLetter ? 'alphabetSpeed' : 'numbersSpeed';
    const rateSelect = document.getElementById(speedSelectId);
    // Se o seletor não existir (como no caso do botão da Frase do Dia), usa velocidade padrão
    const selectedRate = rateSelect ? parseFloat(rateSelect.value) : 1.0;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = selectedRate;
    
    speechSynthesis.cancel(); // Cancela qualquer fala anterior para evitar sobreposição
    speechSynthesis.speak(utterance);
}

// --- Início da Lógica do Diálogo Interativo ---

// Variáveis de estado do diálogo
let currentDialogueLine = 0;
let isPlaying = false;
let isPaused = false;
let dialogueTimeout;

// Falas do diálogo da Aula 2
const dialogueLines = [
    "Good morning, class. How do you spell the number 'two'?",
    "It's T-W-O.",
    "Excellent! And what is ten plus five?",
    "It's fifteen!"
];

// Função para iniciar ou continuar o diálogo
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

// Função para pausar o diálogo
function pauseDialogue() {
    if (isPlaying && !isPaused) {
        isPaused = true;
        isPlaying = false;
        window.speechSynthesis.pause();
        clearTimeout(dialogueTimeout);
        updateDialogueControls();
    }
}

// Função para parar e resetar o diálogo
function stopDialogue() {
    isPlaying = false;
    isPaused = false;
    currentDialogueLine = 0;
    window.speechSynthesis.cancel();
    clearTimeout(dialogueTimeout);
    updateDialogueControls();
    clearHighlight();
}

// Função para tocar a partir de uma linha específica
function playFromLine(lineIndex) {
    stopDialogue();
    currentDialogueLine = lineIndex;
    isPlaying = true;
    isPaused = false;
    updateDialogueControls();
    playNextLine();
}

// Função recursiva para tocar a próxima linha
function playNextLine() {
    if (!isPlaying || currentDialogueLine >= dialogueLines.length) {
        stopDialogue();
        return;
    }
    highlightLine(currentDialogueLine);
    speakDialogueLine(dialogueLines[currentDialogueLine], () => {
        if (isPlaying) {
            dialogueTimeout = setTimeout(() => {
                currentDialogueLine++;
                playNextLine();
            }, 1000);
        }
    });
}

// Função que cria e executa a fala de uma linha do diálogo
function speakDialogueLine(text, onEndCallback) {
    const speed = parseFloat(document.getElementById('dialogueSpeed').value);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.lang = 'en-US';
    utterance.onend = onEndCallback;
    window.speechSynthesis.speak(utterance);
}

// Funções visuais para o diálogo
function highlightLine(lineIndex) {
    clearHighlight();
    const line = document.querySelector(`[data-line="${lineIndex}"]`);
    if (line) line.classList.add('playing');
}

function clearHighlight() {
    document.querySelectorAll('.dialogue-line').forEach(line => {
        line.classList.remove('playing');
    });
}

// Atualiza o estado dos botões de controle
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
    totalQuestions: 10,
    correctAnswers: { q1: 'd', q2: 'b', q3: 'c', q4: 'a', q5: 'a', q6: 'd', q7: 'b', q8: 'b', q9: 'a', q10: 'd' },
    explanations: {
        q1: { correct: 'Correto! A letra "F" (/ɛf/) é a única que não contém o som /iː/ em sua pronúncia.', incorrect: 'A letra "F" (/ɛf/) é a correta, pois é a única que não contém o som /iː/ em sua pronúncia.' },
        q2: { correct: 'Correto! "47" se escreve "Forty-seven" (com hífen) em inglês. Note que "forty" não tem "u".', incorrect: 'A forma correta é "Forty-seven" (com hífen). Lembre-se que "forty" não tem "u" como "four".' },
        q3: { correct: 'Correto! "One hundred pencils" é a forma mais gramaticalmente correta, embora "a hundred" também seja aceitável informalmente.', incorrect: '"One hundred pencils" é a forma mais gramaticalmente correta. "An hundred" está errado e "a hundred" é informal.' },
        q4: { correct: 'Correto! Usamos "zero" em temperaturas e "oh" em números de telefone.', incorrect: 'Em inglês, usamos "zero" em temperaturas e "oh" em números de telefone. O contexto determina a pronúncia.' },
        q5: { correct: 'Correto! "My apartment number is eighty-eight" é a forma mais natural em inglês.', incorrect: 'A forma mais natural é "My apartment number is eighty-eight". Não usamos artigos como "the" antes do número.' },
        q6: { correct: 'Correto! Ambas "one thousand five hundred" e "fifteen hundred" são formas aceitáveis para 1.500.', incorrect: 'Ambas "one thousand five hundred" e "fifteen hundred" são corretas. A primeira é mais formal.' },
        q7: { correct: 'Correto! A letra "H" (/eɪtʃ/) começa com som de vogal (/eɪ/).', incorrect: 'A letra "H" (/eɪtʃ/) é a correta, pois começa com som de vogal (/eɪ/).' },
        q8: { correct: 'Correto! "Excellent" se soletra E-X-C-E-L-L-E-N-T (com dois "L").', incorrect: 'A soletração correta é E-X-C-E-L-L-E-N-T (com dois "L"). Note a duplicação do "L".' },
        q9: { correct: 'Correto! "Thirty" tem a sílaba tônica no "thir", enquanto "thirteen" no "teen".', incorrect: 'A diferença está na sílaba tônica: "thirty" no "thir", "thirteen" no "teen".' },
        q10: { correct: 'Correto! Ambas formas são usadas: "fifteen forty-five" (formal) e "quarter to four" (informal).', incorrect: 'Ambas formas são corretas: "fifteen forty-five" (formal) e "quarter to four" (informal).' }
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
            explanation: isCorrect ? quizConfig.explanations[questionName].correct : quizConfig.explanations[questionName].incorrect
        });
    }
    showResults(score, results);
}

function showResults(score, results) {
    const scoreElement = document.getElementById('scoreText');
    const resultsContainer = document.getElementById('quizResults');
    scoreElement.innerHTML = `Você acertou <span class="text-wine font-bold">${score}/${quizConfig.totalQuestions}</span> questões! <p class="font-baskerville text-lg mt-2 text-navy">${getScoreMessage(score, quizConfig.totalQuestions)}</p>`;
    resultsContainer.innerHTML = results.map(result => `
        <div class="p-4 rounded-lg ${result.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'} mb-3">
            <p class="font-baskerville font-bold ${result.isCorrect ? 'text-green-800' : 'text-red-800'}">Questão ${result.question}: ${result.isCorrect ? '✅ Acertou!' : '❌ Errou'}</p>
            <p class="font-baskerville mt-2 text-navy">${result.explanation}</p>
        </div>`).join('');
    closeQuizModal();
    openResultModal();
}

function getScoreMessage(score, total) {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return '🏆 Excelente! Você domina o alfabeto e números em inglês!';
    if (percentage >= 70) return '👍 Muito bom! Você conhece bem o alfabeto e números em inglês!';
    if (percentage >= 50) return '👌 Bom trabalho! Revise um pouco mais para melhorar!';
    return '✏️ Continue praticando! Revise o alfabeto e números para melhorar!';
}

// --- Fim da Lógica do Quiz ---

// Adiciona os event listeners quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const speedSelector = document.getElementById('dialogueSpeed');
    if (speedSelector) {
        speedSelector.addEventListener('change', function() {
            document.getElementById('speedIndicator').textContent = this.value + 'x';
        });
    }
});
