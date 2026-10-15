"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { BotanicalBackdrop } from "@/components/ui/BotanicalBackdrop";
import { Envelope3D } from "@/components/three/Envelope3D";
import { entranceQuestions, journeyLocations, memories, loveReasons } from "@/data/story";
import { ScrollTrigger } from "@/lib/animation";

type EntrancePhase = "checking" | "sealed" | "question" | "unlocking" | "loading" | "unlocked";
type LoadingGameStep = "intro" | "love" | "love-no1" | "love-no2" | "love-yes" | "marry" | "marry-no" | "proposal-confirm" | "family" | "family-no" | "family-yes" | "commitment" | "won";
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
  const [loadingGameStep, setLoadingGameStep] = useState<LoadingGameStep>("intro");
  const [loveNoCount, setLoveNoCount] = useState(0);
  const [marryNoCount, setMarryNoCount] = useState(0);
  const [familyNoCount, setFamilyNoCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const gameDialogRef = useRef<HTMLElement>(null);
  const isLocked = phase !== "unlocked";
  const question = entranceQuestions[questionIndex];
  const loadingProgress = loaded / photos.length;

  useEffect(() => {
    if (phase === "loading") gameDialogRef.current?.focus({ preventScroll: true });
  }, [phase, loadingGameStep]);

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
    })();
    return () => { cancelled = true; };
  }, [phase, loadAttempt]);

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
      const normalizedAnswer = answer.normalize("NFKC").trim().toLocaleLowerCase().replace(/\s+/g, " ");
      const response = await fetch("/api/story-session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answer: normalizedAnswer }), cache: "no-store" });
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
              <p id="answer-feedback" className={`answer-feedback ${success ? "is-celebrating" : ""}`} aria-live="polite">
                {success && <span className="success-sparkle" aria-hidden="true">✦</span>}
                {feedback || "This is just between us."}
                {success && <span className="success-sparkle" aria-hidden="true">✦</span>}
              </p>
            </form>
        </div>
      )}
      {phase === "unlocking" && <p className="opening-status" role="status">Our story is opening…</p>}
      {phase === "loading" && (
        <>
          <div className="story-loading">
            <p className="eyebrow">OUR STORY IS UNFOLDING</p>
            <div className="memory-loading-track" role="progressbar" aria-label="Loading memories" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(loadingProgress * 100)}><span style={{ transform: `scaleX(${loadingProgress})` }} /></div>
            <p role="status" aria-live="polite">{failed ? `${failed} photographs could not load. Please try again.` : `${Math.round(loadingProgress * 100)}% of our memories are ready`}</p>
            {failed > 0 && <div className="story-loading-actions"><button type="button" onClick={() => { setFailed(0); setLoaded(0); setLoadAttempt((value) => value + 1); }}>Retry photos</button></div>}
          </div>
          <div className="loading-game-backdrop" role="presentation">
          <section key={loadingGameStep} ref={gameDialogRef} tabIndex={-1} className={`loading-love-game game-${loadingGameStep}`} role="dialog" aria-modal="true" aria-labelledby="loading-game-title" aria-label="Love quest loading game">
            <span className="game-sticker game-sticker-heart" aria-hidden="true">♥</span>
            <span className="game-sticker game-sticker-star" aria-hidden="true">✦</span>
            <span className="game-sticker game-sticker-note" aria-hidden="true">PLOT<br/>TWIST</span>
            <p className="loading-game-label">LOVE QUEST · {loadingGameStep === "intro" ? "A LITTLE SURPRISE" : loadingGameStep === "won" ? "THE ENDING" : ["love", "love-no1", "love-no2", "love-yes"].includes(loadingGameStep) ? "CHAPTER 1 OF 3" : ["marry", "marry-no", "proposal-confirm"].includes(loadingGameStep) ? "CHAPTER 2 OF 3" : "CHAPTER 3 OF 3"}</p>
            {loadingGameStep === "intro" && <>
              <p className="game-illustration" aria-hidden="true">💌</p>
              <h2 id="loading-game-title" aria-live="polite">Hey, my favorite human!</h2>
              <p className="loading-game-copy">A tiny love story, three very important questions, a few questionable jokes, and one boy hopelessly in love with you.</p>
              <button type="button" className="loading-game-continue" onClick={() => setLoadingGameStep("love")}>Open my surprise 💖</button>
              <p className="game-disclaimer">Just a playful little story game. No real proposals or family tests hiding here.</p>
            </>}
            {loadingGameStep === "love" && <>
              <p className="game-scene-tag">PLAYFUL ROMANCE · Q1 / 3</p>
              <h2 id="loading-game-title" aria-live="polite">Do you love me? 🥺💞</h2>
              <p className="loading-game-copy">Choose carefully. A very dramatic boyfriend is watching.</p>
              <div className="loading-game-options">
                <button type="button" className="loading-game-yes" onClick={() => setLoadingGameStep("love-yes")}><strong>Yes 💖</strong></button>
                <button type="button" className="loading-game-no" onClick={() => { setLoveNoCount((value) => value + 1); setLoadingGameStep(loveNoCount % 2 === 0 ? "love-no1" : "love-no2"); }}><strong>No 🙃</strong></button>
              </div>
              <p className="game-hint">Psst… the buttons are innocent. Probably. 👀</p>
            </>}
            {loadingGameStep === "love-no1" && <div className="game-reaction reaction-heart"><p className="game-illustration" aria-hidden="true">💔🩹</p><h2 id="loading-game-title">A cartoon heart needs a tiny bandage.</h2><p className="loading-game-copy">It will be okay. The heart has excellent healthcare.</p><div className="loading-game-options"><button type="button" className="loading-game-yes" onClick={() => setLoadingGameStep("love")}><strong>Try again 💗</strong></button><button type="button" className="loading-game-no" onClick={() => setLoadingGameStep("love")}><strong>Recheck answer 🙃</strong></button></div></div>}
            {loadingGameStep === "love-no2" && <div className="game-reaction reaction-detective"><p className="game-illustration" aria-hidden="true">🕵️‍♂️🔎</p><h2 id="loading-game-title">Suspicious answer detected!</h2><p className="loading-game-copy">The tiny detective found another question. Fancy that.</p><div className="loading-game-options"><button type="button" className="loading-game-yes" onClick={() => setLoadingGameStep("love")}><strong>Reopen the case 🔍</strong></button><button type="button" className="loading-game-no" onClick={() => setLoadingGameStep("love")}><strong>Ask the teddy 🧸</strong></button></div></div>}
            {loadingGameStep === "love-yes" && <div className="game-reaction reaction-heart"><p className="game-illustration" aria-hidden="true">💗✨</p><h2 id="loading-game-title">Wait… say that one more time?</h2><p className="loading-game-copy">My heart wants a screenshot. A tiny floating heart is on its way.</p><p className="love-fragment"><span>LETTER FRAGMENT 01 / 03</span><strong>You make the ordinary days feel special.</strong></p><button type="button" className="loading-game-continue" onClick={() => { setMarryNoCount(0); setLoadingGameStep("marry"); }}>Yes, yes! Next question →</button></div>}
            {loadingGameStep === "marry" && <><p className="game-scene-tag">THE ROM-COM CLIMAX · Q2 / 3</p><p className="game-illustration ring-illustration" aria-hidden="true">💍</p><h2 id="loading-game-title">Will you marry me?</h2><p className="loading-game-copy">Imagine our future: one home, endless snack debates, and a lifetime of annoying each other—in the cutest way.</p>{marryNoCount > 0 && <p className="game-reaction-note" key={marryNoCount}>{marryNoCount === 1 ? "🎂 The wedding cake has entered witness protection. Give the rom-com another take?" : "🐈 The tiny wedding planner has booked a tuxedo for the cat. One more take?"}</p>}<p className="game-disclaimer">This is an imaginary movie moment, not a real proposal.</p><div className="loading-game-options"><button type="button" className="loading-game-yes" onClick={() => setLoadingGameStep("proposal-confirm")}><strong>Yes 💍</strong></button><button type="button" className="loading-game-no" onClick={() => { setMarryNoCount((value) => value + 1); setLoadingGameStep("marry-no"); }}><strong>No 🙈</strong></button></div></>}
            {loadingGameStep === "marry-no" && <div className="game-reaction"><p className="game-illustration" aria-hidden="true">🎬😅</p><h2 id="loading-game-title">Rom-com scene failed. Take two?</h2><p className="loading-game-copy">The cake is safe. The director is ready when you are.</p><div className="loading-game-options"><button type="button" className="loading-game-yes" onClick={() => setLoadingGameStep("marry")}><strong>Another take 🎬</strong></button><button type="button" className="loading-game-no" onClick={() => setLoadingGameStep("marry")}><strong>Rewind the scene ↻</strong></button></div></div>}
            {loadingGameStep === "proposal-confirm" && <><p className="game-scene-tag">IMPORTANT ROM-COM CONFIRMATION</p><p className="game-illustration" aria-hidden="true">💍💌</p><h2 id="loading-game-title">Wait… you said yes?!</h2><p className="loading-game-copy">Are we saying yes in our imaginary movie, or saving a sweet “someday” thought?</p><p className="love-fragment"><span>LETTER FRAGMENT 02 / 03</span><strong>I’d choose every adventure with you again.</strong></p><div className="loading-game-options"><button type="button" className="loading-game-yes" onClick={() => setLoadingGameStep("family")}><strong>Yes, in our movie 🎬</strong></button><button type="button" className="loading-game-yes" onClick={() => setLoadingGameStep("family")}><strong>Yes, someday 💗</strong></button></div></>}
            {loadingGameStep === "family" && <><p className="game-scene-tag">THE FINAL LOVE CHALLENGE · Q3 / 3</p><p className="game-illustration family-illustration" aria-hidden="true">🎭🕶️</p><h2 id="loading-game-title">The movie dad has arrived!</h2><p className="loading-game-copy">He says our silly rom-com needs a different ending. Would you team up with me to hear his concerns and win him over together?</p>{familyNoCount > 0 && <p className="game-reaction-note" key={familyNoCount}>{familyNoCount % 2 ? "🕶️ Dad has put on a second pair of sunglasses. He's committed to the drama." : "⚖️ The cartoon lawyer has called a tiny hamster judge. The case continues."}</p>}<div className="loading-game-options"><button type="button" className="loading-game-yes" onClick={() => setLoadingGameStep("family-yes")}><strong>Team up 🤝</strong></button><button type="button" className="loading-game-no" onClick={() => { setFamilyNoCount((value) => value + 1); setLoadingGameStep("family-no"); }}><strong>Not this scene 🙃</strong></button></div></>}
            {loadingGameStep === "family-no" && <div className="game-reaction"><p className="game-illustration" aria-hidden="true">⚖️🐈</p><h2 id="loading-game-title">Objection! Dad wants to hear your teamwork plan.</h2><p className="loading-game-copy">The cartoon lawyer has prepared another scene. Even the hamster judge is invested.</p><div className="loading-game-options"><button type="button" className="loading-game-yes" onClick={() => setLoadingGameStep("family")}><strong>Try the scene 🤝</strong></button><button type="button" className="loading-game-no" onClick={() => setLoadingGameStep("family")}><strong>Ask for a hint 🎭</strong></button></div></div>}
            {loadingGameStep === "family-yes" && <div className="game-reaction reaction-team"><p className="game-illustration" aria-hidden="true">🕶️➡️😊</p><h2 id="loading-game-title">Plot twist: he was testing our teamwork!</h2><p className="loading-game-copy">The movie dad takes off his shades. He just wanted to see us communicate like a team.</p><button type="button" className="loading-game-continue" onClick={() => setLoadingGameStep("commitment")}>One last question →</button></div>}
            {loadingGameStep === "commitment" && <><p className="game-scene-tag">THE TEAM-US CHECK-IN</p><p className="game-illustration" aria-hidden="true">🫶🌱</p><h2 id="loading-game-title">When life gets tricky, can we talk, listen, and work through it together?</h2><p className="loading-game-copy">No need to be perfect. Just on the same team.</p><p className="love-fragment"><span>LETTER FRAGMENT 03 / 03</span><strong>Thank you for being exactly you.</strong></p><div className="loading-game-options"><button type="button" className="loading-game-yes" onClick={() => setLoadingGameStep("won")}><strong>Team us 🫶</strong></button><button type="button" className="loading-game-no" onClick={() => setLoadingGameStep("won")}><strong>One day at a time 🌱</strong></button></div></>}
            {loadingGameStep === "won" && <><div className="game-confetti" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <i key={index} style={{ left: `${(index * 7) % 100}%`, animationDelay: `${index * 0.06}s`, animationDuration: `${1.8 + index * 0.08}s`, backgroundColor: `hsl(${index * 27} 70% 62%)` }} />)}</div><p className="game-illustration celebration-emoji" aria-hidden="true">🥳🎉💖</p><h2 id="loading-game-title">Our little love quest is complete!</h2><p className="loading-game-copy">One tiny love letter, three plot twists, and a whole birthday story waiting for you. {loadingProgress >= 1 ? "Your photos are ready whenever you are." : "The photos are finishing up while we celebrate."}</p><div className="loading-game-finish-actions"><button type="button" className="loading-game-replay" onClick={() => { setLoveNoCount(0); setMarryNoCount(0); setFamilyNoCount(0); setLoadingGameStep("intro"); }}>Play again ↻</button><button type="button" className="loading-game-continue" onClick={revealStory}>Continue to the story →</button></div></>}
          </section>
          </div>
        </>
      )}
      {phase === "unlocked" && <div className="entrance-unlocked-note"><a href="#hero">Our story begins <span aria-hidden="true">↓</span></a></div>}
    </section>
  );
}
