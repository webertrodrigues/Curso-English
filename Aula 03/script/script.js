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

function speak3(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // idioma
    utterance.rate = 0.5; // Velocidade (1 = normal, 0.8 = mais lento, 1.5 = mais rápido)
    speechSynthesis.speak(utterance);
}

// Configuração do Quiz
const quizConfig = {
    totalQuestions: 8,
    correctAnswers: {
        q1: 'b',
        q2: 'c',
        q3: 'c',
        q4: 'b',
        q5: 'c',
        q6: 'b',
        q7: 'c',
        q8: 'c'
    },
    explanations: {
        q1: {
            correct: 'Correto! "Green" significa verde em inglês',
            incorrect: 'Errado! A resposta correta é "Green" para verde'
        },
        q2: {
            correct: 'Correto! "Triangle" significa triângulo e tem três lados',
            incorrect: 'Errado! A resposta correta é "Triangle" (triângulo) que tem três lados'
        },
        q3: {
            correct: 'Correto! O sol é amarelo ("Yellow")',
            incorrect: 'Errado! A resposta correta é "Yellow" (amarelo) para a cor do sol'
        },
        q4: {
            correct: 'Correto! "Star" significa estrela em inglês',
            incorrect: 'Errado! A resposta correta é "Star" para estrela'
        },
        q5: {
            correct: 'Correto! Rodas são círculos ("Circle")',
            incorrect: 'Errado! A resposta correta é "Circle" (círculo) para a forma das rodas'
        },
        q6: {
            correct: 'Correto! "Notebook" significa caderno em inglês',
            incorrect: 'Errado! A resposta correta é "Meu caderno é preto" ("Notebook" significa caderno)'
        },
        q7: {
            correct: 'Correto! Quadrados ("Square") têm quatro lados iguais',
            incorrect: 'Errado! A resposta correta é "Square" (quadrado) que tem quatro lados iguais'
        },
        q8: {
            correct: 'Correto! O céu diurno é azul ("Blue")',
            incorrect: 'Errado! A resposta correta é "Blue" (azul) para a cor do céu durante o dia'
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
    
    if (percentage >= 90) return '🏆 Excelente! Você domina cores e formas em inglês!';
    if (percentage >= 70) return '👍 Muito bom! Você conhece bem cores e formas em inglês!';
    if (percentage >= 50) return '👌 Bom trabalho! Revise um pouco mais para melhorar!';
    return '✏️ Continue praticando! Revise as cores e formas para melhorar!';
}