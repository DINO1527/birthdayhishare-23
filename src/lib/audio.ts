// A shared Web Audio graph also supports gain control on iOS, where media-element
// volume alone may be ignored. Create/resume it only in a listener's play gesture.
let context: AudioContext | undefined;
const graphs = new WeakMap<HTMLAudioElement, { gain: GainNode; analyser: AnalyserNode }>();

export async function connectAudio(audio: HTMLAudioElement) {
  context ??= new AudioContext();
  let graph = graphs.get(audio);
  if (!graph) {
    const source = context.createMediaElementSource(audio);
    const gain = context.createGain();
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyser.connect(gain);
    gain.connect(context.destination);
    graph = { gain, analyser };
    graphs.set(audio, graph);
  }
  await context.resume();
  audio.volume = 1;
  return graph;
}

export function setAudioGain(audio: HTMLAudioElement, volume: number, fade = 0.25) {
  const graph = graphs.get(audio);
  if (graph && context) graph.gain.gain.setTargetAtTime(volume, context.currentTime, fade);
  else audio.volume = volume;
}

export function announceVoice(playing: boolean) {
  window.dispatchEvent(new CustomEvent("birthday-voice-playing", { detail: playing }));
}
