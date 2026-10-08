"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { BotanicalBackdrop } from "@/components/ui/BotanicalBackdrop";
import { Envelope3D } from "@/components/three/Envelope3D";
import { entranceQuestions, journeyLocations, memories, loveReasons } from "@/data/story";
import { ScrollTrigger } from "@/lib/animation";

type EntrancePhase = "checking" | "sealed" | "question" | "unlocking" | "loading" | "unlocked";
const blockedKeys = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "End", "Home", " "]);
const photos = [...new Set([
  "/api/story-photo/hero/couple-hero.webp",
  "/api/story-photo/story/paths-crossed.webp",
  ...journeyLocations.map((item) => item.image),
  ...memories.map((item) => item.image),
  ...loveReasons.map((item) => item.image),
  "/api/story-photo/ending/final-couple.webp",
])];

export function OpeningScene() {
  const [phase, setPhase] = useState<EntrancePhase>("checking");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [failed, setFailed] = useState(0);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const isLocked = phase !== "unlocked";
  const question = entranceQuestions[questionIndex];
  const loadingProgress = loaded / photos.length;

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams(window.location.search);
    const reset = params.get("resetStory") === "1";
    if (reset) {
      params.delete("resetStory");
      const query = params.toString();
      history.replaceState(null, "", `${location.pathname}${query ? `?${query}` : ""}`);
    }
    (async () => {
      try {
        if (reset) await fetch("/api/story-session", { method: "DELETE", cache: "no-store" });
        const response = await fetch("/api/story-session", { cache: "no-store" });
        const result = await response.json();
        if (!cancelled) {
          setQuestionIndex(result.stage === 1 ? 1 : 0);
          setPhase(result.stage === 2 ? "loading" : result.stage === 1 ? "question" : "sealed");
        }
      } catch { if (!cancelled) setPhase("sealed"); }
      document.body.classList.remove("story-booting");
    })();
    return () => { cancelled = true; };
  }, []);

  const revealStory = useCallback(() => {
    document.body.classList.add("story-ready");
    window.dispatchEvent(new Event("birthday-story-ready-change"));
    setPhase("unlocked");
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;
    let cancelled = false;
    let count = 0;
    let errors = 0;
    const started = performance.now();
    let revealTimer: number | undefined;
    const loadPhoto = (src: string) => new Promise<void>((resolve) => {
      const image = new window.Image();
      image.onload = () => { if (!cancelled) setLoaded(++count); resolve(); };
      image.onerror = () => { if (!cancelled) { errors++; setLoaded(++count); } resolve(); };
      image.src = src;
    });
    (async () => {
      for (let index = 0; index < photos.length; index += 4) {
        await Promise.all(photos.slice(index, index + 4).map(loadPhoto));
        if (cancelled) return;
      }
      if (errors) setFailed(errors);
      else revealTimer = window.setTimeout(() => {
        if (!cancelled) revealStory();
      }, Math.max(400, 2800 - (performance.now() - started)));
    })();
    return () => { cancelled = true; window.clearTimeout(revealTimer); };
  }, [phase, loadAttempt, revealStory]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.toggle("story-locked", isLocked);
    body.classList.toggle("story-locked", isLocked);
    window.dispatchEvent(new Event("birthday-story-lock-change"));
    if (!isLocked) return;

    if (location.hash) history.replaceState(null, "", `${location.pathname}${location.search}`);
    window.scrollTo(0, 0);
    const stop = (event: Event) => { if (!(event.target instanceof Element && event.target.closest("input, .question-card, .music-card"))) event.preventDefault(); };
    const stopKey = (event: KeyboardEvent) => { if (blockedKeys.has(event.key) && !(event.target instanceof Element && event.target.closest("input, button"))) event.preventDefault(); };
    const keepAtTop = () => window.scrollTo(0, 0);
    window.addEventListener("wheel", stop, { passive: false });
    window.addEventListener("touchmove", stop, { passive: false });
    window.addEventListener("keydown", stopKey);
    window.addEventListener("hashchange", keepAtTop);
    return () => {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
      window.removeEventListener("keydown", stopKey);
      window.removeEventListener("hashchange", keepAtTop);
    };
  }, [isLocked]);

  useEffect(() => {
    if (phase !== "unlocked") return;
    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
      document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === "question") window.setTimeout(() => {
      window.scrollTo(0, 0);
      inputRef.current?.focus({ preventScroll: true });
    }, 500);
  }, [phase, questionIndex]);

  function beginEntrance() {
    if (phase === "sealed") {
      window.dispatchEvent(new Event("birthday-story-music-start"));
      setPhase("question");
    }
  }

  async function submitAnswer(event: FormEvent) {
    event.preventDefault();
    let result: { stage?: number; correct?: boolean; error?: string } = {};
    try {
      const response = await fetch("/api/story-session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answer }), cache: "no-store" });
      result = await response.json();
    } catch { setFeedback("Connection lost. Please try again."); return; }
    if (!result.correct) {
      setFeedback(result.error ?? question.hint);
      setShake((value) => value + 1);
      return;
    }
    // A resumed session may enter directly at the private question, so start music
    // from this final answer gesture as well as from the initial Open button.
    if ((result.stage ?? 0) >= entranceQuestions.length) {
      window.dispatchEvent(new Event("birthday-story-music-start"));
    }
    setSuccess(true);
    setFeedback(question.successMessage);
    window.setTimeout(() => {
      if ((result.stage ?? 0) < entranceQuestions.length) {
        setQuestionIndex(result.stage ?? 0);
        setAnswer("");
        setFeedback("");
        setSuccess(false);
        return;
      }
      setPhase("unlocking");
      window.setTimeout(() => setPhase("loading"), 1400);
    }, 850);
  }

  return (
    <section className={`scene opening-scene phase-${phase}`} data-scene="1" id="opening">
      <BotanicalBackdrop />
      <div className="opening-copy">
        <p className="eyebrow">01 / FOR YOU</p>
        <h1>For You</h1>
        <p>A small piece of our story.</p>
      </div>
      <div className="envelope-stage" aria-hidden="true">
        <Canvas camera={{ position: [0, 0.65, 7.8], fov: 36 }} dpr={[1, 1.55]} shadows>
          <ambientLight intensity={1.2} />
          <directionalLight position={[4, 6, 6]} intensity={1.8} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0005} />
          <Envelope3D stage={phase === "checking" ? "sealed" : phase} />
          <ContactShadows position={[0, -1.55, 0]} opacity={0.16} scale={7} blur={2.4} />
        </Canvas>
      </div>
      {phase === "sealed" && <button type="button" className="primary-pill entrance-open" onClick={beginEntrance}>Open <span aria-hidden="true">→</span></button>}
      {phase === "checking" && <p className="entrance-checking" role="status">Preparing your story…</p>}
      {phase === "question" && (
        <div className={`question-card ${success ? "is-success" : ""}`}>
            <form key={`${question.id}-${shake}`} onSubmit={submitAnswer} className={feedback && !success ? "is-wrong" : ""}>
              <p className="eyebrow">PRIVATE QUESTION {String(questionIndex + 1).padStart(2, "0")} / {String(entranceQuestions.length).padStart(2, "0")}</p>
              <label htmlFor="private-answer">{question.question}</label>
              <div className="answer-line">
                <input ref={inputRef} id="private-answer" name="private-answer" value={answer} onChange={(event) => { setAnswer(event.target.value); setFeedback(""); }} autoComplete="off" spellCheck={false} aria-describedby="answer-feedback" />
                <button type="submit" aria-label="Submit answer">{success ? "✓" : "→"}</button>
              </div>
              <p id="answer-feedback" className="answer-feedback" aria-live="polite">{feedback || "This is just between us."}</p>
            </form>
        </div>
      )}
      {phase === "unlocking" && <p className="opening-status" role="status">Our story is opening…</p>}
      {phase === "loading" && <div className="story-loading" role="status" aria-live="polite"><p className="eyebrow">OUR STORY IS UNFOLDING</p><div className="memory-loading-track" role="progressbar" aria-label="Loading memories" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(loadingProgress * 100)}><span style={{ transform: `scaleX(${loadingProgress})` }} /></div><p>{failed ? `${failed} photographs could not load. Please try again.` : `${Math.round(loadingProgress * 100)}% of our memories are ready`}</p>{failed > 0 && <div className="story-loading-actions"><button type="button" onClick={() => { setFailed(0); setLoaded(0); setLoadAttempt((value) => value + 1); }}>Retry photos</button><button type="button" onClick={revealStory}>Continue anyway</button></div>}</div>}
      {phase === "unlocked" && <div className="entrance-unlocked-note"><a href="#hero">Our story begins <span aria-hidden="true">↓</span></a></div>}
    </section>
  );
}
