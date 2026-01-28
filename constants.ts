
import { FeedbackOption, AvatarStoreItem } from './types';

export const initialAvatars: string[] = ['🦊', '🐶', '🤖', '🚀', '🦄', '🦁'];

export const feedbackOptions: { correct: FeedbackOption[]; wrong: FeedbackOption[] } = {
  correct: [
    { audio: 'amazing.mp3', msg: '¡Increíble!' },
    { audio: 'cool.mp3', msg: '¡Genial!' },
    { audio: 'excellent.mp3', msg: '¡Excelente!' },
    { audio: 'ibelieveinyou.mp3', msg: '¡Creo en ti!' },
    { audio: 'waytogo.mp3', msg: '¡Así se hace!' },
    { audio: 'younailedit.mp3', msg: '¡Lo lograste!' },
  ],
  wrong: [
    { audio: 'checkagain.mp3', msg: '¡Revisa de nuevo!' },
    { audio: 'dontgiveup.mp3', msg: '¡No te rindas!' },
    { audio: 'iamsorry.mp3', msg: '¡Lo siento!' },
    { audio: 'maybenexttime.mp3', msg: '¡Tal vez la próxima vez!' },
    { audio: 'nicetry.mp3', msg: '¡Buen intento!' },
    { audio: 'ooops.mp3', msg: '¡Ups!' },
    { audio: 'oops-try-again.mp3', msg: '¡Ups, intenta otra vez!' },
    { audio: 'tryagain.mp3', msg: '¡Intenta de nuevo!' },
  ],
};

export const storeAvatars: AvatarStoreItem[] = [
  // Avengers y superhéroes
  { emoji: '🦸‍♂️', name: 'Iron Man', cost: 50 },
  { emoji: '🦸‍♀️', name: 'Black Widow', cost: 60 },
  { emoji: '🦸‍♀️', name: 'Captain Marvel', cost: 70 },
  { emoji: '🕷️', name: 'Spider-Man', cost: 80 },
  { emoji: '⚡', name: 'Thor', cost: 100 },
  { emoji: '🛡️', name: 'Captain America', cost: 120 },
  { emoji: '🟢', name: 'Hulk', cost: 150 },
  { emoji: '🔥', name: 'Human Torch', cost: 200 },

  // Dragon Ball Z (emojis aproximados)
  { emoji: '🐉', name: 'Goku', cost: 100 },
  { emoji: '🦁', name: 'Vegeta', cost: 120 },
  { emoji: '👩‍🦰', name: 'Bulma', cost: 80 },
  { emoji: '🧙‍♂️', name: 'Piccolo', cost: 90 },
  { emoji: '🔥', name: 'Gohan', cost: 110 },

  // Caballeros del Zodiaco
  { emoji: '♈', name: 'Pegaso (Seiya)', cost: 80 },
  { emoji: '♏', name: 'Andrómeda (Shun)', cost: 85 },
  { emoji: '♉', name: 'Dragón (Shiryu)', cost: 90 },
  { emoji: '♊', name: 'Cisne (Hyoga)', cost: 95 },
  { emoji: '♋', name: 'Fénix (Ikki)', cost: 100 },

  // Más femeninos / neutros
  { emoji: '🧚‍♀️', name: 'Hada Guerrera', cost: 50 },
  { emoji: '👸', name: 'Princesa Guerrera', cost: 70 },
  { emoji: '🦹‍♀️', name: 'Villana Épica', cost: 90 },
  { emoji: '🧝‍♀️', name: 'Elfa Arquera', cost: 60 },
  { emoji: '🧙‍♀️', name: 'Hechicera', cost: 75 },
];
