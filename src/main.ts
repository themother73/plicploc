import './style.css';

// --- CONFIGURATION ---
const METRONOME_DURATION = 60; // 60 secondes

// --- TYPES ---
type Mode = 'solute' | 'sang';

interface AppState {
  mode: Mode;
  volIndex: number;
  durIndex: number;
  currentDrops: number;
}

// --- DATA ---
const volumesSolute = [50, 100, 250, 350, 500, 1000, 1500, 3000];
const durationsSolute = [10, 15, 20, 30, 60, 120, 240, 360, 480, 720, 960, 1440];

const volumesSang = [350];
const durationsSang = [30, 60, 90, 120];

// --- STATE ---
const state: AppState = {
  mode: 'solute',
  volIndex: 1, // 100ml
  durIndex: 3, // 30min
  currentDrops: 0
};

// --- AUDIO ---
let audioCtx: AudioContext | null = null;

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

// --- HELPERS ---
const getCurrentLists = () => state.mode === 'solute' 
  ? { vols: volumesSolute, durs: durationsSolute }
  : { vols: volumesSang, durs: durationsSang };

const formatVolume = (ml: number): string => {
  if (ml < 1000) return `${ml} ml`;
  const l = ml / 1000;
  return `${l % 1 === 0 ? l : l.toFixed(1).replace('.', ',')} L`;
};

const formatDuration = (min: number): string => {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (m === 0) return `${h} h`;
  if (m === 30) return `${h}h30`;
  return `${h}h${m}`;
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
  const factor = state.mode === 'sang' ? 15 : 20;
  const drops = Math.round((vol * factor) / dur);
  const mlh = Math.round((vol / dur) * 60);

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
  updateUI();
}

// --- METRONOME ---
let metroInterval: number | null = null;
let countdownInterval: number | null = null;
let timeLeft = METRONOME_DURATION;

function playBeep() {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.value = 880;
  
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}

function triggerFlash() {
  elements.dropContainer.classList.remove('flash');
  void elements.dropContainer.offsetWidth; 
  elements.dropContainer.classList.add('flash');
  playBeep();
  if (navigator.vibrate) navigator.vibrate(50);
}

function startMetronome() {
  if (state.currentDrops <= 0) return;

  elements.modal.classList.remove('hidden');
  elements.modalInfo.textContent = `${state.currentDrops}`;
  
  const activeColor = state.mode === 'sang' ? '#FF3B30' : '#007AFF';
  elements.dropSvg.style.color = activeColor;
  elements.modalInfo.style.color = activeColor;

  timeLeft = METRONOME_DURATION;
  elements.timerVal.textContent = timeLeft.toString();
  
  const intervalMs = (60 / state.currentDrops) * 1000;
  
  triggerFlash(); 
  metroInterval = setInterval(triggerFlash, intervalMs);
  
  countdownInterval = setInterval(() => {
    timeLeft--;
    elements.timerVal.textContent = timeLeft.toString();
    if (timeLeft <= 0) stopMetronome();
  }, 1000);
}

function stopMetronome() {
  if (metroInterval) clearInterval(metroInterval);
  if (countdownInterval) clearInterval(countdownInterval);
  elements.modal.classList.add('hidden');
}

// --- EVENT LISTENERS ---
elements.tabSolute.addEventListener('click', () => setMode('solute'));
elements.tabSang.addEventListener('click', () => setMode('sang'));

elements.volMinus.addEventListener('click', () => { state.volIndex--; updateUI(); });
elements.volPlus.addEventListener('click', () => { state.volIndex++; updateUI(); });
elements.durMinus.addEventListener('click', () => { state.durIndex--; updateUI(); });
elements.durPlus.addEventListener('click', () => { state.durIndex++; updateUI(); });

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
elements.timerVal.textContent = METRONOME_DURATION.toString();
updateUI();
