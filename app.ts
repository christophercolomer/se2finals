// ============================================================
//  app.ts — StudyFlow: OOP Study Session Tracker
//  TypeScript source — compiled to app.js for the browser
// ============================================================

// ─────────────────────────────────────────────
// INTERFACES  (Abstraction via contracts)
// ─────────────────────────────────────────────
interface ISession {
  getSessionType(): string;
  getSummary(): string;
  getMotivation(): string;
}

interface ILevelable {
  getXP(): number;
  getLevel(): number;
  getLevelTitle(): string;
}

// ─────────────────────────────────────────────
// XP & LEVEL SYSTEM  (standalone utility class)
// ─────────────────────────────────────────────
class LevelSystem implements ILevelable {
  private xp: number;
  private static readonly LEVELS: { min: number; title: string; icon: string }[] = [
    { min: 0,    title: "Newbie",       icon: "🌱" },
    { min: 60,   title: "Learner",      icon: "📖" },
    { min: 300,  title: "Focused",      icon: "🎯" },
    { min: 900,  title: "Consistent",   icon: "🔥" },
    { min: 2100, title: "Scholar",      icon: "🏆" },
    { min: 4500, title: "Master",       icon: "🌟" },
    { min: 9000, title: "Legend",       icon: "👑" },
  ];

  constructor(savedXP: number = 0) {
    this.xp = savedXP;
  }

  // Getters
  getXP(): number { return this.xp; }

  getLevel(): number {
    let level = 0;
    for (let i = 0; i < LevelSystem.LEVELS.length; i++) {
      if (this.xp >= LevelSystem.LEVELS[i].min) level = i;
    }
    return level;
  }

  getLevelTitle(): string {
    return LevelSystem.LEVELS[this.getLevel()].title;
  }

  getLevelIcon(): string {
    return LevelSystem.LEVELS[this.getLevel()].icon;
  }

  getNextLevelXP(): number {
    const next = this.getLevel() + 1;
    if (next >= LevelSystem.LEVELS.length) return LevelSystem.LEVELS[LevelSystem.LEVELS.length - 1].min;
    return LevelSystem.LEVELS[next].min;
  }

  getPrevLevelXP(): number {
    return LevelSystem.LEVELS[this.getLevel()].min;
  }

  getProgressPercent(): number {
    const prev = this.getPrevLevelXP();
    const next = this.getNextLevelXP();
    if (next === prev) return 100;
    return Math.min(100, Math.round(((this.xp - prev) / (next - prev)) * 100));
  }

  addXP(seconds: number): number {
    const gained = Math.floor(seconds / 10); // 1 XP per 10 seconds
    const prevLevel = this.getLevel();
    this.xp += gained;
    const newLevel = this.getLevel();
    return newLevel > prevLevel ? newLevel : -1; // returns new level if leveled up
  }

  // Setters
  setXP(val: number): void { this.xp = val; }
}

// ─────────────────────────────────────────────
// ABSTRACT CLASS — StudySession
// Demonstrates: Abstraction + Encapsulation
// ─────────────────────────────────────────────
abstract class StudySession implements ISession {
  private subject: string;           // ENCAPSULATION: private
  private startTime: Date | null;    // ENCAPSULATION: private
  private endTime: Date | null;      // ENCAPSULATION: private
  private elapsedSeconds: number;    // ENCAPSULATION: private

  constructor(subject: string) {
    this.subject        = subject;
    this.startTime      = null;
    this.endTime        = null;
    this.elapsedSeconds = 0;
  }

  // ── Getters (public interface for private data) ──
  getSubject(): string         { return this.subject; }
  getElapsed(): number         { return this.elapsedSeconds; }
  getStartTime(): Date | null  { return this.startTime; }
  getEndTime(): Date | null    { return this.endTime; }

  // ── Setters ──
  setElapsed(s: number): void  { this.elapsedSeconds = s; }
  setSubject(s: string): void  { this.subject = s; }

  // ── Concrete methods (shared behavior) ──
  start(): void { this.startTime = new Date(); }
  end(): void   { this.endTime = new Date(); }

  // ── ABSTRACT methods — child classes MUST implement ──
  abstract getSessionType(): string;
  abstract getSummary(): string;
  abstract getMotivation(): string;
}

// ─────────────────────────────────────────────
// PARENT CLASS 1 — AcademicSession
// Demonstrates: Inheritance (extends StudySession)
// ─────────────────────────────────────────────
class AcademicSession extends StudySession {
  private subjectIcon: string;   // ENCAPSULATION: private

  constructor(subject: string, icon: string = "📘") {
    super(subject);   // calls StudySession constructor
    this.subjectIcon = icon;
  }

  // Getter
  getSubjectIcon(): string { return this.subjectIcon; }

  // Override abstract methods
  getSessionType(): string { return "Academic Session"; }

  getSummary(): string {
    return `Studied ${this.getSubject()} for ${formatTime(this.getElapsed())}.`;
  }

  getMotivation(): string {
    return "Knowledge is the foundation of everything. Keep studying! 📘";
  }
}

// ─────────────────────────────────────────────
// PARENT CLASS 2 — SkillSession
// Demonstrates: Inheritance (extends StudySession)
// ─────────────────────────────────────────────
class SkillSession extends StudySession {
  private skillLevel: string;   // ENCAPSULATION: private

  constructor(subject: string, skillLevel: string = "Beginner") {
    super(subject);
    this.skillLevel = skillLevel;
  }

  // Getters & Setters
  getSkillLevel(): string        { return this.skillLevel; }
  setSkillLevel(lvl: string): void { this.skillLevel = lvl; }

  // Override abstract methods
  getSessionType(): string { return "Skill Session"; }

  getSummary(): string {
    return `Practiced ${this.getSubject()} (${this.skillLevel}) for ${formatTime(this.getElapsed())}.`;
  }

  getMotivation(): string {
    return "Skills are built one rep at a time. Keep practicing! 🎯";
  }
}

// ─────────────────────────────────────────────
// CHILD CLASS 1 — STEMSession
// Demonstrates: Inheritance + POLYMORPHISM (overrides getMotivation)
// ─────────────────────────────────────────────
class STEMSession extends AcademicSession {
  private difficulty: string;   // ENCAPSULATION: private

  constructor(subject: string, difficulty: string = "Medium") {
    super(subject, "🔬");
    this.difficulty = difficulty;
  }

  getDifficulty(): string         { return this.difficulty; }
  setDifficulty(d: string): void  { this.difficulty = d; }

  // POLYMORPHISM: overrides parent's getMotivation()
  getMotivation(): string {
    const msgs = [
      "Every equation solved is a victory! 🧪",
      "STEM minds shape the future. You're doing it! 🚀",
      "One problem at a time — science works like that! ⚗️",
      "Numbers never lie. Keep crunching! 📊",
      "Logic + persistence = mastery. You've got this! 💡",
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }
}

// ─────────────────────────────────────────────
// CHILD CLASS 2 — HumanitiesSession
// Demonstrates: Inheritance + POLYMORPHISM
// ─────────────────────────────────────────────
class HumanitiesSession extends AcademicSession {
  private theme: string;   // ENCAPSULATION: private

  constructor(subject: string, theme: string = "General") {
    super(subject, "📜");
    this.theme = theme;
  }

  getTheme(): string        { return this.theme; }
  setTheme(t: string): void { this.theme = t; }

  // POLYMORPHISM: overrides parent's getMotivation()
  getMotivation(): string {
    const msgs = [
      "Words and history make us human. Keep reading! 📚",
      "Every story expands your world! ✨",
      "Language is power — master it! ✍️",
      "The past teaches the future — study well! 🏛️",
      "Great thinkers read. You're becoming one! 🧠",
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }
}

// ─────────────────────────────────────────────
// CHILD CLASS 3 — TechnicalSkill
// Demonstrates: Inheritance + POLYMORPHISM
// ─────────────────────────────────────────────
class TechnicalSkill extends SkillSession {
  private tool: string;   // ENCAPSULATION: private

  constructor(subject: string, tool: string = "General") {
    super(subject, "Intermediate");
    this.tool = tool;
  }

  getTool(): string        { return this.tool; }
  setTool(t: string): void { this.tool = t; }

  // POLYMORPHISM: overrides parent's getMotivation()
  getMotivation(): string {
    const msgs = [
      "Every bug fixed makes you a better dev! 💻",
      "Code is just logic — and you've got it! ⚡",
      "Build, break, fix, repeat. That's the craft! 🛠️",
      "One more function and you'll nail it! 🔧",
      "Real programmers are made by doing. Keep going! 🖥️",
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }
}

// ─────────────────────────────────────────────
// CHILD CLASS 4 — CreativeSkill
// Demonstrates: Inheritance + POLYMORPHISM
// ─────────────────────────────────────────────
class CreativeSkill extends SkillSession {
  private medium: string;   // ENCAPSULATION: private

  constructor(subject: string, medium: string = "Mixed") {
    super(subject, "Explorer");
    this.medium = medium;
  }

  getMedium(): string        { return this.medium; }
  setMedium(m: string): void { this.medium = m; }

  // POLYMORPHISM: overrides parent's getMotivation()
  getMotivation(): string {
    const msgs = [
      "Creativity grows when you practice it daily! 🎨",
      "Every stroke, note, or word is progress! 🎵",
      "Art is never wasted effort — keep creating! ✨",
      "Your creative voice is unique. Use it! 🌟",
      "Inspiration finds those who show up. You did! 🎭",
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }
}

// ─────────────────────────────────────────────
// SESSION MANAGER  (Business Logic — separated from UI)
// Demonstrates: Encapsulation, DRY, SRP
// ─────────────────────────────────────────────
class SessionManager {
  private sessions: StudySession[];       // ENCAPSULATION: private
  private activeSession: StudySession | null;   // ENCAPSULATION: private

  constructor() {
    this.sessions      = [];
    this.activeSession = null;
  }

  addSession(session: StudySession): void {
    this.sessions.push(session);
    this.activeSession = session;
  }

  finishActive(): void  { this.activeSession = null; }

  getHistory(): StudySession[]           { return [...this.sessions]; }
  getActive(): StudySession | null       { return this.activeSession; }
  getCount(): number                     { return this.sessions.length; }
  getTotalTime(): number {
    return this.sessions.reduce((sum, s) => sum + s.getElapsed(), 0);
  }
}

// ─────────────────────────────────────────────
// TIMER CONTROLLER  (Business Logic)
// Demonstrates: Encapsulation, Separation of Concerns
// ─────────────────────────────────────────────
class TimerController {
  private session: StudySession | null;
  private intervalId: number | null;
  private motivationInterval: number | null;
  private running: boolean;
  private onTick: (elapsed: number) => void;
  private onMotivation: (msg: string) => void;

  constructor(
    onTick: (elapsed: number) => void,
    onMotivation: (msg: string) => void
  ) {
    this.session             = null;
    this.intervalId          = null;
    this.motivationInterval  = null;
    this.running             = false;
    this.onTick              = onTick;
    this.onMotivation        = onMotivation;
  }

  bind(session: StudySession): void { this.session = session; }
  isRunning(): boolean              { return this.running; }

  start(): void {
    if (this.running || !this.session) return;
    this.running = true;
    this.session.start();

    this.intervalId = window.setInterval(() => {
      if (!this.session) return;
      const elapsed = this.session.getElapsed() + 1;
      this.session.setElapsed(elapsed);
      this.onTick(elapsed);
    }, 1000);

    // Every 60s — POLYMORPHISM: same call, different message per class
    this.motivationInterval = window.setInterval(() => {
      if (this.session) this.onMotivation(this.session.getMotivation());
    }, 60000);
  }

  pause(): void {
    if (!this.running) return;
    this.running = false;
    if (this.intervalId)        clearInterval(this.intervalId);
    if (this.motivationInterval) clearInterval(this.motivationInterval);
  }

  stop(): number {
    this.pause();
    if (this.session) this.session.end();
    return this.session ? this.session.getElapsed() : 0;
  }

  reset(): void {
    this.stop();
    this.session = null;
  }
}

// ─────────────────────────────────────────────
// TOAST MANAGER  (UI Utility)
// ─────────────────────────────────────────────
class ToastManager {
  private container: HTMLElement;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId)!;
  }

  show(message: string, duration: number = 2800): void {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    this.container.appendChild(el);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 350);
    }, duration);
  }
}

// ─────────────────────────────────────────────
// UTILITY FUNCTIONS  (DRY principle)
// ─────────────────────────────────────────────
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const mm = m < 10 ? '0' + m : '' + m;
  const ss = s < 10 ? '0' + s : '' + s;
  return mm + ':' + ss;
}

function getPerformanceFeedback(seconds: number): string {
  if (seconds < 60)   return "Every minute counts! Start stronger next time. 🌱";
  if (seconds < 300)  return "Good start! Try to push for longer sessions! ⚡";
  if (seconds < 600)  return "Solid session! You're building momentum! 🔥";
  if (seconds < 1800) return "Great focus! You're doing amazing! 💪";
  return "Outstanding dedication! You're a study champion! 🏆";
}

function mapSubjectToClass(subject: string, type: string): StudySession {
  const stemSubjects  = ['Mathematics', 'Science'];
  const techSubjects  = ['Coding'];
  const creativeSubjects = ['Drawing', 'Music', 'Writing'];

  if (type === 'academic') {
    if (stemSubjects.indexOf(subject) !== -1) return new STEMSession(subject);
    return new HumanitiesSession(subject);
  } else {
    if (techSubjects.indexOf(subject) !== -1)    return new TechnicalSkill(subject, 'Code Editor');
    if (creativeSubjects.indexOf(subject) !== -1) return new CreativeSkill(subject, subject);
    return new TechnicalSkill(subject);
  }
}

// ─────────────────────────────────────────────
// APP STATE (singleton instances)
// ─────────────────────────────────────────────
const manager     = new SessionManager();
const levelSystem = new LevelSystem();
const toast       = new ToastManager('toast-container');

let currentType: string     = 'academic';
let selectedSubject: string = '';
let motivationPoints: number = 0;

const timerCtrl = new TimerController(
  // onTick callback — updates UI
  (elapsed: number) => {
    const disp = document.getElementById('timer-display')!;
    disp.textContent = formatTime(elapsed);
    disp.classList.add('pulse');
    setTimeout(() => disp.classList.remove('pulse'), 500);
    updateRing(elapsed);
  },
  // onMotivation callback — polymorphic, different per session class
  (msg: string) => {
    motivationPoints++;
    const el = document.getElementById('motivation-msg')!;
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = msg;
      el.style.opacity = '1';
      toast.show('💬 ' + msg, 4000);
    }, 400);
  }
);

// ─────────────────────────────────────────────
// SCREEN NAVIGATION  (UI Layer)
// ─────────────────────────────────────────────
function showScreen(id: string): void {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  document.getElementById(id)!.classList.add('active');
  const isUml = id === 'screen-uml';
  (document.getElementById('app-nav') as HTMLElement).style.display = isUml ? 'none' : '';
}

function showHome(): void    { showScreen('screen-home'); updateHomeUI(); }
function showSetup(): void   { resetSetup(); showScreen('screen-setup'); }
function showHistory(): void { renderHistory(); showScreen('screen-history'); }
function showUML(): void     { showScreen('screen-uml'); }
function hideUML(): void     { showHome(); }

// ─────────────────────────────────────────────
// HOME UI
// ─────────────────────────────────────────────
function updateHomeUI(): void {
  const count = manager.getCount();
  const total = manager.getTotalTime();
  const el = document.getElementById('streak-text')!;
  el.textContent = count === 0
    ? "Start your first session today!"
    : `${count} session${count > 1 ? 's' : ''} completed · ${formatTime(total)} total time`;
  updateLevelUI();
}

function updateLevelUI(): void {
  const pct  = levelSystem.getProgressPercent();
  const lv   = levelSystem.getLevel();
  const icon = levelSystem.getLevelIcon();
  const title = levelSystem.getLevelTitle();
  const xp   = levelSystem.getXP();
  const next = levelSystem.getNextLevelXP();

  const levelBadgeEl = document.getElementById('level-badge');
  const levelBarEl   = document.getElementById('level-bar');
  const levelXpEl    = document.getElementById('level-xp');

  if (levelBadgeEl)  levelBadgeEl.textContent = `${icon} Lv.${lv} ${title}`;
  if (levelBarEl)    (levelBarEl as HTMLElement).style.width = pct + '%';
  if (levelXpEl)     levelXpEl.textContent = `${xp} / ${next} XP`;
  const navPill = document.getElementById('nav-level-pill');
  if (navPill) navPill.textContent = `${icon} Lv.${lv} ${title}`;
}

// ─────────────────────────────────────────────
// SETUP SCREEN
// ─────────────────────────────────────────────
function switchType(type: string): void {
  currentType = type;
  selectedSubject = '';
  document.querySelectorAll<HTMLElement>('.subject-btn').forEach(b => b.classList.remove('selected'));
  (document.getElementById('custom-subject') as HTMLInputElement).value = '';
  (document.getElementById('start-btn') as HTMLButtonElement).disabled = true;
  document.getElementById('tab-academic')!.classList.toggle('active', type === 'academic');
  document.getElementById('tab-skill')!.classList.toggle('active', type === 'skill');
  (document.getElementById('academic-subjects') as HTMLElement).style.display = type === 'academic' ? 'grid' : 'none';
  (document.getElementById('skill-subjects') as HTMLElement).style.display    = type === 'skill'    ? 'grid' : 'none';
}

function selectSubject(btn: HTMLElement, name: string): void {
  document.querySelectorAll('.subject-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedSubject = name;
  (document.getElementById('custom-subject') as HTMLInputElement).value = '';
  (document.getElementById('start-btn') as HTMLButtonElement).disabled = false;
}

function onCustomInput(): void {
  const val = (document.getElementById('custom-subject') as HTMLInputElement).value.trim();
  document.querySelectorAll('.subject-btn').forEach(b => b.classList.remove('selected'));
  selectedSubject = val;
  (document.getElementById('start-btn') as HTMLButtonElement).disabled = val.length === 0;
}

function resetSetup(): void {
  selectedSubject = '';
  currentType     = 'academic';
  document.querySelectorAll('.subject-btn').forEach(b => b.classList.remove('selected'));
  (document.getElementById('custom-subject') as HTMLInputElement).value = '';
  (document.getElementById('start-btn') as HTMLButtonElement).disabled = true;
  switchType('academic');
}

function startSession(): void {
  if (!selectedSubject) return;

  // Factory: creates correct OOP subclass — Polymorphism in action
  const session = mapSubjectToClass(selectedSubject, currentType);
  manager.addSession(session);
  timerCtrl.bind(session);
  motivationPoints = 0;

  // Populate timer screen
  (document.getElementById('timer-subject') as HTMLElement).textContent = session.getSubject();
  (document.getElementById('timer-type') as HTMLElement).textContent    = session.getSessionType();
  (document.getElementById('timer-display') as HTMLElement).textContent = '00:00';
  (document.getElementById('ring-fg') as unknown as SVGCircleElement).style.strokeDashoffset = '565.49';
  (document.getElementById('motivation-msg') as HTMLElement).textContent = '';

  setTimerBtns(false, true, true);
  updateBadge('idle');
  showScreen('screen-timer');
  toast.show("Let's go! 💪 Session ready.");
}

// ─────────────────────────────────────────────
// TIMER SCREEN
// ─────────────────────────────────────────────
function timerStart(): void {
  timerCtrl.start();
  setTimerBtns(true, false, false);
  updateBadge('running');
  const session = manager.getActive();
  if (session) {
    const msg = session.getMotivation(); // POLYMORPHISM here
    (document.getElementById('motivation-msg') as HTMLElement).textContent = msg;
    toast.show('✨ ' + msg, 3500);
  }
}

function timerPause(): void {
  timerCtrl.pause();
  setTimerBtns(false, false, false);
  updateBadge('paused');
  toast.show('⏸ Paused — take a breath!');
}

function endSession(): void {
  const elapsed = timerCtrl.stop();
  const session = manager.getActive();
  if (!session) return;

  // Award XP (Level system)
  const leveledUp = levelSystem.addXP(elapsed);
  manager.finishActive();

  // Populate summary
  (document.getElementById('sum-subject') as HTMLElement).textContent  = session.getSubject();
  (document.getElementById('sum-type') as HTMLElement).textContent     = session.getSessionType();
  (document.getElementById('sum-time') as HTMLElement).textContent     = formatTime(elapsed);
  (document.getElementById('sum-points') as HTMLElement).textContent   = `+${Math.floor(elapsed / 10)} XP earned`;
  (document.getElementById('sum-xp-total') as HTMLElement).textContent = `Total XP: ${levelSystem.getXP()}`;
  (document.getElementById('sum-level') as HTMLElement).textContent    = `${levelSystem.getLevelIcon()} Lv.${levelSystem.getLevel()} — ${levelSystem.getLevelTitle()}`;
  (document.getElementById('sum-feedback') as HTMLElement).textContent = getPerformanceFeedback(elapsed);
  (document.getElementById('sum-summary') as HTMLElement).textContent  = session.getSummary();

  showScreen('screen-summary');

  if (leveledUp !== -1) {
    setTimeout(() => toast.show(`🎉 LEVEL UP! You're now Lv.${leveledUp} ${levelSystem.getLevelTitle()}!`, 5000), 600);
  } else {
    toast.show('✅ Session saved! Great work!', 3000);
  }
}

function setTimerBtns(startDis: boolean, pauseDis: boolean, endDis: boolean): void {
  (document.getElementById('btn-start') as HTMLButtonElement).disabled = startDis;
  (document.getElementById('btn-pause') as HTMLButtonElement).disabled = pauseDis;
  (document.getElementById('btn-end')   as HTMLButtonElement).disabled = endDis;
}

function updateBadge(state: string): void {
  const badge = document.getElementById('status-badge')!;
  const labels: Record<string, string> = { idle: 'Idle', running: 'Running', paused: 'Paused' };
  badge.className = `status-badge ${state}`;
  badge.innerHTML = `<span class="dot${state === 'running' ? ' blink' : ''}"></span> ${labels[state]}`;
}

function updateRing(elapsed: number): void {
  const ring   = document.getElementById('ring-fg') as unknown as SVGCircleElement;
  const max    = 565.49; // 2 * PI * 90
  const offset = max - Math.min((elapsed / 3600) * max, max);
  ring.style.strokeDashoffset = String(offset);
}

// ─────────────────────────────────────────────
// HISTORY SCREEN
// ─────────────────────────────────────────────
function renderHistory(): void {
  const list     = document.getElementById('history-list')!;
  const sessions = manager.getHistory().reverse();

  if (sessions.length === 0) {
    list.innerHTML = '<div class="empty-state">No sessions yet. Start studying! 📚</div>';
    return;
  }

  list.innerHTML = sessions.map(s => `
    <div class="history-item">
      <div class="history-item-left">
        <div class="history-item-subject">${s.getSubject()}</div>
        <div class="history-item-type">${s.getSessionType()}</div>
      </div>
      <div class="history-item-time">${formatTime(s.getElapsed())}</div>
    </div>
  `).join('');
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
(function init(): void {
  showHome();
})();