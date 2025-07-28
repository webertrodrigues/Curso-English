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

// Configuração do Quiz adaptada para Dias da Semana e Meses do Ano
const quizConfig = {
    totalQuestions: 6,
    correctAnswers: {
        q1: 'b',
        q2: 'b',
        q3: 'b',
        q4: 'b',
        q5: 'b',
        q6: 'a'
    },
    explanations: {
        q1: {
            correct: 'Correto! A ordem correta é: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.',
            incorrect: 'Errado! A ordem correta é: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.'
        },
        q2: {
            correct: 'Correto! July é o único mês que termina com "y". May termina com "y" mas é uma palavra com apenas 3 letras.',
            incorrect: 'Errado! July é o único mês que termina com "y". May termina com "y" mas é uma palavra com apenas 3 letras.'
        },
        q3: {
            correct: 'Correto! São 4 meses com 30 dias: April, June, September e November.',
            incorrect: 'Errado! São 4 meses com 30 dias: April, June, September e November.'
        },
        q4: {
            correct: 'Correto! Wednesday é chamado de "hump day" (dia da corcova) porque marca o meio da semana de trabalho.',
            incorrect: 'Errado! Wednesday é chamado de "hump day" (dia da corcova) porque marca o meio da semana de trabalho.'
        },
        q5: {
            correct: 'Correto! Thursday (hoje) + 1 = Friday, + 2 = Saturday, + 3 = Sunday.',
            incorrect: 'Errado! Thursday (hoje) + 1 = Friday, + 2 = Saturday, + 3 = Sunday.'
        },
        q6: {
            correct: 'Correto! February tem 28 dias normalmente e 29 em anos bissextos.',
            incorrect: 'Errado! February tem 28 dias normalmente e 29 em anos bissextos.'
        }
    }
};

// Funções para controlar os modais
function openQuizModal() {
    document.getElementById('quizModal').style.display = 'flex';
    document.getElementById('quizForm').reset();
}

function closeQuizModal() {
    document.getElementById('quizModal').style.display = 'none';
}

function openResultModal() {
    document.getElementById('resultModal').style.display = 'flex';
}

function closeResultModal() {
    document.getElementById('resultModal').style.display = 'none';
}

function restartQuiz() {
    closeResultModal();
    openQuizModal();
}

// Função para verificar respostas
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
        Você acertou <span class="font-bold text-wine">${score}/${quizConfig.totalQuestions}</span> questões!
        <p class="text-lg mt-2 text-navy">${getScoreMessage(score, quizConfig.totalQuestions)}</p>
    `;
    
    resultsContainer.innerHTML = results.map(result => `
        <div class="p-4 rounded-lg ${result.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'} mb-3">
            <p class="font-bold ${result.isCorrect ? 'text-green-800' : 'text-red-800'}">
                Questão ${result.question}: ${result.isCorrect ? '✅ Acertou!' : '❌ Errou'}
            </p>
            <p class="mt-2 text-navy">${result.explanation}</p>
        </div>
    `).join('');
    
    closeQuizModal();
    openResultModal();
}

// Função para mensagem de pontuação
function getScoreMessage(score, total) {
    const percentage = (score / total) * 100;
    
    if (percentage >= 90) return '🏆 Excelente! Você é um expert em dias e meses!';
    if (percentage >= 70) return '👍 Muito bom! Seu conhecimento é avançado!';
    if (percentage >= 50) return '👌 Bom trabalho! Mais um pouco de estudo e você domina tudo!';
    return '✏️ Continue praticando! Revise os dias e meses para melhorar!';
}

// Fechar modais ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('quizModal')) {
        closeQuizModal();
    }
    if (e.target === document.getElementById('resultModal')) {
        closeResultModal();
    }
});

// Speech synthesis function
function speakWord(text) {
    // Get the selected speed
    const speed = document.getElementById('speedControl') ? 
                 parseFloat(document.getElementById('speedControl').value) : 
                 1.0;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.lang = 'en-US';
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
}

// Função para testar velocidade
function testSpeed() {
    speakWord('This is a test of the speech speed control for days and months vocabulary.');
}

// =====================================
// Controle de Fala / Diálogo
// =====================================

document.addEventListener('DOMContentLoaded', () => {

    const dialogueLines = [
        "Hi! What day is today?",
        "Today is Friday. And tomorrow is Saturday!",
        "Great! Do you have plans for the weekend?",
        "Yes, I do. On Saturday, I will visit my family. And on Sunday, I will relax at home.",
        "Sounds good! My birthday is next month, in August.",
        "Oh, happy early birthday! My birthday is in December."
    ];

    let currentLine = 0;
    let isDialoguePlaying = false;
    const speechSynth = window.speechSynthesis;

    const playBtn = document.getElementById('playDialogue');
    const pauseBtn = document.getElementById('pauseDialogue');
    const stopBtn = document.getElementById('stopDialogue');
    const speedControl = document.getElementById('dialogueSpeed');

    function speakLineAsync(text, rate = 1.0) {
        return new Promise((resolve, reject) => {
            const utter = new SpeechSynthesisUtterance(text);
            utter.rate = rate;
            utter.lang = 'en-US';
            utter.onend = () => resolve();
            utter.onerror = (e) => reject(e);
            speechSynth.speak(utter);
        });
    }

    function highlightCurrentLine() {
        document.querySelectorAll('.dialogue-line').forEach(line => {
            line.classList.remove('highlight');
        });

        const lines = document.querySelectorAll('.dialogue-line');
        if (lines[currentLine]) {
            lines[currentLine].classList.add('highlight');
            const el = document.getElementById(`line${currentLine + 1}`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    async function playDialogueFrom(index) {
        isDialoguePlaying = true;
        playBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');

        for (let i = index; i < dialogueLines.length; i++) {
            currentLine = i;
            highlightCurrentLine();

            if (!isDialoguePlaying) break;

            try {
                await speakLineAsync(dialogueLines[i], parseFloat(speedControl.value));
                // Pausa entre as falas
                await new Promise(resolve => setTimeout(resolve, 800));
            } catch (e) {
                console.error('Erro na fala:', e);
                break;
            }
        }

        stopDialogue();
    }

    function playDialogue() {
        if (speechSynth.paused) {
            speechSynth.resume();
            isDialoguePlaying = true;
            playBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
        } else {
            stopDialogue();
            playDialogueFrom(currentLine);
        }
    }

    function pauseDialogue() {
        isDialoguePlaying = false;
        speechSynth.pause();
        playBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
    }

    function stopDialogue() {
        isDialoguePlaying = false;
        speechSynth.cancel();
        currentLine = 0;
        playBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');

        document.querySelectorAll('.dialogue-line').forEach(line => {
            line.classList.remove('highlight');
        });
    }

    // Event listeners
    if (playBtn) playBtn.addEventListener('click', playDialogue);
    if (pauseBtn) pauseBtn.addEventListener('click', pauseDialogue);
    if (stopBtn) stopBtn.addEventListener('click', stopDialogue);

    // Clique nas linhas do diálogo para reproduzir a partir daquela linha
    document.querySelectorAll('.dialogue-line').forEach((line, index) => {
        line.addEventListener('click', () => {
            stopDialogue();
            playDialogueFrom(index);
        });
    });

    if (speedControl) {
        speedControl.addEventListener('change', () => {
            if (isDialoguePlaying) {
                stopDialogue();
                playDialogueFrom(currentLine);
            }
        });
    }

    // Verificar suporte à API de síntese de fala
    if (!window.speechSynthesis) {
        console.error('API de síntese de fala não suportada neste navegador');
        const dialogueControls = document.querySelector('.dialogue-controls');
        if (dialogueControls) {
            dialogueControls.innerHTML =
                '<p class="text-red-600">Seu navegador não suporta a reprodução de áudio. Por favor, atualize ou use outro navegador.</p>';
        }
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
});