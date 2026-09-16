// Controlador Principal do Aplicativo de Estudo do Kubernetes Bootcamp

class K8sStudyApp {
  constructor() {
    this.currentModuleId = 1;
    this.currentTab = "theory"; // 'theory', 'lab', 'quiz'

    // Carregar progresso do localStorage
    this.state = this.loadState();

    // Inicializar simulador de terminal
    this.terminal = new K8sTerminalSimulator("terminalBody", "terminalInput", (cmd) => {
      this.handleTerminalCommand(cmd);
    });

    this.initUI();
    this.renderModule(this.currentModuleId);
    this.updateGamificationUI();
  }

  loadState() {
    const defaultState = {
      xp: 0,
      level: 1,
      rankTitle: "Recruta K8s",
      completedModules: [],
      completedSteps: {},
      unlockedBadges: [],
      quizAnswers: {},
      userName: "JAIROS JÚNIOR",
      certTheme: "classic",
      credentialId: "K8S-BC-9482-A7C8-2026"
    };

    try {
      const saved = localStorage.getItem("k8s_bootcamp_state_v1");
      if (saved) {
        return { ...defaultState, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Não foi possível carregar o progresso do localStorage", e);
    }
    return defaultState;
  }

  saveState() {
    try {
      localStorage.setItem("k8s_bootcamp_state_v1", JSON.stringify(this.state));
    } catch (e) {
      console.warn("Falha ao salvar progresso", e);
    }
    this.updateGamificationUI();
  }

  initUI() {
    // Render sidebar module list
    const navContainer = document.getElementById("moduleNav");
    navContainer.innerHTML = "";

    BOOTCAMP_DATA.modules.forEach((mod) => {
      const item = document.createElement("button");
      item.className = `module-item ${mod.id === this.currentModuleId ? "active" : ""} ${this.state.completedModules.includes(mod.id) ? "completed" : ""}`;
      item.id = `nav-mod-${mod.id}`;
      item.innerHTML = `
        <div class="mod-check">${this.state.completedModules.includes(mod.id) ? "✓" : mod.id}</div>
        <div class="mod-info">
          <div class="mod-title">${mod.title}</div>
          <div class="mod-meta">
            <span>⏱️ ${mod.duration}</span>
            <span>⭐ ${mod.xpTotal} XP</span>
          </div>
        </div>
      `;
      item.addEventListener("click", () => {
        this.selectModule(mod.id);
      });
      navContainer.appendChild(item);
    });

    // Tab buttons
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tab = e.target.getAttribute("data-tab");
        this.switchTab(tab);
      });
    });

    // Modal listeners
    document.getElementById("btnOpenBadges").addEventListener("click", () => this.openBadgesModal());
    document.getElementById("btnCloseBadges").addEventListener("click", () => this.closeBadgesModal());
    document.getElementById("btnOpenCert").addEventListener("click", () => this.openCertModal());
    document.getElementById("btnCloseCert").addEventListener("click", () => this.closeCertModal());
    document.getElementById("btnResetProgress").addEventListener("click", () => this.resetProgress());
    document.getElementById("btnPrintCert").addEventListener("click", () => window.print());
    
    // Controle de Nome no Certificado
    const nameInput = document.getElementById("inputStudentName");
    if (nameInput) {
      nameInput.value = this.state.userName;
      nameInput.addEventListener("input", (e) => {
        const val = e.target.value.trim() || "PILOTO K8S";
        this.state.userName = val;
        document.getElementById("certUserName").textContent = val.toUpperCase();
        this.saveState();
      });
    }

    // Alternador de Tema do Certificado
    const btnTheme = document.getElementById("btnToggleCertTheme");
    if (btnTheme) {
      btnTheme.addEventListener("click", () => {
        this.toggleCertTheme();
      });
    }

    // Download do Certificado HTML Isolado
    const btnDownload = document.getElementById("btnDownloadCertHtml");
    if (btnDownload) {
      btnDownload.addEventListener("click", () => {
        this.downloadCertificateHtml();
      });
    }

    // Fechar modal ao clicar fora
    window.addEventListener("click", (e) => {
      const bModal = document.getElementById("badgesModal");
      const cModal = document.getElementById("certModal");
      if (e.target === bModal) this.closeBadgesModal();
      if (e.target === cModal) this.closeCertModal();
    });
  }

  selectModule(moduleId) {
    this.currentModuleId = moduleId;
    document.querySelectorAll(".module-item").forEach((el) => el.classList.remove("active"));
    const activeNav = document.getElementById(`nav-mod-${moduleId}`);
    if (activeNav) activeNav.classList.add("active");

    this.renderModule(moduleId);
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName);
    });
    document.querySelectorAll(".tab-content").forEach((c) => {
      c.classList.toggle("active", c.id === `tabContent-${tabName}`);
    });

    if (tabName === "lab") {
      setTimeout(() => {
        if (this.terminal && this.terminal.input) {
          this.terminal.input.focus();
        }
      }, 100);
    }
  }

  renderModule(moduleId) {
    const mod = BOOTCAMP_DATA.modules.find((m) => m.id === moduleId);
    if (!mod) return;

    // Atualizar Header
    document.getElementById("headerTitle").textContent = mod.title;
    document.getElementById("headerSubtitle").textContent = mod.subtitle;

    // 1. Teoria
    document.getElementById("theoryBody").innerHTML = `
      <div class="theory-card">
        ${mod.theory}
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px;">
        <button class="btn-sidebar" onclick="app.switchTab('lab')" style="background: var(--k8s-blue); color: #fff; border: none; padding: 10px 20px;">
          Ir para o Laboratório Prático ➔
        </button>
      </div>
    `;

    // 2. Laboratório Prático
    const stepsContainer = document.getElementById("labStepsList");
    stepsContainer.innerHTML = "";

    mod.lab.steps.forEach((step) => {
      const stepKey = `${mod.id}_${step.num}`;
      const isDone = !!this.state.completedSteps[stepKey];

      const card = document.createElement("div");
      card.className = `step-card ${isDone ? "done-step" : ""}`;
      card.id = `step-card-${step.num}`;
      card.innerHTML = `
        <div class="step-header">
          <span class="step-num">Passo ${step.num} de ${mod.lab.steps.length}</span>
          ${isDone ? '<span class="step-done-badge">✓ Concluído (+50 XP)</span>' : ""}
        </div>
        <div class="step-text">${step.instruction}</div>
        <div class="step-cmd-box">
          <span class="step-cmd-text">${step.command}</span>
          <button class="btn-run-cmd" onclick="app.runLabCommand('${this.escapeQuotes(step.command)}')">
            ▶ Executar
          </button>
        </div>
        <div class="step-tip">💡 ${step.tip}</div>
      `;
      stepsContainer.appendChild(card);
    });

    // 3. Quiz
    const quizContainer = document.getElementById("quizList");
    quizContainer.innerHTML = "";

    mod.quiz.forEach((q, qIndex) => {
      const card = document.createElement("div");
      card.className = "quiz-card";

      let answersHtml = "";
      q.answers.forEach((ans, aIndex) => {
        const answerKey = `${mod.id}_${qIndex}`;
        const hasAnswered = this.state.quizAnswers[answerKey] !== undefined;
        const isSelected = this.state.quizAnswers[answerKey] === aIndex;

        let selectedClass = "";
        if (hasAnswered && isSelected) {
          selectedClass = ans.isCorrect ? "selected-correct" : "selected-wrong";
        }

        answersHtml += `
          <div class="answer-option ${selectedClass}" onclick="app.selectQuizAnswer(${mod.id}, ${qIndex}, ${aIndex})">
            <div class="answer-text"><strong>${String.fromCharCode(65 + aIndex)})</strong> ${ans.text}</div>
            <div class="answer-note">${ans.note}</div>
          </div>
        `;
      });

      card.innerHTML = `
        <div class="quiz-question-title">Pergunta ${qIndex + 1}: ${q.question}</div>
        <div class="quiz-answers-list">${answersHtml}</div>
      `;
      quizContainer.appendChild(card);
    });
  }

  runLabCommand(cmd) {
    this.switchTab("lab");
    if (this.terminal) {
      this.terminal.execute(cmd);
    }
  }

  handleTerminalCommand(executedCmd) {
    const mod = BOOTCAMP_DATA.modules.find((m) => m.id === this.currentModuleId);
    if (!mod) return;

    const cleanExecuted = executedCmd.trim().replace(/\s+/g, " ");

    mod.lab.steps.forEach((step) => {
      const stepKey = `${mod.id}_${step.num}`;
      const cleanExpected = step.command.trim().replace(/\s+/g, " ");

      // Se comando executado bate com o passo esperado
      if (cleanExecuted.includes(cleanExpected) || cleanExpected.includes(cleanExecuted)) {
        if (!this.state.completedSteps[stepKey]) {
          this.state.completedSteps[stepKey] = true;
          this.addXP(50, `Passo ${step.num} concluído!`);
          this.renderModule(this.currentModuleId);
          this.checkModuleCompletion(mod);
        }
      }
    });
  }

  selectQuizAnswer(moduleId, qIndex, aIndex) {
    const answerKey = `${moduleId}_${qIndex}`;
    if (this.state.quizAnswers[answerKey] !== undefined) return; // já respondido

    const mod = BOOTCAMP_DATA.modules.find((m) => m.id === moduleId);
    if (!mod) return;

    const question = mod.quiz[qIndex];
    const answer = question.answers[aIndex];

    this.state.quizAnswers[answerKey] = aIndex;

    if (answer.isCorrect) {
      this.addXP(100, `Resposta correta no Quiz (+100 XP)!`);
    } else {
      this.addXP(20, `Resposta incorreta. Revise a explicação.`);
    }

    this.renderModule(moduleId);
    this.checkModuleCompletion(mod);
  }

  checkModuleCompletion(mod) {
    // Checar se todos os passos do lab foram feitos
    const allLabDone = mod.lab.steps.every((s) => this.state.completedSteps[`${mod.id}_${s.num}`]);
    // Checar se todas as perguntas do quiz foram respondidas
    const allQuizDone = mod.quiz.every((q, idx) => this.state.quizAnswers[`${mod.id}_${idx}`] !== undefined);

    if (allLabDone && allQuizDone) {
      if (!this.state.completedModules.includes(mod.id)) {
        this.state.completedModules.push(mod.id);
        this.addXP(150, `🏆 Módulo ${mod.id} 100% Concluído!`);

        // Desbloquear emblema do módulo
        if (mod.badgeId) {
          this.unlockBadge(mod.badgeId);
        }

        // Se concluiu todos os 7 módulos, desbloquear emblema supremo
        if (this.state.completedModules.length >= 7) {
          this.unlockBadge("badge-master");
        }

        this.initUI();
      }
    }
    this.saveState();
  }

  addXP(points, reason) {
    this.state.xp += points;
    this.calculateLevel();
    this.saveState();
    this.showToast(`+${points} XP: ${reason}`);
  }

  calculateLevel() {
    const xp = this.state.xp;
    if (xp < 300) {
      this.state.level = 1;
      this.state.rankTitle = "Recruta K8s";
    } else if (xp < 800) {
      this.state.level = 2;
      this.state.rankTitle = "Piloto de Pods";
    } else if (xp < 1500) {
      this.state.level = 3;
      this.state.rankTitle = "Engenheiro de Workloads";
    } else if (xp < 2500) {
      this.state.level = 4;
      this.state.rankTitle = "Mestre de Redes & Services";
    } else {
      this.state.level = 5;
      this.state.rankTitle = "Timoneiro Supremo (Helmsman)";
    }
  }

  unlockBadge(badgeId) {
    if (!this.state.unlockedBadges.includes(badgeId)) {
      this.state.unlockedBadges.push(badgeId);
      const b = BOOTCAMP_DATA.badges.find((item) => item.id === badgeId);
      if (b) {
        this.addXP(b.xp, `Emblema Desbloqueado: ${b.title}!`);
        this.showToast(`🏅 NOVO EMBLEMA: ${b.title}!`, true);
      }
    }
  }

  updateGamificationUI() {
    this.calculateLevel();

    // Ranks e XP
    document.getElementById("rankTitle").textContent = this.state.rankTitle;
    document.getElementById("rankLevel").textContent = `Nível ${this.state.level}`;
    document.getElementById("xpCounter").textContent = `${this.state.xp} XP`;

    // Barra de progresso para o próximo nível
    const thresholds = [0, 300, 800, 1500, 2500, 4000];
    const curBase = thresholds[this.state.level - 1] || 0;
    const nextBase = thresholds[this.state.level] || 4000;
    const pct = Math.min(100, Math.max(0, ((this.state.xp - curBase) / (nextBase - curBase)) * 100));
    document.getElementById("progressBarFill").style.width = `${pct}%`;

    // Badges summary
    document.getElementById("badgesCount").textContent = `${this.state.unlockedBadges.length} / ${BOOTCAMP_DATA.badges.length}`;
    document.getElementById("modulesProgress").textContent = `${this.state.completedModules.length} / 7 Módulos`;
  }

  openBadgesModal() {
    const grid = document.getElementById("badgesGrid");
    grid.innerHTML = "";

    BOOTCAMP_DATA.badges.forEach((b) => {
      const isUnlocked = this.state.unlockedBadges.includes(b.id);
      const item = document.createElement("div");
      item.className = `badge-item ${isUnlocked ? "unlocked" : "locked"}`;
      item.innerHTML = `
        <div class="badge-icon-wrap">${b.icon}</div>
        <div class="badge-name">${b.title}</div>
        <div class="badge-desc">${b.desc}</div>
        <div class="badge-xp-reward">${isUnlocked ? "✓ Conquistado" : `+${b.xp} XP`}</div>
      `;
      grid.appendChild(item);
    });

    document.getElementById("badgesModal").classList.add("open");
  }

  closeBadgesModal() {
    document.getElementById("badgesModal").classList.remove("open");
  }

  openCertModal() {
    const studentName = this.state.userName || "JAIROS JÚNIOR";
    document.getElementById("certUserName").textContent = studentName.toUpperCase();
    
    const nameInput = document.getElementById("inputStudentName");
    if (nameInput) nameInput.value = studentName;

    // Gerar ou carregar Credential ID único
    if (!this.state.credentialId) {
      const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
      this.state.credentialId = `K8S-BC-${randomHex}-A7C8-${new Date().getFullYear()}`;
      this.saveState();
    }
    const credIdEl = document.getElementById("certCredentialId");
    if (credIdEl) credIdEl.textContent = this.state.credentialId;

    // Data por extenso
    const dateFormatted = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
    const dateEl = document.getElementById("certDate");
    if (dateEl) dateEl.textContent = dateFormatted;

    // Aplicar tema salvo
    this.applyCertTheme(this.state.certTheme || "classic");

    document.getElementById("certModal").classList.add("open");
  }

  toggleCertTheme() {
    const currentTheme = this.state.certTheme || "classic";
    const nextTheme = currentTheme === "classic" ? "cyber" : "classic";
    this.state.certTheme = nextTheme;
    this.applyCertTheme(nextTheme);
    this.saveState();
  }

  applyCertTheme(theme) {
    const frame = document.getElementById("certificateFrame");
    const label = document.getElementById("certThemeLabel");
    if (!frame) return;

    if (theme === "cyber") {
      frame.classList.remove("cert-theme-classic");
      frame.classList.add("cert-theme-cyber");
      if (label) label.textContent = "Dark Cyber CNCF";
    } else {
      frame.classList.remove("cert-theme-cyber");
      frame.classList.add("cert-theme-classic");
      if (label) label.textContent = "Dourado Imperial";
    }
  }

  downloadCertificateHtml() {
    const frame = document.getElementById("certificateFrame");
    if (!frame) return;

    const stylesText = document.querySelector("link[href='styles.css']") ? 
      Array.from(document.styleSheets).map(sheet => {
        try {
          return Array.from(sheet.cssRules).map(rule => rule.cssText).join("\n");
        } catch(e) { return ""; }
      }).join("\n") : "";

    const certHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Certificado Kubernetes Bootcamp — ${this.state.userName}</title>
  <style>
    ${stylesText}
    body {
      background: #0b0f19;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
  </style>
</head>
<body>
  ${frame.outerHTML}
</body>
</html>`;

    const blob = new Blob([certHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Certificado_Kubernetes_Bootcamp_${this.state.userName.replace(/\s+/g, "_")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast("Certificado HTML baixado com sucesso!");
  }

  closeCertModal() {
    document.getElementById("certModal").classList.remove("open");
  }

  resetProgress() {
    if (confirm("Tem certeza de que deseja reiniciar todo o seu progresso, XP e medalhas?")) {
      localStorage.removeItem("k8s_bootcamp_state_v1");
      this.state = this.loadState();
      this.initUI();
      this.renderModule(1);
      this.updateGamificationUI();
      this.showToast("Progresso reiniciado com sucesso.");
    }
  }

  showToast(message, isSpecial = false) {
    const existing = document.querySelector(".toast-notification");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.right = "24px";
    toast.style.backgroundColor = isSpecial ? "#f59e0b" : "#326ce5";
    toast.style.color = "#fff";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 8px 24px rgba(0,0,0,0.5)";
    toast.style.fontSize = "13px";
    toast.style.fontWeight = "700";
    toast.style.zIndex = "9999";
    toast.style.animation = "fadeIn 0.3s ease";
    toast.textContent = message;

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3500);
  }

  escapeQuotes(str) {
    return str.replace(/'/g, "\\'");
  }
}

// Inicializar aplicativo
let app;
window.addEventListener("DOMContentLoaded", () => {
  app = new K8sStudyApp();
});

// Métodos de Controle do Modal de Zoom do QR Code
K8sStudyApp.prototype.openQrZoomModal = function() {
  const modal = document.getElementById("qrZoomModal");
  if (modal) modal.classList.add("open");
};

K8sStudyApp.prototype.closeQrZoomModal = function() {
  const modal = document.getElementById("qrZoomModal");
  if (modal) modal.classList.remove("open");
};

// Listener para fechar ao clicar no backdrop do zoom modal
window.addEventListener("click", function(e) {
  const zModal = document.getElementById("qrZoomModal");
  if (e.target === zModal) {
    zModal.classList.remove("open");
  }
});
