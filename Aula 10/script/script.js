// Configuração do Quiz
const quizConfig = {
    totalQuestions: 6,
    correctAnswers: {
        q1: 'a', // Apple
        q2: 'b', // Frango
        q3: 'b', // I'd like pizza, please
        q4: 'b', // Milk
        q5: 'a', // Cheese
        q6: 'b'  // Suco de laranja
    },
    explanations: {
        q1: {
            correct: 'Correto! "Apple" significa maçã em inglês.',
            incorrect: 'Errado! A resposta correta é "Apple" (maçã).'
        },
        q2: {
            correct: 'Correto! "Chicken" significa frango em português.',
            incorrect: 'Errado! "Chicken" significa frango, não peixe ou carne.'
        },
        q3: {
            correct: 'Correto! "I\'d like..., please" é a forma mais educada de pedir.',
            incorrect: 'Errado! A forma mais educada é "I\'d like..., please".'
        },
        q4: {
            correct: 'Correto! "Milk" significa leite em inglês.',
            incorrect: 'Errado! "Milk" é a palavra correta para leite.'
        },
        q5: {
            correct: 'Correto! "Cheese" significa queijo em inglês.',
            incorrect: 'Errado! A resposta correta é "Cheese" (queijo).'
        },
        q6: {
            correct: 'Correto! "Orange juice" significa suco de laranja.',
            incorrect: 'Errado! "Orange juice" significa suco de laranja.'
        }
    }
};

// Variáveis para o diálogo
let currentDialogueLine = 0;
let isPlaying = false;
let isPaused = false; // Nova variável para controlar o estado de pausa
let dialogueTimeout;

const dialogueLines = [
    "Good evening! What would you like to eat today?",
    "I'd like a pizza, please. And some orange juice.",
    "What kind of pizza would you prefer?",
    "Margherita pizza, please. With extra cheese.",
    "Perfect! Your order will be ready in 15 minutes.",
    "Thank you very much!"
];

// Funções para controlar os modais
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

// Função para verificar respostas do quiz
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

// Função para mostrar resultados
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

// Função para mensagem de pontuação
function getScoreMessage(score, total) {
    const percentage = (score / total) * 100;
    
    if (percentage >= 90) return '🏆 Excelente! Você domina o vocabulário de comidas e bebidas!';
    if (percentage >= 70) return '👍 Muito bom! Você tem um conhecimento sólido sobre o tema!';
    if (percentage >= 50) return '👌 Bom trabalho! Continue estudando para melhorar ainda mais!';
    return '📚 Continue praticando! Revise o vocabulário e tente novamente!';
}

// Funções do diálogo interativo
function playDialogue() {
    if (isPaused) {
        // Se estava pausado, apenas continua
        isPlaying = true;
        isPaused = false;
        window.speechSynthesis.resume();
        updateDialogueControls();
    } else if (!isPlaying) {
        // Se não está tocando, começa do início
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
        isPlaying = false; // Pausado não está "tocando" ativamente
        window.speechSynthesis.pause();
        clearTimeout(dialogueTimeout);
        updateDialogueControls();
    }
}

function stopDialogue() {
    isPlaying = false;
    isPaused = false;
    currentDialogueLine = 0;
    window.speechSynthesis.cancel(); // cancel() é correto para parar e resetar
    clearTimeout(dialogueTimeout);
    updateDialogueControls();
    clearHighlight();
}

function playFromLine(lineIndex) {
    stopDialogue(); // Para qualquer reprodução atual antes de começar de uma nova linha
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
    speakDialogueLine(dialogueLines[currentDialogueLine], () => {
        // Quando a fala terminar, espera 1 segundo e vai para a próxima
        if (isPlaying) {
            dialogueTimeout = setTimeout(() => {
                currentDialogueLine++;
                playNextLine();
            }, 1000);
        }
    });
}

function speakDialogueLine(text, callback) {
    const speed = parseFloat(document.getElementById('dialogueSpeed').value);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.lang = 'en-US';
    utterance.onend = callback; // O callback é chamado quando a fala termina
    
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
    
    // O botão de play fica desabilitado se estiver tocando e não pausado
    playBtn.disabled = isPlaying && !isPaused;
    // O botão de pausa só fica habilitado se estiver tocando ativamente
    pauseBtn.disabled = !isPlaying || isPaused;
    // O botão de parar fica habilitado se estiver tocando ou pausado
    stopBtn.disabled = !isPlaying && !isPaused;
}

// Atualizar indicador de velocidade
document.getElementById('dialogueSpeed').addEventListener('change', function() {
    document.getElementById('speedIndicator').textContent = this.value + 'x';
});

// Speech synthesis function para outros botões
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

// Função para testar velocidade
function testSpeed() {
    speakWord('This is a test of the speech speed control for food and drinks vocabulary. Apple, chicken, milk, bread, cheese, pizza.');
}

// Função para mostrar/esconder tradução
function toggleTranslation() {
    const translation = document.getElementById('translation');
    translation.classList.toggle('hidden-answer');
    translation.classList.toggle('show-answer');
}

// Função para mostrar/esconder respostas
function toggleAnswer(answerId) {
    const answer = document.getElementById('answer' + answerId);
    answer.classList.toggle('hidden-answer');
    answer.classList.toggle('show-answer');
}

// Fechar modais ao clicar fora deles
window.addEventListener('click', (e) => {
    const quizModal = document.getElementById('quizModal');
    const resultModal = document.getElementById('resultModal');
    
    if (e.target === quizModal) {
        closeQuizModal();
    }
    if (e.target === resultModal) {
        closeResultModal();
    }
});

// Verificar suporte à API de síntese de fala
if (!window.speechSynthesis) {
    console.error('API de síntese de fala não suportada neste navegador');
    // Você pode desabilitar os botões de áudio aqui se quiser
    document.querySelectorAll('.dialogue-btn, .pronounce-btn').forEach(btn => btn.disabled = true);
}