import Link from "next/link";

const activities = [
  { label: "Upload 2 documents", progress: "1 / 2", percent: 50, tone: "gold" },
  { label: "Complete 3 study segments", progress: "2 / 3", percent: 66, tone: "teal" },
  { label: "Pass today's challenge", progress: "Ready", percent: 0, tone: "coral" },
];

const sessions = [
  { title: "Cognitive Psychology", meta: "Normal pace / Feynman", progress: 72, time: "18 min left" },
  { title: "The Art of Statistics", meta: "Brief pace / Spaced repetition", progress: 34, time: "42 min left" },
];

export default function Home() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark" aria-label="IntellectXP home">
          <span className="brand-symbol">ix</span>
          <span>intellect<span>xp</span></span>
        </div>

        <nav className="primary-nav" aria-label="Primary navigation">
          <a className="nav-item active" href="#overview"><span className="nav-icon">+</span>Overview</a>
          <a className="nav-item" href="#sessions"><span className="nav-icon">[]</span>Study sessions</a>
          <a className="nav-item" href="#library"><span className="nav-icon">/</span>Document library</a>
          <a className="nav-item" href="#review"><span className="nav-icon">~</span>Review queue</a>
        </nav>

        <div className="sidebar-bottom">
          <div className="streak-card">
            <div className="streak-topline"><span className="flame">*</span><span>7 day streak</span></div>
            <p>Keep your rhythm alive.</p>
            <div className="week-dots" aria-label="Seven day streak">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span className={index < 6 ? "day-dot done" : "day-dot"} key={`${day}-${index}`}>{day}</span>)}
            </div>
          </div>
          <a className="profile-link" href="#profile"><span className="avatar">MC</span><span><strong>Maya Chen</strong><small>Level 8 learner</small></span><span className="chevron">&gt;</span></a>
        </div>
      </aside>

      <section className="content-area">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><span>/</span><strong>Overview</strong></div>
          <div className="top-actions"><button className="icon-button" aria-label="Search">?</button><button className="icon-button notification" aria-label="Notifications">!</button><span className="plan-pill">PRO</span></div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <p className="eyebrow">THURSDAY, OCTOBER 1, 2026</p>
              <h1>Good morning, Maya<span>.</span></h1>
              <p className="intro">Your ideas are waiting for a little momentum.</p>
            </div>
            <Link className="primary-button" href="/sessions/new"><span>+</span> New study session</Link>
          </section>

          <section className="stats-grid" aria-label="Learning progress">
            <article className="stat-card feature-stat"><div className="stat-label">CURRENT LEVEL <span className="info">i</span></div><div className="stat-value">08</div><div className="level-track"><span /></div><div className="stat-foot"><span>1,240 XP</span><span>2,000 XP to level 9</span></div></article>
            <article className="stat-card"><div className="stat-label">WEEKLY FOCUS</div><div className="stat-value">4.6<span className="stat-unit"> hrs</span></div><div className="stat-trend">+18% <span>vs last week</span></div></article>
            <article className="stat-card"><div className="stat-label">CONCEPTS MASTERED</div><div className="stat-value">38</div><div className="stat-trend neutral">12 this week</div></article>
          </section>

          <section className="dashboard-grid">
            <div className="main-column">
              <div className="section-heading" id="sessions"><div><p className="eyebrow">PICK UP WHERE YOU LEFT OFF</p><h2>Active sessions</h2></div><a href="#all-sessions">View all <span>&gt;</span></a></div>
              <div className="session-list">
                {sessions.map((session, index) => <article className="session-card" key={session.title}><div className={`session-accent accent-${index + 1}`} /><div className="session-body"><div className="session-title-row"><div><span className="session-kicker">SESSION 0{index + 1}</span><h3>{session.title}</h3><p>{session.meta}</p></div><button className="more-button" aria-label={`More options for ${session.title}`}>...</button></div><div className="progress-row"><div className="progress-track"><span style={{ width: `${session.progress}%` }} /></div><strong>{session.progress}%</strong><span>{session.time}</span></div></div></article>)}
              </div>

              <div className="section-heading library-heading" id="library"><div><p className="eyebrow">YOUR KNOWLEDGE BASE</p><h2>Document library</h2></div><a href="#library">Manage library <span>&gt;</span></a></div>
              <div className="upload-panel"><div className="upload-icon">+</div><div><h3>Bring something new to learn</h3><p>Upload a PDF, presentation, Word file, or plain text. We&apos;ll turn it into a structured study space.</p></div><button className="secondary-button">Upload document</button></div>
            </div>

            <aside className="right-column">
              <section className="challenge-panel"><div className="challenge-header"><div><p className="eyebrow light">TODAY&apos;S ROUTE</p><h2>Daily activities</h2></div><span className="date-badge">01<br /><small>OCT</small></span></div><div className="activity-list">{activities.map((activity) => <div className="activity" key={activity.label}><div className="activity-line"><span>{activity.label}</span><strong>{activity.progress}</strong></div><div className={`activity-track ${activity.tone}`}><span style={{ width: `${activity.percent}%` }} /></div></div>)}</div><Link className="challenge-button" href="/assessments">Open daily challenge <span>&gt;</span></Link></section>
              <section className="tools-panel" id="review"><div className="section-heading"><div><p className="eyebrow">STUDY TOOLS</p><h2>Quick review</h2></div><span className="tool-count">12 due</span></div><div className="tool-row"><span className="tool-icon cards">[]</span><span><strong>Flashcards</strong><small>12 cards due today</small></span><span className="chevron">&gt;</span></div><div className="tool-row"><span className="tool-icon test">?</span><span><strong>Milestone tests</strong><small>2 tests ready to take</small></span><span className="chevron">&gt;</span></div></section>
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}
