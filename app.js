// ============================================================
//  app.ts — StudyFlow: OOP Study Session Tracker
//  TypeScript source — compiled to app.js for the browser
// ============================================================
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// ─────────────────────────────────────────────
// XP & LEVEL SYSTEM  (standalone utility class)
// ─────────────────────────────────────────────
var LevelSystem = /** @class */ (function () {
    function LevelSystem(savedXP) {
        if (savedXP === void 0) { savedXP = 0; }
        this.xp = savedXP;
    }
    // Getters
    LevelSystem.prototype.getXP = function () { return this.xp; };
    LevelSystem.prototype.getLevel = function () {
        var level = 0;
        for (var i = 0; i < LevelSystem.LEVELS.length; i++) {
            if (this.xp >= LevelSystem.LEVELS[i].min)
                level = i;
        }
        return level;
    };
    LevelSystem.prototype.getLevelTitle = function () {
        return LevelSystem.LEVELS[this.getLevel()].title;
    };
    LevelSystem.prototype.getLevelIcon = function () {
        return LevelSystem.LEVELS[this.getLevel()].icon;
    };
    LevelSystem.prototype.getNextLevelXP = function () {
        var next = this.getLevel() + 1;
        if (next >= LevelSystem.LEVELS.length)
            return LevelSystem.LEVELS[LevelSystem.LEVELS.length - 1].min;
        return LevelSystem.LEVELS[next].min;
    };
    LevelSystem.prototype.getPrevLevelXP = function () {
        return LevelSystem.LEVELS[this.getLevel()].min;
    };
    LevelSystem.prototype.getProgressPercent = function () {
        var prev = this.getPrevLevelXP();
        var next = this.getNextLevelXP();
        if (next === prev)
            return 100;
        return Math.min(100, Math.round(((this.xp - prev) / (next - prev)) * 100));
    };
    LevelSystem.prototype.addXP = function (seconds) {
        var gained = Math.floor(seconds / 10); // 1 XP per 10 seconds
        var prevLevel = this.getLevel();
        this.xp += gained;
        var newLevel = this.getLevel();
        return newLevel > prevLevel ? newLevel : -1; // returns new level if leveled up
    };
    // Setters
    LevelSystem.prototype.setXP = function (val) { this.xp = val; };
    LevelSystem.LEVELS = [
        { min: 0, title: "Newbie", icon: "🌱" },
        { min: 60, title: "Learner", icon: "📖" },
        { min: 300, title: "Focused", icon: "🎯" },
        { min: 900, title: "Consistent", icon: "🔥" },
        { min: 2100, title: "Scholar", icon: "🏆" },
        { min: 4500, title: "Master", icon: "🌟" },
        { min: 9000, title: "Legend", icon: "👑" },
    ];
    return LevelSystem;
}());
// ─────────────────────────────────────────────
// ABSTRACT CLASS — StudySession
// Demonstrates: Abstraction + Encapsulation
// ─────────────────────────────────────────────
var StudySession = /** @class */ (function () {
    function StudySession(subject) {
        this.subject = subject;
        this.startTime = null;
        this.endTime = null;
        this.elapsedSeconds = 0;
    }
    // ── Getters (public interface for private data) ──
    StudySession.prototype.getSubject = function () { return this.subject; };
    StudySession.prototype.getElapsed = function () { return this.elapsedSeconds; };
    StudySession.prototype.getStartTime = function () { return this.startTime; };
    StudySession.prototype.getEndTime = function () { return this.endTime; };
    // ── Setters ──
    StudySession.prototype.setElapsed = function (s) { this.elapsedSeconds = s; };
    StudySession.prototype.setSubject = function (s) { this.subject = s; };
    // ── Concrete methods (shared behavior) ──
    StudySession.prototype.start = function () { this.startTime = new Date(); };
    StudySession.prototype.end = function () { this.endTime = new Date(); };
    return StudySession;
}());
// ─────────────────────────────────────────────
// PARENT CLASS 1 — AcademicSession
// Demonstrates: Inheritance (extends StudySession)
// ─────────────────────────────────────────────
var AcademicSession = /** @class */ (function (_super) {
    __extends(AcademicSession, _super);
    function AcademicSession(subject, icon) {
        if (icon === void 0) { icon = "📘"; }
        var _this = _super.call(this, subject) || this; // calls StudySession constructor
        _this.subjectIcon = icon;
        return _this;
    }
    // Getter
    AcademicSession.prototype.getSubjectIcon = function () { return this.subjectIcon; };
    // Override abstract methods
    AcademicSession.prototype.getSessionType = function () { return "Academic Session"; };
    AcademicSession.prototype.getSummary = function () {
        return "Studied ".concat(this.getSubject(), " for ").concat(formatTime(this.getElapsed()), ".");
    };
    AcademicSession.prototype.getMotivation = function () {
        return "Knowledge is the foundation of everything. Keep studying! 📘";
    };
    return AcademicSession;
}(StudySession));
// ─────────────────────────────────────────────
// PARENT CLASS 2 — SkillSession
// Demonstrates: Inheritance (extends StudySession)
// ─────────────────────────────────────────────
var SkillSession = /** @class */ (function (_super) {
    __extends(SkillSession, _super);
    function SkillSession(subject, skillLevel) {
        if (skillLevel === void 0) { skillLevel = "Beginner"; }
        var _this = _super.call(this, subject) || this;
        _this.skillLevel = skillLevel;
        return _this;
    }
    // Getters & Setters
    SkillSession.prototype.getSkillLevel = function () { return this.skillLevel; };
    SkillSession.prototype.setSkillLevel = function (lvl) { this.skillLevel = lvl; };
    // Override abstract methods
    SkillSession.prototype.getSessionType = function () { return "Skill Session"; };
    SkillSession.prototype.getSummary = function () {
        return "Practiced ".concat(this.getSubject(), " (").concat(this.skillLevel, ") for ").concat(formatTime(this.getElapsed()), ".");
    };
    SkillSession.prototype.getMotivation = function () {
        return "Skills are built one rep at a time. Keep practicing! 🎯";
    };
    return SkillSession;
}(StudySession));
// ─────────────────────────────────────────────
// CHILD CLASS 1 — STEMSession
// Demonstrates: Inheritance + POLYMORPHISM (overrides getMotivation)
// ─────────────────────────────────────────────
var STEMSession = /** @class */ (function (_super) {
    __extends(STEMSession, _super);
    function STEMSession(subject, difficulty) {
        if (difficulty === void 0) { difficulty = "Medium"; }
        var _this = _super.call(this, subject, "🔬") || this;
        _this.difficulty = difficulty;
        return _this;
    }
    STEMSession.prototype.getDifficulty = function () { return this.difficulty; };
    STEMSession.prototype.setDifficulty = function (d) { this.difficulty = d; };
    // POLYMORPHISM: overrides parent's getMotivation()
    STEMSession.prototype.getMotivation = function () {
        var msgs = [
            "Every equation solved is a victory! 🧪",
            "STEM minds shape the future. You're doing it! 🚀",
            "One problem at a time — science works like that! ⚗️",
            "Numbers never lie. Keep crunching! 📊",
            "Logic + persistence = mastery. You've got this! 💡",
        ];
        return msgs[Math.floor(Math.random() * msgs.length)];
    };
    return STEMSession;
}(AcademicSession));
// ─────────────────────────────────────────────
// CHILD CLASS 2 — HumanitiesSession
// Demonstrates: Inheritance + POLYMORPHISM
// ─────────────────────────────────────────────
var HumanitiesSession = /** @class */ (function (_super) {
    __extends(HumanitiesSession, _super);
    function HumanitiesSession(subject, theme) {
        if (theme === void 0) { theme = "General"; }
        var _this = _super.call(this, subject, "📜") || this;
        _this.theme = theme;
        return _this;
    }
    HumanitiesSession.prototype.getTheme = function () { return this.theme; };
    HumanitiesSession.prototype.setTheme = function (t) { this.theme = t; };
    // POLYMORPHISM: overrides parent's getMotivation()
    HumanitiesSession.prototype.getMotivation = function () {
        var msgs = [
            "Words and history make us human. Keep reading! 📚",
            "Every story expands your world! ✨",
            "Language is power — master it! ✍️",
            "The past teaches the future — study well! 🏛️",
            "Great thinkers read. You're becoming one! 🧠",
        ];
        return msgs[Math.floor(Math.random() * msgs.length)];
    };
    return HumanitiesSession;
}(AcademicSession));
// ─────────────────────────────────────────────
// CHILD CLASS 3 — TechnicalSkill
// Demonstrates: Inheritance + POLYMORPHISM
// ─────────────────────────────────────────────
var TechnicalSkill = /** @class */ (function (_super) {
    __extends(TechnicalSkill, _super);
    function TechnicalSkill(subject, tool) {
        if (tool === void 0) { tool = "General"; }
        var _this = _super.call(this, subject, "Intermediate") || this;
        _this.tool = tool;
        return _this;
    }
    TechnicalSkill.prototype.getTool = function () { return this.tool; };
    TechnicalSkill.prototype.setTool = function (t) { this.tool = t; };
    // POLYMORPHISM: overrides parent's getMotivation()
    TechnicalSkill.prototype.getMotivation = function () {
        var msgs = [
            "Every bug fixed makes you a better dev! 💻",
            "Code is just logic — and you've got it! ⚡",
            "Build, break, fix, repeat. That's the craft! 🛠️",
            "One more function and you'll nail it! 🔧",
            "Real programmers are made by doing. Keep going! 🖥️",
        ];
        return msgs[Math.floor(Math.random() * msgs.length)];
    };
    return TechnicalSkill;
}(SkillSession));
// ─────────────────────────────────────────────
// CHILD CLASS 4 — CreativeSkill
// Demonstrates: Inheritance + POLYMORPHISM
// ─────────────────────────────────────────────
var CreativeSkill = /** @class */ (function (_super) {
    __extends(CreativeSkill, _super);
    function CreativeSkill(subject, medium) {
        if (medium === void 0) { medium = "Mixed"; }
        var _this = _super.call(this, subject, "Explorer") || this;
        _this.medium = medium;
        return _this;
    }
    CreativeSkill.prototype.getMedium = function () { return this.medium; };
    CreativeSkill.prototype.setMedium = function (m) { this.medium = m; };
    // POLYMORPHISM: overrides parent's getMotivation()
    CreativeSkill.prototype.getMotivation = function () {
        var msgs = [
            "Creativity grows when you practice it daily! 🎨",
            "Every stroke, note, or word is progress! 🎵",
            "Art is never wasted effort — keep creating! ✨",
            "Your creative voice is unique. Use it! 🌟",
            "Inspiration finds those who show up. You did! 🎭",
        ];
        return msgs[Math.floor(Math.random() * msgs.length)];
    };
    return CreativeSkill;
}(SkillSession));
// ─────────────────────────────────────────────
// SESSION MANAGER  (Business Logic — separated from UI)
// Demonstrates: Encapsulation, DRY, SRP
// ─────────────────────────────────────────────
var SessionManager = /** @class */ (function () {
    function SessionManager() {
        this.sessions = [];
        this.activeSession = null;
    }
    SessionManager.prototype.addSession = function (session) {
        this.sessions.push(session);
        this.activeSession = session;
    };
    SessionManager.prototype.finishActive = function () { this.activeSession = null; };
    SessionManager.prototype.getHistory = function () { return __spreadArray([], this.sessions, true); };
    SessionManager.prototype.getActive = function () { return this.activeSession; };
    SessionManager.prototype.getCount = function () { return this.sessions.length; };
    SessionManager.prototype.getTotalTime = function () {
        return this.sessions.reduce(function (sum, s) { return sum + s.getElapsed(); }, 0);
    };
    return SessionManager;
}());
// ─────────────────────────────────────────────
// TIMER CONTROLLER  (Business Logic)
// Demonstrates: Encapsulation, Separation of Concerns
// ─────────────────────────────────────────────
var TimerController = /** @class */ (function () {
    function TimerController(onTick, onMotivation) {
        this.session = null;
        this.intervalId = null;
        this.motivationInterval = null;
        this.running = false;
        this.onTick = onTick;
        this.onMotivation = onMotivation;
    }
    TimerController.prototype.bind = function (session) { this.session = session; };
    TimerController.prototype.isRunning = function () { return this.running; };
    TimerController.prototype.start = function () {
        var _this = this;
        if (this.running || !this.session)
            return;
        this.running = true;
        this.session.start();
        this.intervalId = window.setInterval(function () {
            if (!_this.session)
                return;
            var elapsed = _this.session.getElapsed() + 1;
            _this.session.setElapsed(elapsed);
            _this.onTick(elapsed);
        }, 1000);
        // Every 60s — POLYMORPHISM: same call, different message per class
        this.motivationInterval = window.setInterval(function () {
            if (_this.session)
                _this.onMotivation(_this.session.getMotivation());
        }, 60000);
    };
    TimerController.prototype.pause = function () {
        if (!this.running)
            return;
        this.running = false;
        if (this.intervalId)
            clearInterval(this.intervalId);
        if (this.motivationInterval)
            clearInterval(this.motivationInterval);
    };
    TimerController.prototype.stop = function () {
        this.pause();
        if (this.session)
            this.session.end();
        return this.session ? this.session.getElapsed() : 0;
    };
    TimerController.prototype.reset = function () {
        this.stop();
        this.session = null;
    };
    return TimerController;
}());
// ─────────────────────────────────────────────
// TOAST MANAGER  (UI Utility)
// ─────────────────────────────────────────────
var ToastManager = /** @class */ (function () {
    function ToastManager(containerId) {
        this.container = document.getElementById(containerId);
    }
    ToastManager.prototype.show = function (message, duration) {
        if (duration === void 0) { duration = 2800; }
        var el = document.createElement('div');
        el.className = 'toast';
        el.textContent = message;
        this.container.appendChild(el);
        setTimeout(function () {
            el.classList.add('out');
            setTimeout(function () { return el.remove(); }, 350);
        }, duration);
    };
    return ToastManager;
}());
// ─────────────────────────────────────────────
// UTILITY FUNCTIONS  (DRY principle)
// ─────────────────────────────────────────────
function formatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    var mm = m < 10 ? '0' + m : '' + m;
    var ss = s < 10 ? '0' + s : '' + s;
    return mm + ':' + ss;
}
function getPerformanceFeedback(seconds) {
    if (seconds < 60)
        return "Every minute counts! Start stronger next time. 🌱";
    if (seconds < 300)
        return "Good start! Try to push for longer sessions! ⚡";
    if (seconds < 600)
        return "Solid session! You're building momentum! 🔥";
    if (seconds < 1800)
        return "Great focus! You're doing amazing! 💪";
    return "Outstanding dedication! You're a study champion! 🏆";
}
function mapSubjectToClass(subject, type) {
    var stemSubjects = ['Mathematics', 'Science'];
    var techSubjects = ['Coding'];
    var creativeSubjects = ['Drawing', 'Music', 'Writing'];
    if (type === 'academic') {
        if (stemSubjects.indexOf(subject) !== -1)
            return new STEMSession(subject);
        return new HumanitiesSession(subject);
    }
    else {
        if (techSubjects.indexOf(subject) !== -1)
            return new TechnicalSkill(subject, 'Code Editor');
        if (creativeSubjects.indexOf(subject) !== -1)
            return new CreativeSkill(subject, subject);
        return new TechnicalSkill(subject);
    }
}
// ─────────────────────────────────────────────
// APP STATE (singleton instances)
// ─────────────────────────────────────────────
var manager = new SessionManager();
var levelSystem = new LevelSystem();
var toast = new ToastManager('toast-container');
var currentType = 'academic';
var selectedSubject = '';
var motivationPoints = 0;
var timerCtrl = new TimerController(
// onTick callback — updates UI
function (elapsed) {
    var disp = document.getElementById('timer-display');
    disp.textContent = formatTime(elapsed);
    disp.classList.add('pulse');
    setTimeout(function () { return disp.classList.remove('pulse'); }, 500);
    updateRing(elapsed);
}, 
// onMotivation callback — polymorphic, different per session class
function (msg) {
    motivationPoints++;
    var el = document.getElementById('motivation-msg');
    el.style.opacity = '0';
    setTimeout(function () {
        el.textContent = msg;
        el.style.opacity = '1';
        toast.show('💬 ' + msg, 4000);
    }, 400);
});
// ─────────────────────────────────────────────
// SCREEN NAVIGATION  (UI Layer)
// ─────────────────────────────────────────────
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(function (s) { return s.classList.remove('active'); });
    document.getElementById(id).classList.add('active');
    var isUml = id === 'screen-uml';
    document.getElementById('app-nav').style.display = isUml ? 'none' : '';
}
function showHome() { showScreen('screen-home'); updateHomeUI(); }
function showSetup() { resetSetup(); showScreen('screen-setup'); }
function showHistory() { renderHistory(); showScreen('screen-history'); }
function showUML() { showScreen('screen-uml'); }
function hideUML() { showHome(); }
// ─────────────────────────────────────────────
// HOME UI
// ─────────────────────────────────────────────
function updateHomeUI() {
    var count = manager.getCount();
    var total = manager.getTotalTime();
    var el = document.getElementById('streak-text');
    el.textContent = count === 0
        ? "Start your first session today!"
        : "".concat(count, " session").concat(count > 1 ? 's' : '', " completed \u00B7 ").concat(formatTime(total), " total time");
    updateLevelUI();
}
function updateLevelUI() {
    var pct = levelSystem.getProgressPercent();
    var lv = levelSystem.getLevel();
    var icon = levelSystem.getLevelIcon();
    var title = levelSystem.getLevelTitle();
    var xp = levelSystem.getXP();
    var next = levelSystem.getNextLevelXP();
    var levelBadgeEl = document.getElementById('level-badge');
    var levelBarEl = document.getElementById('level-bar');
    var levelXpEl = document.getElementById('level-xp');
    if (levelBadgeEl)
        levelBadgeEl.textContent = "".concat(icon, " Lv.").concat(lv, " ").concat(title);
    if (levelBarEl)
        levelBarEl.style.width = pct + '%';
    if (levelXpEl)
        levelXpEl.textContent = "".concat(xp, " / ").concat(next, " XP");
    var navPill = document.getElementById('nav-level-pill');
    if (navPill)
        navPill.textContent = "".concat(icon, " Lv.").concat(lv, " ").concat(title);
}
// ─────────────────────────────────────────────
// SETUP SCREEN
// ─────────────────────────────────────────────
function switchType(type) {
    currentType = type;
    selectedSubject = '';
    document.querySelectorAll('.subject-btn').forEach(function (b) { return b.classList.remove('selected'); });
    document.getElementById('custom-subject').value = '';
    document.getElementById('start-btn').disabled = true;
    document.getElementById('tab-academic').classList.toggle('active', type === 'academic');
    document.getElementById('tab-skill').classList.toggle('active', type === 'skill');
    document.getElementById('academic-subjects').style.display = type === 'academic' ? 'grid' : 'none';
    document.getElementById('skill-subjects').style.display = type === 'skill' ? 'grid' : 'none';
}
function selectSubject(btn, name) {
    document.querySelectorAll('.subject-btn').forEach(function (b) { return b.classList.remove('selected'); });
    btn.classList.add('selected');
    selectedSubject = name;
    document.getElementById('custom-subject').value = '';
    document.getElementById('start-btn').disabled = false;
}
function onCustomInput() {
    var val = document.getElementById('custom-subject').value.trim();
    document.querySelectorAll('.subject-btn').forEach(function (b) { return b.classList.remove('selected'); });
    selectedSubject = val;
    document.getElementById('start-btn').disabled = val.length === 0;
}
function resetSetup() {
    selectedSubject = '';
    currentType = 'academic';
    document.querySelectorAll('.subject-btn').forEach(function (b) { return b.classList.remove('selected'); });
    document.getElementById('custom-subject').value = '';
    document.getElementById('start-btn').disabled = true;
    switchType('academic');
}
function startSession() {
    if (!selectedSubject)
        return;
    // Factory: creates correct OOP subclass — Polymorphism in action
    var session = mapSubjectToClass(selectedSubject, currentType);
    manager.addSession(session);
    timerCtrl.bind(session);
    motivationPoints = 0;
    // Populate timer screen
    document.getElementById('timer-subject').textContent = session.getSubject();
    document.getElementById('timer-type').textContent = session.getSessionType();
    document.getElementById('timer-display').textContent = '00:00';
    document.getElementById('ring-fg').style.strokeDashoffset = '565.49';
    document.getElementById('motivation-msg').textContent = '';
    setTimerBtns(false, true, true);
    updateBadge('idle');
    showScreen('screen-timer');
    toast.show("Let's go! 💪 Session ready.");
}
// ─────────────────────────────────────────────
// TIMER SCREEN
// ─────────────────────────────────────────────
function timerStart() {
    timerCtrl.start();
    setTimerBtns(true, false, false);
    updateBadge('running');
    var session = manager.getActive();
    if (session) {
        var msg = session.getMotivation(); // POLYMORPHISM here
        document.getElementById('motivation-msg').textContent = msg;
        toast.show('✨ ' + msg, 3500);
    }
}
function timerPause() {
    timerCtrl.pause();
    setTimerBtns(false, false, false);
    updateBadge('paused');
    toast.show('⏸ Paused — take a breath!');
}
function endSession() {
    var elapsed = timerCtrl.stop();
    var session = manager.getActive();
    if (!session)
        return;
    // Award XP (Level system)
    var leveledUp = levelSystem.addXP(elapsed);
    manager.finishActive();
    // Populate summary
    document.getElementById('sum-subject').textContent = session.getSubject();
    document.getElementById('sum-type').textContent = session.getSessionType();
    document.getElementById('sum-time').textContent = formatTime(elapsed);
    document.getElementById('sum-points').textContent = "+".concat(Math.floor(elapsed / 10), " XP earned");
    document.getElementById('sum-xp-total').textContent = "Total XP: ".concat(levelSystem.getXP());
    document.getElementById('sum-level').textContent = "".concat(levelSystem.getLevelIcon(), " Lv.").concat(levelSystem.getLevel(), " \u2014 ").concat(levelSystem.getLevelTitle());
    document.getElementById('sum-feedback').textContent = getPerformanceFeedback(elapsed);
    document.getElementById('sum-summary').textContent = session.getSummary();
    showScreen('screen-summary');
    if (leveledUp !== -1) {
        setTimeout(function () { return toast.show("\uD83C\uDF89 LEVEL UP! You're now Lv.".concat(leveledUp, " ").concat(levelSystem.getLevelTitle(), "!"), 5000); }, 600);
    }
    else {
        toast.show('✅ Session saved! Great work!', 3000);
    }
}
function setTimerBtns(startDis, pauseDis, endDis) {
    document.getElementById('btn-start').disabled = startDis;
    document.getElementById('btn-pause').disabled = pauseDis;
    document.getElementById('btn-end').disabled = endDis;
}
function updateBadge(state) {
    var badge = document.getElementById('status-badge');
    var labels = { idle: 'Idle', running: 'Running', paused: 'Paused' };
    badge.className = "status-badge ".concat(state);
    badge.innerHTML = "<span class=\"dot".concat(state === 'running' ? ' blink' : '', "\"></span> ").concat(labels[state]);
}
function updateRing(elapsed) {
    var ring = document.getElementById('ring-fg');
    var max = 565.49; // 2 * PI * 90
    var offset = max - Math.min((elapsed / 3600) * max, max);
    ring.style.strokeDashoffset = String(offset);
}
// ─────────────────────────────────────────────
// HISTORY SCREEN
// ─────────────────────────────────────────────
function renderHistory() {
    var list = document.getElementById('history-list');
    var sessions = manager.getHistory().reverse();
    if (sessions.length === 0) {
        list.innerHTML = '<div class="empty-state">No sessions yet. Start studying! 📚</div>';
        return;
    }
    list.innerHTML = sessions.map(function (s) { return "\n    <div class=\"history-item\">\n      <div class=\"history-item-left\">\n        <div class=\"history-item-subject\">".concat(s.getSubject(), "</div>\n        <div class=\"history-item-type\">").concat(s.getSessionType(), "</div>\n      </div>\n      <div class=\"history-item-time\">").concat(formatTime(s.getElapsed()), "</div>\n    </div>\n  "); }).join('');
}
// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
(function init() {
    showHome();
})();
