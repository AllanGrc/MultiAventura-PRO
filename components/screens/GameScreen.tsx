
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { PlayerContext, SettingsContext } from '../../App';
// Import Player type
import { Player, Session } from '../../types';
import { feedbackOptions } from '../../constants';

interface GameScreenProps {
  onGameEnd: () => void;
  tableNumber: number; // New prop for the selected table
}

const GameScreen: React.FC<GameScreenProps> = ({ onGameEnd, tableNumber }) => {
  const playerContext = useContext(PlayerContext);
  const settingsContext = useContext(SettingsContext);

  if (!playerContext || !settingsContext) return null; // Handle if context is not available

  const { currentPlayer, setCurrentPlayer, savePlayers, setPlayers, players } = playerContext;
  const { showFeedback, hideFeedback } = settingsContext;

  const [session, setSession] = useState<Session | null>(null);
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [options, setOptions] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedbackMsgKey, setFeedbackMsgKey] = useState<string>('');

  useEffect(() => {
    if (!currentPlayer) return;

    // Initialize new game session with the dynamic tableNumber and scaled difficulty
    const newSession: Session = {
      table: tableNumber,
      step: 0,
      maxSteps: 10, // 10 questions per level
      correct: 0,
      ans: 0,
      timer: null,
      timeVal: 0,
      startTime: Date.now(),
      diff: tableNumber * 2, // Difficulty scales with table number (e.g., table 1 -> 2s, table 12 -> 24s per question)
    };
    setSession(newSession);
    generateQuestion(newSession.table, newSession.diff); // Pass diff to generateQuestion

    return () => {
      if (newSession.timer) clearTimeout(newSession.timer);
    };
  }, [currentPlayer, tableNumber]);

  const generateQuestion = useCallback((table: number, difficulty: number) => {
    const num1 = table;
    const num2 = Math.floor(Math.random() * 10) + 1; // 1 to 10
    const correctAnswer = num1 * num2;

    setQuestion(`${num1} x ${num2} = ?`);
    setAnswer('');
    setIsCorrect(null);

    // Generate options
    const newOptions = new Set<number>();
    newOptions.add(correctAnswer);
    while (newOptions.size < 4) {
      let wrongAnswer = correctAnswer + Math.floor(Math.random() * 20) - 10;
      if (wrongAnswer <= 0) wrongAnswer = 1; // Ensure positive answers
      newOptions.add(wrongAnswer);
    }
    setOptions(Array.from(newOptions).sort(() => Math.random() - 0.5));

    if (session?.timer) clearTimeout(session.timer);
    // Start timer for the question, using the scaled difficulty
    const newTimer = setTimeout(() => {
      handleAnswer(-1); // Timeout, consider it wrong
    }, difficulty * 1000);
    setSession(prev => prev ? { ...prev, timer: newTimer, startTime: Date.now() } : null);
  }, [session?.timer]); // Only depend on session.timer here, difficulty is passed in

  const handleAnswer = useCallback((selectedAnswer: number) => {
    if (!session || !currentPlayer) return;

    if (session.timer) clearTimeout(session.timer);
    const endTime = Date.now();
    const timeTaken = ((endTime - session.startTime) / 1000).toFixed(2);

    // Fix: Explicitly cast 'correct' to '0 | 1' to match HistoryEntry type
    const correct = (selectedAnswer === (parseInt(question.split(' ')[0]) * parseInt(question.split(' ')[2])) ? 1 : 0) as 0 | 1;
    const isCorrectAnswer = correct === 1;

    setIsCorrect(isCorrectAnswer);
    const feedbackGroup = isCorrectAnswer ? 'correct' : 'wrong';
    const randomFeedback = feedbackOptions[feedbackGroup][Math.floor(Math.random() * feedbackOptions[feedbackGroup].length)];
    setFeedbackMsgKey(randomFeedback.msg); // Store msg to be shown via context
    showFeedback(randomFeedback.msg, feedbackGroup);

    // Update player history and session stats
    const updatedHistory = [
      ...currentPlayer.history,
      {
        tabla: session.table,
        op: question,
        tiempo: timeTaken,
        acierto: correct,
        fecha: new Date().toLocaleDateString(),
      },
    ];

    const updatedSession = {
      ...session,
      step: session.step + 1,
      correct: session.correct + correct,
      ans: isCorrectAnswer ? session.ans + 1 : session.ans,
    };

    let updatedPlayer: Player = { ...currentPlayer, history: updatedHistory };

    if (!isCorrectAnswer) {
      updatedPlayer.lives -= 1;
      if (updatedPlayer.lives <= 0) {
        alert('¡Te has quedado sin vidas! Fin del juego.');
        // Reset lives and go back to map
        updatedPlayer.lives = 3; // Give 3 lives back for next attempt
        setCurrentPlayer(updatedPlayer);
        savePlayers();
        onGameEnd();
        return;
      }
    } else {
      updatedPlayer.coins += 1; // Award coins for correct answer
    }

    if (updatedSession.step >= updatedSession.maxSteps) {
      // End of level
      let levelCompletedMessage = `¡Terminaste el nivel! Respuestas correctas: ${updatedSession.correct}/${updatedSession.maxSteps}.`;
      if (updatedSession.correct >= updatedSession.maxSteps * 0.7) { // 70% correct to unlock next level
        if (updatedPlayer.unlocked <= updatedSession.table) {
          updatedPlayer.unlocked = updatedSession.table + 1; // Unlock next table
          levelCompletedMessage += ' ¡Nivel siguiente desbloqueado!';
        }
      }

      // Update High Score based on correct answers in this session
      if (updatedSession.correct > updatedPlayer.highScore) {
        updatedPlayer.highScore = updatedSession.correct;
        levelCompletedMessage += ` ¡Nuevo récord personal: ${updatedPlayer.highScore} respuestas correctas!`;
      }

      alert(levelCompletedMessage);
      setCurrentPlayer(updatedPlayer);
      savePlayers();
      onGameEnd();
    } else {
      // Continue to next question
      setCurrentPlayer(updatedPlayer);
      savePlayers();
      setSession(updatedSession);
      // Delay before generating next question to allow feedback to be seen
      setTimeout(() => {
        hideFeedback();
        generateQuestion(session.table, session.diff); // Pass current session.diff
      }, 2000);
    }
  }, [session, currentPlayer, generateQuestion, onGameEnd, showFeedback, hideFeedback, setCurrentPlayer, savePlayers, question]);

  if (!session || !currentPlayer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Iniciando juego...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4 animate-fadeIn">
      <h2 className="text-3xl font-bold text-zinc-800 dark:text-zinc-200 mb-6">
        Tabla del {session.table} - Pregunta {session.step + 1}/{session.maxSteps}
      </h2>
      <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 text-center w-full max-w-md">
        <p className="text-5xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-8 animate-pulseText">
          {question}
        </p>
        <div className="grid grid-cols-2 gap-4">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg text-2xl transition-all duration-200 transform hover:scale-105"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameScreen;