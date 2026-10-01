"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type Pace = "BRIEF" | "NORMAL" | "COMPLEX";
type ToolTab = "flashcards" | "tests" | "notes";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

const documents = [
  { id: "cognitive-psychology", title: "Cognitive Psychology", detail: "PDF / 42 pages", accent: "gold" },
  { id: "attention-notes", title: "Attention & Memory notes", detail: "DOCX / 8 pages", accent: "teal" },
  { id: "statistics", title: "The Art of Statistics", detail: "PPTX / 28 slides", accent: "coral" },
  { id: "feynman-guide", title: "Feynman technique guide", detail: "TXT / 4 pages", accent: "blue" },
];

const methods = [
  { id: "SPACED_REPETITION", name: "Spaced repetition", description: "Build durable recall with timed reviews.", symbol: "01" },
  { id: "POMODORO", name: "Pomodoro", description: "Alternate focused work with short breaks.", symbol: "25" },
  { id: "FEYNMAN", name: "Feynman technique", description: "Explain concepts simply to expose gaps.", symbol: "F" },
];

const initialMessages: ChatMessage[] = [
  { role: "assistant", content: "I have your selected sources ready. We can map the big ideas first, then test your recall as we go." },
];

export default function NewStudySession() {
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>(["cognitive-psychology", "attention-notes"]);
  const [pace, setPace] = useState<Pace>("NORMAL");
  const [method, setMethod] = useState("FEYNMAN");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [messageDraft, setMessageDraft] = useState("");
  const [activeTool, setActiveTool] = useState<ToolTab>("flashcards");
  const [isStarted, setIsStarted] = useState(false);

  function toggleDocument(documentId: string) {
    setSelectedDocumentIds((currentIds) => currentIds.includes(documentId)
      ? currentIds.filter((currentId) => currentId !== documentId)
      : [...currentIds, documentId]);
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedDraft = messageDraft.trim();
    if (!trimmedDraft) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      { role: "user", content: trimmedDraft },
      { role: "assistant", content: "I will use the selected sources and your session settings to shape the next explanation." },
    ]);
    setMessageDraft("");
  }

  return (
    <main className="session-shell">
      <header className="session-topbar">
        <Link className="session-brand" href="/">intellect<span>xp</span></Link>
        <div className="session-breadcrumb"><Link href="/">Overview</Link><span>/</span><strong>New study session</strong></div>
        <Link className="session-exit" href="/">Exit workspace</Link>
      </header>

      <div className="session-layout">
        <aside className="session-setup">
          <div className="session-heading"><p className="eyebrow">SESSION SETUP</p><h1>Build your study space<span>.</span></h1><p>Choose the sources and rhythm that will guide this conversation.</p></div>

          <section className="setup-section">
            <div className="setup-label"><span>01</span><div><strong>Source documents</strong><small>{selectedDocumentIds.length} selected</small></div></div>
            <div className="document-options">
              {documents.map((document) => {
                const isSelected = selectedDocumentIds.includes(document.id);
                return <button className={`document-option ${isSelected ? "selected" : ""}`} key={document.id} onClick={() => toggleDocument(document.id)} aria-pressed={isSelected}><span className={`document-mark ${document.accent}`}>{isSelected ? "OK" : "+"}</span><span><strong>{document.title}</strong><small>{document.detail}</small></span><span className="document-check">{isSelected ? "✓" : ""}</span></button>;
              })}
            </div>
          </section>

          <section className="setup-section">
            <div className="setup-label"><span>02</span><div><strong>Explanation level</strong><small>How the AI should teach</small></div></div>
            <div className="segmented-control" role="group" aria-label="Explanation level">
              {(["BRIEF", "NORMAL", "COMPLEX"] as Pace[]).map((paceOption) => <button className={pace === paceOption ? "selected" : ""} key={paceOption} onClick={() => setPace(paceOption)}>{paceOption.charAt(0) + paceOption.slice(1).toLowerCase()}</button>)}
            </div>
          </section>

          <section className="setup-section method-section">
            <div className="setup-label"><span>03</span><div><strong>Study method</strong><small>How you want to practice</small></div></div>
            <div className="method-options">
              {methods.map((studyMethod) => <button className={`method-option ${method === studyMethod.id ? "selected" : ""}`} key={studyMethod.id} onClick={() => setMethod(studyMethod.id)}><span className="method-symbol">{studyMethod.symbol}</span><span><strong>{studyMethod.name}</strong><small>{studyMethod.description}</small></span><span className="method-radio" /></button>)}
            </div>
          </section>

          <button className="start-session-button" disabled={selectedDocumentIds.length === 0} onClick={() => setIsStarted(true)}>{isStarted ? "Session ready" : "Start study session"}<span>&gt;</span></button>
        </aside>

        <section className="session-workspace">
          <div className="workspace-toolbar"><div><p className="eyebrow">LIVE STUDY SPACE</p><h2>Cognitive Psychology <span className="status-dot" /> </h2></div><div className="workspace-meta"><span>{selectedDocumentIds.length} sources</span><span>{pace.toLowerCase()} level</span><span>{methods.find((studyMethod) => studyMethod.id === method)?.name}</span></div></div>
          <div className="chat-surface">
            <div className="chat-scroll">
              <div className="chat-date">SESSION OPENED JUST NOW</div>
              {messages.map((message, index) => <div className={`message-row ${message.role}`} key={`${message.role}-${index}`}><span className="message-avatar">{message.role === "assistant" ? "ix" : "MC"}</span><div className="message-bubble"><small>{message.role === "assistant" ? "IntellectXP" : "You"}</small><p>{message.content}</p></div></div>)}
            </div>
            <form className="chat-composer" onSubmit={sendMessage}><button type="button" className="composer-add" aria-label="Attach document">+</button><input value={messageDraft} onChange={(event) => setMessageDraft(event.target.value)} placeholder="Ask about your sources..." aria-label="Message" /><button className="send-button" type="submit" aria-label="Send message">&gt;</button></form>
          </div>
        </section>

        <aside className="session-tools">
          <div className="tools-heading"><p className="eyebrow">SESSION TOOLS</p><h2>Practice as you learn</h2><p>Generated tools stay attached to this study session and its sources.</p></div>
          <div className="tool-tabs" role="tablist" aria-label="Study tools"><button className={activeTool === "flashcards" ? "active" : ""} onClick={() => setActiveTool("flashcards")} role="tab">Flashcards <span>12</span></button><button className={activeTool === "tests" ? "active" : ""} onClick={() => setActiveTool("tests")} role="tab">Tests <span>2</span></button><button className={activeTool === "notes" ? "active" : ""} onClick={() => setActiveTool("notes")} role="tab">Notes</button></div>
          <div className="tool-content">
            {activeTool === "flashcards" && <><div className="tool-callout gold-callout"><span className="large-tool-symbol">[]</span><div><strong>12 cards due today</strong><p>Review the concepts you have been building.</p></div></div><button className="tool-action">Start review <span>&gt;</span></button></>}
            {activeTool === "tests" && <><div className="tool-callout coral-callout"><span className="large-tool-symbol">?</span><div><strong>Module 1 milestone</strong><p>8 questions across 4 question types.</p></div></div><Link className="tool-action" href="/assessments">Take milestone test <span>&gt;</span></Link></>}
            {activeTool === "notes" && <><div className="tool-callout teal-callout"><span className="large-tool-symbol">=</span><div><strong>Session summary</strong><p>Your key ideas will collect here as the chat develops.</p></div></div><button className="tool-action">Generate summary <span>&gt;</span></button></>}
          </div>
          <div className="session-xp"><span>Potential session XP</span><strong>+180 XP</strong><small>Complete the milestone test to claim it.</small></div>
        </aside>
      </div>
    </main>
  );
}
