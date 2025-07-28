// JavaScript para Lesson 11: Roupas e Acessórios com funcionalidades extras

// Configuração do Quiz para Lesson 11 (Roupas e Acessórios)
const lesson11QuizConfig = {
    totalQuestions: 6,
    correctAnswers: {
        q1: 'a', // Sweater é fechado na frente, cardigan tem botões ou zíper
        q2: 'a', // socks (meias podem ter furos)
        q3: 'b', // O item está com desconto/promoção
        q4: 'c', // Ambas estão corretas
        q5: 'b', // Tipo de roupa apropriada para o evento
        q6: 'c'  // "He's dressing a blue shirt" está incorreta (deveria ser "wearing")
    },
    explanations: {
        q1: {
            correct: 'Correto! Sweater é uma peça fechada, enquanto cardigan tem abertura frontal com botões ou zíper.',
            incorrect: 'Errado! A diferença principal é que sweater é fechado na frente, enquanto cardigan tem botões ou zíper.'
        },
        q2: {
            correct: 'Correto! "Socks" (meias) são as peças que mais comumente desenvolvem furos.',
            incorrect: 'Errado! A resposta correta é "socks" - meias são as que mais facilmente desenvolvem furos.'
        },
        q3: {
            correct: 'Correto! "On sale" significa que o item está com desconto ou em promoção.',
            incorrect: 'Errado! "On sale" significa que o item está com desconto/promoção, não apenas sendo vendido.'
        },
        q4: {
            correct: 'Correto! Ambas as frases estão gramaticalmente corretas e são usadas em contextos similares.',
            incorrect: 'Errado! Ambas as frases estão corretas: "How does this look on me?" e "Does this fit me well?"'
        },
        q5: {
            correct: 'Correto! "Dress code" refere-se ao tipo de roupa apropriada para um evento específico.',
            incorrect: 'Errado! "Dress code" significa o tipo de roupa apropriada para o evento.'
        },
        q6: {
            correct: 'Correto! "He\'s dressing a blue shirt" está incorreta. O correto seria "He\'s wearing a blue shirt".',
            incorrect: 'Errado! A frase incorreta é "He\'s dressing a blue shirt" - deveria ser "wearing".'
        }
    }
};

// Variáveis para o diálogo sobre roupas
let currentDialogueLine = 0;
let isPlaying = false;
let isPaused = false;
let dialogueTimeout;

const clothingDialogueLines = [
    "Good morning! Can I help you find something?",
    "Yes, I'm looking for a new dress for a party.",
    "What size do you wear?",
    "I wear size medium. Do you have anything in blue?",
    "Yes! We have a beautiful blue dress. Would you like to try it on?",
    "That sounds perfect! Where is the fitting room?"
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
    
    for (let i = 1; i <= lesson11QuizConfig.totalQuestions; i++) {
        const questionName = `q${i}`;
        const selectedOption = form.querySelector(`input[name="${questionName}"]:checked`)?.value;
        const isCorrect = selectedOption === lesson11QuizConfig.correctAnswers[questionName];
        
        if (isCorrect) score++;
        
        results.push({
            question: i,
            isCorrect,
            explanation: isCorrect 
                ? lesson11QuizConfig.explanations[questionName].correct
                : lesson11QuizConfig.explanations[questionName].incorrect
        });
    }
    
    showResults(score, results);
}

// Função para mostrar resultados
function showResults(score, results) {
    const scoreElement = document.getElementById('scoreText');
    const resultsContainer = document.getElementById('quizResults');
    
    scoreElement.innerHTML = `
        Você acertou <span class="text-wine font-bold">${score}/${lesson11QuizConfig.totalQuestions}</span> questões!
        <p class="font-baskerville text-lg mt-2 text-navy">${getScoreMessage(score, lesson11QuizConfig.totalQuestions)}</p>
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
    
    if (percentage >= 90) return '🏆 Excelente! Você domina o vocabulário de roupas e acessórios!';
    if (percentage >= 70) return '👍 Muito bom! Você tem um conhecimento sólido sobre moda em inglês!';
    if (percentage >= 50) return '👌 Bom trabalho! Continue estudando para melhorar ainda mais!';
    return '📚 Continue praticando! Revise o vocabulário de roupas e tente novamente!';
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
    if (!isPlaying || currentDialogueLine >= clothingDialogueLines.length) {
        stopDialogue();
        return;
    }

    highlightLine(currentDialogueLine);
    speakDialogueLine(clothingDialogueLines[currentDialogueLine], () => {
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
    
    if (playBtn && pauseBtn && stopBtn) {
        // O botão de play fica desabilitado se estiver tocando e não pausado
        playBtn.disabled = isPlaying && !isPaused;
        // O botão de pausa só fica habilitado se estiver tocando ativamente
        pauseBtn.disabled = !isPlaying || isPaused;
        // O botão de parar fica habilitado se estiver tocando ou pausado
        stopBtn.disabled = !isPlaying && !isPaused;
    }
}

// Speech synthesis function para outros botões
function speakWord(text) {
    const speedControl = document.getElementById('speedControl');
    const speed = speedControl ? parseFloat(speedControl.value) : 1.0;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.lang = 'en-US';
    
    window.speechSynthesis.speak(utterance);
}

// Função para testar velocidade com vocabulário de roupas
function testSpeed() {
    speakWord('This is a test of the speech speed control for clothing and accessories vocabulary. Dress, shirt, jeans, sneakers, watch, hat, sunglasses, bag.');
}

// Funções originais da Lesson 11
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

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Atualizar indicador de velocidade do diálogo
    const dialogueSpeedElement = document.getElementById('dialogueSpeed');
    if (dialogueSpeedElement) {
        dialogueSpeedElement.addEventListener('change', function() {
            const speedIndicator = document.getElementById('speedIndicator');
            if (speedIndicator) {
                speedIndicator.textContent = this.value + 'x';
            }
        });
    }
    
    // Inicializar controles se existirem
    updateDialogueControls();
    
    // Configurar eventos de teclado para acessibilidade
    document.addEventListener('keydown', function(e) {
        // ESC para fechar modais
        if (e.key === 'Escape') {
            closeQuizModal();
            closeResultModal();
        }
        
        // Espaço para pausar/reproduzir diálogo
        if (e.key === ' ' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
            e.preventDefault();
            if (isPlaying && !isPaused) {
                pauseDialogue();
            } else if (isPaused) {
                playDialogue();
            }
        }
    });
});

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
    // Desabilitar botões de áudio se não houver suporte
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.dialogue-btn, button[onclick*="speakWord"]').forEach(btn => {
            btn.disabled = true;
            btn.title = 'Síntese de fala não suportada neste navegador';
        });
    });
}

