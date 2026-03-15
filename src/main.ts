import './style.css';
import { calculateDropsPerMinute, calculateFlowRateMlh } from './calculator';
import { MetronomeEngine } from './audio';
import { Haptics } from './haptics';
import { formatDuration, formatVolume } from './formatting';
import { METRONOME_DURATION_SECONDS, VOLUMES_SOLUTE, DURATIONS_SOLUTE, VOLUMES_SANG, DURATIONS_SANG } from './constants';
import type { AppState, Mode } from './types';

// --- STATE ---
const state: AppState = {
  mode: 'solute',
  volIndex: 1, // 100ml
  durIndex: 3, // 30min
  currentDrops: 0
};

// --- DATA HELPERS ---
const getCurrentLists = () => state.mode === 'solute'
  ? { vols: VOLUMES_SOLUTE, durs: DURATIONS_SOLUTE }
  : { vols: VOLUMES_SANG, durs: DURATIONS_SANG };

// --- METRONOME ENGINE ---
// Callback visuelle appelée à chaque tick (son géré par l'engine)
const triggerFlashAnimation = () => {
  elements.dropContainer.classList.remove('flash');
  void elements.dropContainer.offsetWidth; // Reflow
  elements.dropContainer.classList.add('flash');
};

const metronome = new MetronomeEngine(triggerFlashAnimation);
let countdownInterval: number | null = null;

// --- ELEMENTS DOM ---
const elements = {
  appTitle: document.getElementById('app-title')!,
  tabSolute: document.getElementById('tab-solute')!,
  tabSang: document.getElementById('tab-sang')!,

  volMinus: document.getElementById('vol-minus') as HTMLButtonElement,
  volPlus: document.getElementById('vol-plus') as HTMLButtonElement,
  durMinus: document.getElementById('dur-minus') as HTMLButtonElement,
  durPlus: document.getElementById('dur-plus') as HTMLButtonElement,

  volDisplay: document.getElementById('volume-display')!,
  durDisplay: document.getElementById('duration-display')!,

  dropsResult: document.getElementById('drops-result')!,
  mlhResult: document.getElementById('mlh-result')!,
  btnStart: document.getElementById('btn-start')!,

  modal: document.getElementById('metronome-modal')!,
  dropContainer: document.getElementById('drop-container')!,
  dropSvg: document.getElementById('drop-element')!,
  modalInfo: document.getElementById('modal-info')!,
  timerVal: document.getElementById('timer-val')!,
  btnStop: document.getElementById('btn-stop')!
};

// --- LOGIC ---
function updateUI() {
  const { vols, durs } = getCurrentLists();

  if (state.volIndex >= vols.length) state.volIndex = vols.length - 1;
  if (state.durIndex >= durs.length) state.durIndex = durs.length - 1;

  const vol = vols[state.volIndex];
  const dur = durs[state.durIndex];

  // Affichage
  elements.volDisplay.textContent = formatVolume(vol);
  elements.durDisplay.textContent = formatDuration(dur);

  // Boutons
  elements.volMinus.disabled = state.volIndex === 0;
  elements.volPlus.disabled = state.volIndex === vols.length - 1;
  elements.durMinus.disabled = state.durIndex === 0;
  elements.durPlus.disabled = state.durIndex === durs.length - 1;

  // Calculs
  const drops = calculateDropsPerMinute(vol, dur, state.mode);
  const mlh = calculateFlowRateMlh(vol, dur);

  state.currentDrops = drops;
  elements.dropsResult.textContent = drops.toString();
  elements.mlhResult.textContent = state.mode === 'solute' ? `${mlh} ml/h` : '';

  // Couleurs
  const color = state.mode === 'solute' ? '#007AFF' : '#FF3B30';
  elements.appTitle.style.color = color;
  elements.dropsResult.style.color = color;
  elements.btnStart.style.backgroundColor = color;
}

function setMode(newMode: Mode) {
  state.mode = newMode;
  elements.tabSolute.className = `tab ${newMode === 'solute' ? 'active-solute' : ''}`;
  elements.tabSang.className = `tab ${newMode === 'sang' ? 'active-sang' : ''}`;

  if (newMode === 'solute') {
    state.volIndex = 1;
    state.durIndex = 3;
  } else {
    state.volIndex = 0;
    state.durIndex = 1;
  }
  Haptics.medium();
  updateUI();
}

// --- METRONOME UI CONTROL ---

async function startMetronome() {
  if (state.currentDrops <= 0) return;

  // Init AudioContext sur interaction user
  await metronome.initAudio();

  // Affichage UI
  elements.modal.classList.remove('hidden');
  elements.modalInfo.textContent = `${state.currentDrops}`;

  const activeColor = state.mode === 'sang' ? '#FF3B30' : '#007AFF';
  elements.dropSvg.style.color = activeColor;
  elements.modalInfo.style.color = activeColor;

  let timeLeft = METRONOME_DURATION_SECONDS;
  elements.timerVal.textContent = timeLeft.toString();

  // Démarrer Engine
  Haptics.startMetronome(state.currentDrops, METRONOME_DURATION_SECONDS);
  metronome.start(state.currentDrops);

  // Compte à rebours UI (séparé du timing précis du son)
  countdownInterval = window.setInterval(() => {
    timeLeft--;
    elements.timerVal.textContent = timeLeft.toString();
    if (timeLeft <= 0) stopMetronome();
  }, 1000);
}

function stopMetronome() {
  Haptics.stop();
  Haptics.medium();
  metronome.stop();
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  elements.modal.classList.add('hidden');
}

// --- EVENT LISTENERS ---
elements.tabSolute.addEventListener('click', () => setMode('solute'));
elements.tabSang.addEventListener('click', () => setMode('sang'));

elements.volMinus.addEventListener('click', () => { state.volIndex--; Haptics.light(); updateUI(); });
elements.volPlus.addEventListener('click', () => { state.volIndex++; Haptics.light(); updateUI(); });
elements.durMinus.addEventListener('click', () => { state.durIndex--; Haptics.light(); updateUI(); });
elements.durPlus.addEventListener('click', () => { state.durIndex++; Haptics.light(); updateUI(); });

elements.btnStart.addEventListener('click', startMetronome);
elements.btnStop.addEventListener('click', stopMetronome);

// Touche Echap
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!elements.modal.classList.contains('hidden')) {
      stopMetronome();
    }
  }
});

// --- INIT ---
elements.timerVal.textContent = METRONOME_DURATION_SECONDS.toString();
updateUI();
