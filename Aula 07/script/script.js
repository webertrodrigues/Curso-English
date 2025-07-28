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

// Configuração do Quiz adaptada para Família e Relacionamentos
const quizConfig = {
    totalQuestions: 6,
    correctAnswers: {
        q1: 'a',
        q2: 'b',
        q3: 'a',
        q4: 'b',
        q5: 'b',
        q6: 'b'
    },
    explanations: {
        q1: {
            correct: 'Correto! "Mother" significa "mãe" em inglês.',
            incorrect: 'Errado! "Mother" significa "mãe" em inglês.'
        },
        q2: {
            correct: 'Correto! "My brother is tall" significa "Meu irmão é alto".',
            incorrect: 'Errado! "My brother is tall" significa "Meu irmão é alto".'
        },
        q3: {
            correct: 'Correto! "Uncle" é o irmão da mãe ou do pai.',
            incorrect: 'Errado! "Uncle" é o irmão da mãe ou do pai (tio).'
        },
        q4: {
            correct: 'Correto! "Parents" é o plural de "parent" (pais).',
            incorrect: 'Errado! "Parents" é o plural correto de "parent" (pais).'
        },
        q5: {
            correct: 'Correto! "Neighbor" significa "vizinho" em inglês.',
            incorrect: 'Errado! "Neighbor" significa "vizinho" em inglês.'
        },
        q6: {
            correct: 'Correto! "Children" é o plural irregular de "child".',
            incorrect: 'Errado! "Children" é o plural irregular de "child" (crianças).'
        }
    }
};

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
    
    if (percentage >= 90) return '🏆 Excelente! Você domina vocabulário de família em inglês!';
    if (percentage >= 70) return '👍 Muito bom! Você conhece bem o vocabulário de família!';
    if (percentage >= 50) return '👌 Bom trabalho! Revise um pouco mais para melhorar!';
    return '✏️ Continue praticando! Revise o vocabulário de família para melhorar!';
}

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
    speakWord('This is a test of the speech speed control for family vocabulary.');
}

// =====================================
// Controle de Fala / Diálogo
// =====================================

document.addEventListener('DOMContentLoaded', () => {

    const dialogueLines = [
        "Hi John! How is your family?",
        "Hi Sarah! They are all fine, thank you. My brother is visiting this weekend.",
        "Oh, that's nice! Do you have a big family?",
        "Yes, I do. I have two sisters and one brother. And my grandparents live close by.",
        "That's wonderful! Family is very important, big or small."
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