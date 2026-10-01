"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AssessmentQuestion,
  QuestionAnswer,
  QuestionAttempt,
  createXpIdempotencyKey,
  gradeQuestion,
  xpForQuestion,
} from "@/lib/assessment";

type AssessmentMode = "DAILY_CHALLENGE" | "MILESTONE_TEST";
type MatchAnswer = Record<string, string>;

type AssessmentDefinition = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  questions: AssessmentQuestion[];
};

const assessments: Record<AssessmentMode, AssessmentDefinition> = {
  DAILY_CHALLENGE: {
    id: "daily-route-2026-10-01",
    title: "The all-rounder",
    eyebrow: "DAILY CHALLENGE / 01 OCT",
    description: "Five ways to show what stayed with you today.",
    questions: [
      { id: "daily-match", type: "MATCH", prompt: "Match each learning move to its purpose.", pairs: [{ left: "Retrieval", right: "Recall without notes" }, { left: "Elaboration", right: "Connect to prior ideas" }, { left: "Spacing", right: "Return over time" }], correctAnswer: { Retrieval: "Recall without notes", Elaboration: "Connect to prior ideas", Spacing: "Return over time" }, explanation: "Retrieval, elaboration, and spacing work together: pull knowledge out, connect it, then revisit it.", points: 20, difficulty: "MEDIUM", version: 1 },
      { id: "daily-describe", type: "DESCRIBE", prompt: "In one sentence, describe why active recall beats rereading.", acceptedAnswers: ["retrieval", "recall", "memory"], correctAnswer: "retrieval", explanation: "A strong answer names the act of retrieving knowledge from memory, not simply seeing it again.", points: 25, difficulty: "HARD", version: 1 },
      { id: "daily-true-false", type: "TRUE_FALSE", prompt: "A study session should only use one document at a time.", options: ["True", "False"], correctAnswer: "False", explanation: "A session can combine related sources when citations and document boundaries remain clear.", points: 15, difficulty: "EASY", version: 1 },
      { id: "daily-single", type: "SINGLE_CHOICE", prompt: "Which method asks you to explain a concept in plain language?", options: ["Pomodoro", "Feynman technique", "Spaced repetition", "Interleaving"], correctAnswer: "Feynman technique", explanation: "The Feynman technique exposes gaps by making you explain an idea simply.", points: 15, difficulty: "EASY", version: 1 },
      { id: "daily-multiple", type: "MULTIPLE_CHOICE", prompt: "Which two actions strengthen a review session?", options: ["Hide the answer before recalling", "Connect the idea to an example", "Read the same paragraph five times", "Review only once"], correctAnswer: ["Hide the answer before recalling", "Connect the idea to an example"], explanation: "Retrieval plus a concrete connection creates a more useful memory trace.", points: 25, difficulty: "MEDIUM", version: 1 },
    ],
  },
  MILESTONE_TEST: {
    id: "cognitive-psychology-module-1",
    title: "Cognitive Psychology / Module 1",
    eyebrow: "MILESTONE TEST / MODULE 1",
    description: "A focused check across the ideas in your active study session.",
    questions: [
      { id: "milestone-single", type: "SINGLE_CHOICE", prompt: "What does working memory primarily help you do?", options: ["Store every memory permanently", "Hold and manipulate information briefly", "Sleep more deeply", "Avoid all distractions"], correctAnswer: "Hold and manipulate information briefly", explanation: "Working memory is the limited mental workspace used to hold and manipulate information.", points: 30, difficulty: "MEDIUM", version: 1 },
      { id: "milestone-describe", type: "DESCRIBE", prompt: "Describe one practical way to reduce cognitive load while learning.", acceptedAnswers: ["chunk", "break", "segment", "simplify", "remove", "organize"], correctAnswer: "chunk", explanation: "Chunking, organizing, and removing unnecessary load all make the working set easier to manage.", points: 30, difficulty: "HARD", version: 1 },
      { id: "milestone-multiple", type: "MULTIPLE_CHOICE", prompt: "Which are examples of encoding strategies?", options: ["Elaboration", "Dual coding", "Ignoring feedback", "Making a useful analogy"], correctAnswer: ["Elaboration", "Dual coding", "Making a useful analogy"], explanation: "Encoding improves when new information is connected, represented, and made meaningful.", points: 30, difficulty: "MEDIUM", version: 1 },
    ],
  },
};

export default function AssessmentsPage() {
  const [mode, setMode] = useState<AssessmentMode>("DAILY_CHALLENGE");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState<QuestionAnswer>("");
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [awardedKeys, setAwardedKeys] = useState<string[]>([]);
  const [earnedXp, setEarnedXp] = useState(0);

  const assessment = assessments[mode];
  const question = assessment.questions[questionIndex];
  const currentAttempt = attempts.find((attempt) => attempt.questionId === question.id);
  const isComplete = questionIndex >= assessment.questions.length;
  const progress = Math.min((questionIndex / assessment.questions.length) * 100, 100);

  function changeMode(nextMode: AssessmentMode) {
    setMode(nextMode);
    setQuestionIndex(0);
    setAnswer("");
    setAttempts([]);
    setFeedback(null);
    setAwardedKeys([]);
    setEarnedXp(0);
  }

  function submitAnswer() {
    if (isComplete || currentAttempt) return;
    const result = gradeQuestion(question, answer);
    const attempt: QuestionAttempt = { id: `${question.id}-${Date.now()}`, questionId: question.id, answer, isCorrect: result.isCorrect, pointsEarned: result.pointsEarned, createdAt: new Date().toISOString() };
    const xpKey = createXpIdempotencyKey("demo-user", mode, assessment.id, question.id);
    setAttempts((currentAttempts) => [...currentAttempts, attempt]);
    setFeedback(result.feedback);
    if (result.isCorrect && !awardedKeys.includes(xpKey)) {
      setAwardedKeys((currentKeys) => [...currentKeys, xpKey]);
      setEarnedXp((currentXp) => currentXp + xpForQuestion(question, true));
    }
  }

  function nextQuestion() {
    setQuestionIndex((currentIndex) => currentIndex + 1);
    setAnswer("");
    setFeedback(null);
  }

  function setMultipleChoice(option: string) {
    const currentAnswer = Array.isArray(answer) ? answer : [];
    setAnswer(currentAnswer.includes(option) ? currentAnswer.filter((value) => value !== option) : [...currentAnswer, option]);
  }

  function setMatchAnswer(left: string, right: string) {
    const currentAnswer: MatchAnswer = typeof answer === "object" && !Array.isArray(answer) ? answer : {};
    setAnswer({ ...currentAnswer, [left]: right });
  }

  return (
    <main className="assessment-shell">
      <header className="assessment-topbar"><Link className="session-brand" href="/">intellect<span>xp</span></Link><div className="session-breadcrumb"><Link href="/">Overview</Link><span>/</span><strong>Assessments</strong></div><Link className="session-exit" href="/">Exit</Link></header>
      <div className="assessment-layout">
        <aside className="assessment-sidebar"><p className="eyebrow">TEST CENTER</p><h1>Prove what stayed<span>.</span></h1><p className="assessment-intro">Small checks turn a study session into knowledge you can carry.</p><div className="assessment-switcher"><button className={mode === "DAILY_CHALLENGE" ? "active" : ""} onClick={() => changeMode("DAILY_CHALLENGE")}><span className="assessment-type-icon gold">D</span><span><strong>Daily challenge</strong><small>5 question types</small></span><span className="switcher-arrow">&gt;</span></button><button className={mode === "MILESTONE_TEST" ? "active" : ""} onClick={() => changeMode("MILESTONE_TEST")}><span className="assessment-type-icon coral">M</span><span><strong>Milestone test</strong><small>Module 1 / 3 questions</small></span><span className="switcher-arrow">&gt;</span></button></div><div className="xp-summary"><span>XP earned this run</span><strong>+{earnedXp} XP</strong><small>Each question has one idempotent reward key.</small></div></aside>
        <section className="assessment-main">
          <div className="assessment-heading"><div><p className="eyebrow">{assessment.eyebrow}</p><h2>{assessment.title}</h2><p>{assessment.description}</p></div><div className="assessment-score"><strong>{earnedXp}</strong><span>XP earned</span></div></div>
          <div className="assessment-progress"><div><span>QUESTION {Math.min(questionIndex + 1, assessment.questions.length)} OF {assessment.questions.length}</span><strong>{Math.round(progress)}%</strong></div><div className="assessment-progress-track"><span style={{ width: `${progress}%` }} /></div></div>
          {isComplete ? <div className="assessment-complete"><span className="complete-mark">OK</span><p className="eyebrow">ASSESSMENT COMPLETE</p><h3>That knowledge has somewhere to go.</h3><p>You earned {earnedXp} XP. Attempts are kept separate from the question definitions so this result can be audited and rescored.</p><button className="assessment-next" onClick={() => changeMode(mode)}>Run it again <span>&gt;</span></button></div> : <div className="question-card"><div className="question-type-row"><span className="question-type">{question.type.replaceAll("_", " ")}</span><span>{question.points} points / {question.difficulty.toLowerCase()}</span></div><h3>{question.prompt}</h3><QuestionInput question={question} answer={answer} disabled={Boolean(currentAttempt)} onAnswer={setAnswer} onMultipleChoice={setMultipleChoice} onMatch={setMatchAnswer} />{feedback && <div className={`answer-feedback ${currentAttempt?.isCorrect ? "correct" : "incorrect"}`}><strong>{currentAttempt?.isCorrect ? "Correct" : "Keep this idea close"}</strong><p>{feedback}</p></div>}<div className="question-footer"><span>{currentAttempt ? "Attempt recorded" : "Your answer is saved when you submit."}</span>{currentAttempt ? <button className="assessment-next" onClick={nextQuestion}>{questionIndex === assessment.questions.length - 1 ? "See results" : "Next question"} <span>&gt;</span></button> : <button className="assessment-submit" onClick={submitAnswer} disabled={!hasAnswer(question, answer)}>Check answer <span>&gt;</span></button>}</div></div>}
        </section>
      </div>
    </main>
  );
}

function hasAnswer(question: AssessmentQuestion, answer: QuestionAnswer) {
  if (question.type === "MATCH") return typeof answer === "object" && !Array.isArray(answer) && Object.keys(answer).length === question.pairs?.length;
  if (question.type === "MULTIPLE_CHOICE") return Array.isArray(answer) && answer.length > 0;
  return typeof answer === "string" && answer.trim().length > 0;
}

function QuestionInput({ question, answer, disabled, onAnswer, onMultipleChoice, onMatch }: { question: AssessmentQuestion; answer: QuestionAnswer; disabled: boolean; onAnswer: (answer: QuestionAnswer) => void; onMultipleChoice: (option: string) => void; onMatch: (left: string, right: string) => void }) {
  if (question.type === "DESCRIBE") return <textarea className="describe-input" value={typeof answer === "string" ? answer : ""} onChange={(event) => onAnswer(event.target.value)} disabled={disabled} placeholder="Write a short explanation in your own words..." />;
  if (question.type === "MATCH") {
    const matchAnswer = typeof answer === "object" && !Array.isArray(answer) ? answer : {};
    return <div className="match-options">{question.pairs?.map((pair) => <label key={pair.left}><span>{pair.left}</span><select value={matchAnswer[pair.left] ?? ""} onChange={(event) => onMatch(pair.left, event.target.value)} disabled={disabled}><option value="">Choose a match</option>{question.pairs?.map((matchPair) => <option key={matchPair.right} value={matchPair.right}>{matchPair.right}</option>)}</select></label>)}</div>;
  }
  return <div className="answer-options">{question.options?.map((option) => { const isSelected = Array.isArray(answer) ? answer.includes(option) : answer === option; return <button className={isSelected ? "selected" : ""} key={option} onClick={() => question.type === "MULTIPLE_CHOICE" ? onMultipleChoice(option) : onAnswer(option)} disabled={disabled} aria-pressed={isSelected}><span className="answer-marker">{isSelected ? "✓" : question.type === "MULTIPLE_CHOICE" ? "" : ""}</span>{option}</button>; })}</div>;
}
