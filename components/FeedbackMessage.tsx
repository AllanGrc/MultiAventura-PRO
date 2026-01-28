
import React, { useContext, useEffect } from 'react';
import { SettingsContext } from '../App';
import { feedbackOptions } from '../constants';

interface FeedbackMessageProps {
  message: string;
  type: 'correct' | 'wrong' | null;
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ message, type }) => {
  const settings = useContext(SettingsContext);
  if (!settings) return null;

  const { playFeedbackAudio, hideFeedback } = settings;

  useEffect(() => {
    if (message && type) {
      // Play a random audio message from the appropriate group
      const options = feedbackOptions[type];
      if (options.length > 0) {
        const randomOption = options[Math.floor(Math.random() * options.length)];
        playFeedbackAudio(type, randomOption.msg);
        
        // Show confetti for correct answers
        // Use standard JavaScript to access window.confetti, which is loaded from CDN
        const confettiFunction = window.confetti; // Access directly as it's loaded globally by the CDN script
        if (type === 'correct' && typeof confettiFunction !== 'undefined') {
          confettiFunction({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }

      const timer = setTimeout(() => {
        hideFeedback();
      }, 2000); // Message disappears after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [message, type, playFeedbackAudio, hideFeedback]);

  if (!message || !type) {
    return null;
  }

  const baseClasses = "fixed bottom-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg text-white font-bold text-lg z-50 animate-bounceIn transition-all duration-300";
  const typeClasses = type === 'correct' ? "bg-green-500" : "bg-red-500";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {message}
    </div>
  );
};

export default FeedbackMessage;