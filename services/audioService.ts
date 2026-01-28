
export function playAudio(file: string, isMuted: boolean) {
  if (isMuted || !file) return;
  // User should place audio files in the public/audios directory
  const audio = new Audio(`/audios/${file}`);
  audio.play().catch(e => console.error("Error playing audio:", e));
}
