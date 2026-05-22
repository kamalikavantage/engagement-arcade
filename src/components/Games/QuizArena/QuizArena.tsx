import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../Common/Card';
import { Button } from '../../Common/Button';
import { useConfig } from '../../../context/ConfigContext';
import { useGame } from '../../../context/GameContext';
import type { QuizQuestion, QuizAttempt } from '../../../types';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export const QuizArena: React.FC = () => {
  const { config } = useConfig();
  const { userState, recordQuizAttempt, addPoints } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<'company-values' | 'wellness' | 'learning'>(
    'company-values'
  );
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(0);

  const questions = config.quizzes.filter((q: any) => q.category === selectedCategory);

  useEffect(() => {
    if (!started || !currentQuestion) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, currentQuestion]);

  const startQuiz = () => {
    setStarted(true);
    setCurrentQuestion(questions[Math.floor(Math.random() * questions.length)]);
    setTimeLeft(180);
    setCompleted(0);
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (!currentQuestion || selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const pointsEarned = isCorrect ? currentQuestion.points : 0;

    const attempt: QuizAttempt = {
      id: `quiz_${Date.now()}`,
      userId: userState?.userId || 'unknown',
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      pointsEarned,
      completedAt: new Date().toISOString(),
      timeSpent: 180 - timeLeft,
      category: currentQuestion.category,
    };

    recordQuizAttempt(attempt);
    if (isCorrect) {
      addPoints(pointsEarned);
    }

    setShowResult(true);
    setCompleted((c) => c + 1);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(180);
    setCurrentQuestion(questions[Math.floor(Math.random() * questions.length)]);
  };

  if (!started) {
    return (
      <div className="space-y-6">
        <Card gradient>
          <h2 className="text-3xl font-bold text-white mb-4">Quiz Arena</h2>
          <p className="text-slate-300 mb-6">Test your knowledge and earn points!</p>

          <div className="space-y-3">
            {(['company-values', 'wellness', 'learning'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white border-2 border-primary-300'
                    : 'bg-white/5 text-slate-300 border-2 border-transparent hover:border-primary-500/50'
                }`}
              >
                <div className="capitalize font-semibold">{category.replace('-', ' ')}</div>
                <div className="text-sm opacity-75">
                  {questions.length} questions available
                </div>
              </button>
            ))}
          </div>

          <Button onClick={startQuiz} size="lg" className="w-full mt-6">
            Start Quiz
          </Button>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card gradient>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Question {completed + 1} of {questions.length}
            </h3>
            <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((completed + 1) / questions.length) * 100}%` }}
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-accent-500/20 rounded-lg">
            <Clock size={18} className="text-accent-400" />
            <span className="text-accent-300 font-semibold">{timeLeft}s</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">{currentQuestion.question}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <motion.button
                key={idx}
                onClick={() => !showResult && handleAnswer(idx)}
                disabled={showResult}
                whileHover={!showResult ? { scale: 1.02 } : {}}
                className={`w-full p-4 rounded-lg text-left transition-all font-semibold ${
                  selectedAnswer === idx
                    ? currentQuestion.correctAnswer === idx
                      ? 'bg-green-500/30 border-2 border-green-500 text-green-200'
                      : 'bg-red-500/30 border-2 border-red-500 text-red-200'
                    : showResult && idx === currentQuestion.correctAnswer
                    ? 'bg-green-500/20 border-2 border-green-500/50 text-green-300'
                    : 'bg-white/5 border-2 border-white/10 text-slate-300 hover:border-primary-500/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {showResult &&
                    (idx === currentQuestion.correctAnswer ? (
                      <CheckCircle size={20} />
                    ) : selectedAnswer === idx ? (
                      <XCircle size={20} />
                    ) : null)}
                  {option}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/50 mb-4"
          >
            <p className="text-blue-200 mb-2">
              {selectedAnswer === currentQuestion.correctAnswer ? '✓ Correct!' : '✗ Incorrect!'}
            </p>
            {currentQuestion.explanation && <p className="text-blue-100 text-sm">{currentQuestion.explanation}</p>}
          </motion.div>
        )}

        <div className="flex gap-3">
          {showResult ? (
            <Button onClick={nextQuestion} size="lg" className="flex-1">
              Next Question
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={selectedAnswer === null} size="lg" className="flex-1">
              Submit Answer
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
