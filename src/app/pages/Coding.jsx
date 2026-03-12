import { useState, useEffect, useRef } from "react";

const LANGUAGES = [
  { id: "python", label: "Python", monaco: "python", starter: 'def solution():\n    # Write your solution here\n    pass\n' },
  { id: "javascript", label: "JavaScript", monaco: "javascript", starter: 'function solution() {\n  // Write your solution here\n}\n' },
  { id: "java", label: "Java", monaco: "java", starter: 'public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n' },
  { id: "cpp", label: "C++", monaco: "cpp", starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n' },
];

const QUESTIONS = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

**Example:**
- Input: nums = [2, 7, 11, 15], target = 9
- Output: [0, 1]
- Explanation: nums[0] + nums[1] = 2 + 7 = 9`,
    tags: ["Array", "Hash Map"],
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.

**Example:**
- Input: s = "()[]{}"
- Output: true
- Input: s = "(]"
- Output: false`,
    tags: ["Stack", "String"],
  },
  {
    id: 3,
    title: "Reverse Linked List",
    difficulty: "Medium",
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.

**Example:**
- Input: head = [1, 2, 3, 4, 5]
- Output: [5, 4, 3, 2, 1]

Implement both iterative and recursive solutions if possible.`,
    tags: ["Linked List", "Recursion"],
  },
  {
    id: 4,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.

**Example:**
- Input: s = "abcabcbb"
- Output: 3
- Explanation: The answer is "abc", with the length of 3.

**Constraints:** 0 <= s.length <= 5 * 10^4`,
    tags: ["Sliding Window", "Hash Set"],
  },
];

const DIFFICULTY_COLORS = {
  Easy: { bg: "#0d2e1a", text: "#4ade80", border: "#166534" },
  Medium: { bg: "#2d1f00", text: "#fbbf24", border: "#92400e" },
  Hard: { bg: "#2d0a0a", text: "#f87171", border: "#991b1b" },
};

// Monaco loader
function loadMonaco() {
  return new Promise((resolve) => {
    if (window.monaco) { resolve(window.monaco); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js";
    script.onload = () => {
      window.require.config({ paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs" } });
      window.require(["vs/editor/editor.main"], (monaco) => { resolve(monaco); });
    };
    document.head.appendChild(script);
  });
}

function MarkdownText({ text }) {
  const lines = text.split("\n");
  return (
    <div style={{ lineHeight: 1.7 }}>
      {lines.map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**")) {
          return <p key={i} style={{ fontWeight: 700, color: "#e2e8f0", margin: "8px 0 4px" }}>{line.slice(2, -2)}</p>;
        }
        if (line.startsWith("- ")) {
          const content = line.slice(2).replace(/`([^`]+)`/g, (_, c) => `<code style="background:#1e293b;color:#7dd3fc;padding:1px 5px;border-radius:3px;font-family:monospace;font-size:0.85em">${c}</code>`);
          return <li key={i} style={{ color: "#94a3b8", marginLeft: 16, marginBottom: 4 }} dangerouslySetInnerHTML={{ __html: content }} />;
        }
        if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ")) {
          return <li key={i} style={{ color: "#94a3b8", marginLeft: 16, marginBottom: 4 }}>{line.slice(3)}</li>;
        }
        if (!line.trim()) return <br key={i} />;
        const html = line.replace(/`([^`]+)`/g, (_, c) => `<code style="background:#1e293b;color:#7dd3fc;padding:1px 5px;border-radius:3px;font-family:monospace;font-size:0.85em">${c}</code>`).replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#e2e8f0">$1</strong>');
        return <p key={i} style={{ color: "#94a3b8", margin: "4px 0" }} dangerouslySetInnerHTML={{ __html: html }} />;
      })}
    </div>
  );
}

function EvaluationPanel({ evaluation, loading }) {
  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16 }}>
        <div style={{ width: 48, height: 48, border: "3px solid #1e293b", borderTop: "3px solid #6366f1", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "#64748b", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>Analyzing your solution...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, padding: 32 }}>
        <div style={{ fontSize: 40 }}>🤖</div>
        <p style={{ color: "#475569", textAlign: "center", fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>Submit your code to get AI feedback on logic, correctness, code quality, and approach.</p>
      </div>
    );
  }

  const scores = evaluation.scores || {};
  const scoreKeys = ["correctness", "code_quality", "efficiency", "readability"];
  const scoreColors = { 90: "#4ade80", 70: "#fbbf24", 0: "#f87171" };
  const getColor = (v) => v >= 90 ? "#4ade80" : v >= 70 ? "#fbbf24" : "#f87171";

  return (
    <div style={{ padding: "20px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", boxShadow: "0 0 8px #6366f1" }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: 2 }}>AI Evaluation</span>
      </div>

      {/* Overall Score */}
      {evaluation.overall_score !== undefined && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20, marginBottom: 16, textAlign: "center" }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: getColor(evaluation.overall_score), fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>
            {evaluation.overall_score}
          </div>
          <div style={{ color: "#475569", fontSize: 12, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>OVERALL SCORE / 100</div>
        </div>
      )}

      {/* Score Breakdown */}
      {scoreKeys.some(k => scores[k] !== undefined) && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <p style={{ color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>Breakdown</p>
          {scoreKeys.filter(k => scores[k] !== undefined).map(key => (
            <div key={key} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "#64748b", fontSize: 12, textTransform: "capitalize", fontFamily: "'JetBrains Mono', monospace" }}>{key.replace("_", " ")}</span>
                <span style={{ color: getColor(scores[key]), fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{scores[key]}</span>
              </div>
              <div style={{ height: 4, background: "#1e293b", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${scores[key]}%`, background: getColor(scores[key]), borderRadius: 2, transition: "width 0.8s ease" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verdict */}
      {evaluation.verdict && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <p style={{ color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>Verdict</p>
          <p style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.6 }}>{evaluation.verdict}</p>
        </div>
      )}

      {/* Feedback Sections */}
      {["strengths", "issues", "suggestions"].map(section => {
        const items = evaluation[section];
        if (!items || !items.length) return null;
        const icons = { strengths: "✓", issues: "✗", suggestions: "→" };
        const colors = { strengths: "#4ade80", issues: "#f87171", suggestions: "#6366f1" };
        return (
          <div key={section} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <p style={{ color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>{section}</p>
            {items.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <span style={{ color: colors[section], fontFamily: "monospace", marginTop: 1, flexShrink: 0 }}>{icons[section]}</span>
                <span style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        );
      })}

      {/* Time & Space Complexity */}
      {(evaluation.time_complexity || evaluation.space_complexity) && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <p style={{ color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>Complexity Analysis</p>
          {evaluation.time_complexity && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#64748b", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>Time</span>
              <span style={{ color: "#7dd3fc", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>{evaluation.time_complexity}</span>
            </div>
          )}
          {evaluation.space_complexity && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>Space</span>
              <span style={{ color: "#7dd3fc", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>{evaluation.space_complexity}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Coding() {
  const [selectedQuestion, setSelectedQuestion] = useState(QUESTIONS[0]);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].starter);
  const [evaluation, setEvaluation] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("problem"); // problem | evaluation
  const [monacoReady, setMonacoReady] = useState(false);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    loadMonaco().then((monaco) => {
      monacoRef.current = monaco;
      monaco.editor.defineTheme("interview-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "475569", fontStyle: "italic" },
          { token: "keyword", foreground: "818cf8" },
          { token: "string", foreground: "34d399" },
          { token: "number", foreground: "fb923c" },
          { token: "type", foreground: "7dd3fc" },
          { token: "function", foreground: "c084fc" },
        ],
        colors: {
          "editor.background": "#090f1a",
          "editor.foreground": "#e2e8f0",
          "editor.lineHighlightBackground": "#0f172a",
          "editorLineNumber.foreground": "#1e293b",
          "editorLineNumber.activeForeground": "#475569",
          "editor.selectionBackground": "#1e3a5f",
          "editorCursor.foreground": "#6366f1",
          "editorGutter.background": "#090f1a",
        },
      });

      if (containerRef.current) {
        editorRef.current = monaco.editor.create(containerRef.current, {
          value: LANGUAGES[0].starter,
          language: "python",
          theme: "interview-dark",
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontLigatures: true,
          lineNumbers: "on",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 20, bottom: 20 },
          smoothScrolling: true,
          cursorBlinking: "smooth",
          renderLineHighlight: "line",
          contextmenu: false,
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollbar: { vertical: "hidden", horizontal: "hidden" },
          wordWrap: "on",
        });
        editorRef.current.onDidChangeModelContent(() => {
          setCode(editorRef.current.getValue());
        });
        setMonacoReady(true);
      }
    });
    return () => editorRef.current?.dispose();
  }, []);

  const switchLanguage = (lang) => {
    setSelectedLang(lang);
    setCode(lang.starter);
    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel();
      monacoRef.current.editor.setModelLanguage(model, lang.monaco);
      editorRef.current.setValue(lang.starter);
    }
  };

  const switchQuestion = (q) => {
    setSelectedQuestion(q);
    setEvaluation(null);
    setError(null);
    setTab("problem");
  };

  const submitCode = async () => {
    const currentCode = editorRef.current?.getValue() || code;
    if (!currentCode.trim()) return;
    setEvaluating(true);
    setError(null);
    setTab("evaluation");

    const prompt = `You are an expert coding interviewer. Evaluate the following candidate solution.

**Problem:** ${selectedQuestion.title}
**Description:** ${selectedQuestion.description}
**Language:** ${selectedLang.label}
**Candidate's Code:**
\`\`\`${selectedLang.id}
${currentCode}
\`\`\`

Respond ONLY with a valid JSON object (no markdown, no explanation outside JSON):
{
  "overall_score": <0-100>,
  "scores": {
    "correctness": <0-100>,
    "code_quality": <0-100>,
    "efficiency": <0-100>,
    "readability": <0-100>
  },
  "verdict": "<2-3 sentence overall assessment>",
  "time_complexity": "<e.g. O(n)>",
  "space_complexity": "<e.g. O(n)>",
  "strengths": ["<strength1>", "<strength2>"],
  "issues": ["<issue1>", "<issue2>"],
  "suggestions": ["<suggestion1>", "<suggestion2>"]
}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setEvaluation(parsed);
    } catch (err) {
      setError("Evaluation failed. Please try again.");
      setTab("problem");
    } finally {
      setEvaluating(false);
    }
  };

  const diff = DIFFICULTY_COLORS[selectedQuestion.difficulty];

  return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      background: "#050b14", fontFamily: "'Inter', sans-serif", overflow: "hidden",
      color: "#e2e8f0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
        .lang-btn:hover { background: #1e293b !important; }
        .q-item:hover { background: #0f172a !important; border-color: #334155 !important; }
        .submit-btn:hover { background: #4f46e5 !important; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(99,102,241,0.4) !important; }
        .tab:hover { color: #94a3b8 !important; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "0 20px", height: 52, borderBottom: "1px solid #0f172a", background: "#050b14", gap: 16, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>⚡</div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 13, color: "#e2e8f0", letterSpacing: 0.5 }}>CodeInterview.AI</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80" }} />
          <span style={{ color: "#475569", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>Interview in progress</span>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Left Sidebar: Question List */}
        <div style={{ width: 220, borderRight: "1px solid #0f172a", display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}>
          <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid #0f172a" }}>
            <span style={{ color: "#334155", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace" }}>Problems</span>
          </div>
          <div style={{ overflowY: "auto", flex: 1, padding: 8 }}>
            {QUESTIONS.map(q => {
              const d = DIFFICULTY_COLORS[q.difficulty];
              const active = q.id === selectedQuestion.id;
              return (
                <div key={q.id} className="q-item" onClick={() => switchQuestion(q)} style={{
                  padding: "10px 12px", borderRadius: 8, marginBottom: 4, cursor: "pointer",
                  background: active ? "#0f172a" : "transparent",
                  border: `1px solid ${active ? "#1e293b" : "transparent"}`,
                  transition: "all 0.15s",
                }}>
                  <div style={{ fontSize: 12, color: active ? "#e2e8f0" : "#64748b", marginBottom: 4, fontWeight: active ? 600 : 400 }}>{q.title}</div>
                  <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: d.bg, color: d.text, border: `1px solid ${d.border}`, fontFamily: "'JetBrains Mono', monospace" }}>{q.difficulty}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Panel: Problem + Eval Tabs */}
        <div style={{ width: 340, borderRight: "1px solid #0f172a", display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #0f172a", padding: "0 16px" }}>
            {["problem", "evaluation"].map(t => (
              <button key={t} className="tab" onClick={() => setTab(t)} style={{
                background: "none", border: "none", cursor: "pointer", padding: "12px 16px 10px",
                fontSize: 12, fontFamily: "'JetBrains Mono', monospace", textTransform: "capitalize",
                color: tab === t ? "#6366f1" : "#334155",
                borderBottom: tab === t ? "2px solid #6366f1" : "2px solid transparent",
                transition: "all 0.15s",
              }}>{t}{t === "evaluation" && evaluation ? " ✓" : ""}</button>
            ))}
          </div>

          {tab === "problem" ? (
            <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", margin: 0, flex: 1 }}>{selectedQuestion.title}</h2>
                <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 5, background: diff.bg, color: diff.text, border: `1px solid ${diff.border}`, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, marginTop: 2 }}>{selectedQuestion.difficulty}</span>
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                {selectedQuestion.tags.map(tag => (
                  <span key={tag} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "#0f1a2e", color: "#60a5fa", border: "1px solid #1e3a5f", fontFamily: "'JetBrains Mono', monospace" }}>{tag}</span>
                ))}
              </div>
              <MarkdownText text={selectedQuestion.description} />
            </div>
          ) : (
            <EvaluationPanel evaluation={evaluation} loading={evaluating} />
          )}
          {error && <div style={{ padding: "8px 16px", background: "#2d0a0a", color: "#f87171", fontSize: 12, fontFamily: "monospace" }}>{error}</div>}
        </div>

        {/* Right: Editor */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Editor Toolbar */}
          <div style={{ display: "flex", alignItems: "center", padding: "0 16px", height: 44, borderBottom: "1px solid #0f172a", gap: 8, flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {LANGUAGES.map(lang => (
                <button key={lang.id} className="lang-btn" onClick={() => switchLanguage(lang)} style={{
                  padding: "4px 10px", borderRadius: 6, border: `1px solid ${lang.id === selectedLang.id ? "#334155" : "transparent"}`,
                  background: lang.id === selectedLang.id ? "#0f172a" : "transparent",
                  color: lang.id === selectedLang.id ? "#e2e8f0" : "#475569",
                  fontSize: 12, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
                  transition: "all 0.15s",
                }}>{lang.label}</button>
              ))}
            </div>
            <div style={{ flex: 1 }} />
            <button className="submit-btn" onClick={submitCode} disabled={evaluating} style={{
              padding: "6px 20px", borderRadius: 8,
              background: evaluating ? "#1e293b" : "#6366f1",
              color: evaluating ? "#475569" : "#fff",
              border: "none", cursor: evaluating ? "not-allowed" : "pointer",
              fontSize: 13, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace",
              transition: "all 0.2s", letterSpacing: 0.5,
            }}>
              {evaluating ? "Evaluating..." : "Submit →"}
            </button>
          </div>

          {/* Monaco Editor */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            {!monacoReady && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#090f1a", zIndex: 10 }}>
                <span style={{ color: "#334155", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>Loading editor...</span>
              </div>
            )}
            <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}