/** @format */

import React, { useMemo, useRef, useState } from "react";

type Photo = { src: string; caption: string; date?: string };

function confettiBurst(count = 120) {
  const colors = ["#ff7a8a", "#ffd166", "#06d6a0", "#4d96ff", "#c6a7ff"];
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.style.position = "fixed";
    el.style.top = "-10px";
    el.style.left = Math.random() * 100 + "vw";
    el.style.width = 8 + Math.random() * 10 + "px";
    el.style.height = 10 + Math.random() * 18 + "px";
    el.style.borderRadius = "3px";
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.opacity = String(0.7 + Math.random() * 0.3);
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    el.style.pointerEvents = "none";
    el.style.zIndex = "9999";

    const dur = 1600 + Math.random() * 2200;
    el.animate(
      [
        { transform: el.style.transform, top: "-10px", opacity: 1 },
        { transform: "rotate(720deg)", top: "110vh", opacity: 0.85 },
      ],
      { duration: dur, easing: "linear", fill: "forwards" }
    );

    document.body.appendChild(el);
    setTimeout(() => el.remove(), dur + 200);
  }
}

export default function App() {
  // ====== 커스터마이즈 ======
  const FRIEND_NAME = "Seo-yeon";
  const SUB1 = "사진 10장으로 만든 작은 전시";
  const SUB2 = "오늘 하루, 기록처럼 남겨줄게";
  const PRIMARY_CTA = "사진 펼쳐보기";
  const SECONDARY_CTA = "편지 읽기";
  const LETTER = `생일 축하해!
오늘은 네가 제일 행복했으면 좋겠어서,
작은 페이지를 준비했어.`;

  const YT_EMBED_URL = "https://www.youtube.com/embed/5qap5aO4i9A";

  const photos: Photo[] = [
    {
      src: "/photos/01.jpg",
      caption: "바다에서 너무 즐거웠던 날 🌤️",
      date: "2021.03.06",
    },
    { src: "/photos/02.jpg", caption: "햇살 좋았던 오후", date: "2022.06.18" },
    {
      src: "/photos/03.jpg",
      caption: "그날의 웃음이 아직도 기억나",
      date: "2023.09.02",
    },
  ];

  // 갤러리(가로 슬라이드)용 — 위 photos 재사용해도 되고 따로 둬도 됨
  const gallery: Photo[] = [
    { src: "/photos/01.jpg", caption: "바다에서 너무 즐거웠던 날 🌤️" },
    { src: "/photos/02.jpg", caption: "네가 제일 예뻤던 날" },
    { src: "/photos/03.jpg", caption: "우리의 소중한 순간들" },
  ];

  const memories = [
    { title: "웃겼던 날 😄", body: "배를 빠지게 웃었던 그날" },
    { title: "고마웠던 순간 💗", body: "네가 있어서 정말 든든했어" },
    { title: "레전드 사건!", body: "역대급 추억의 순간!" },
  ];
  // =========================

  const today = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}`;
  }, []);

  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const [isLetterOpen, setIsLetterOpen] = useState(false);

  // Gallery 슬라이더
  const [idx, setIdx] = useState(0);
  const startX = useRef<number | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1400);
  }

  function scrollToId(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (startX.current == null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX.current;
    startX.current = null;

    // 스와이프 임계값
    if (Math.abs(diff) < 35) return;
    if (diff < 0) setIdx((p) => Math.min(p + 1, gallery.length - 1));
    else setIdx((p) => Math.max(p - 1, 0));
  }

  const styles = `
    :root{
      --bg:#f6f1ea;
      --paper:#fbf8f3;
      --ink:#1f1f1f;
      --muted:#6c6c6c;
      --shadow: 0 18px 55px rgba(17, 17, 17, .14);
      --shadow2: 0 10px 25px rgba(17, 17, 17, .10);
      --radius: 22px;
      --pink:#e96a7b;
      --pink2:#ff9aaa;
      --line: rgba(0,0,0,.10);
    }
    *{ box-sizing:border-box; }
    body{
      margin:0;
      color: var(--ink);
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Apple SD Gothic Neo", "Noto Sans KR", Arial;
      background:
        radial-gradient(1100px 650px at 14% 10%, rgba(233,106,123,.16), transparent 55%),
        radial-gradient(900px 520px at 86% 16%, rgba(255,209,138,.18), transparent 55%),
        linear-gradient(#f7f2eb, var(--bg));
      min-height:100vh;
    }

    /* 종이 질감(가벼운 노이즈 느낌) */
    .grain{
      position: fixed;
      inset: 0;
      pointer-events:none;
      opacity:.12;
      background-image:
        repeating-linear-gradient(0deg, rgba(0,0,0,.018), rgba(0,0,0,.018) 1px, transparent 1px, transparent 3px),
        repeating-linear-gradient(90deg, rgba(0,0,0,.012), rgba(0,0,0,.012) 1px, transparent 1px, transparent 4px);
      mix-blend-mode: multiply;
    }

    .page{
      width: min(1040px, 92vw);
      margin: 0 auto;
      padding: 22px 0 72px;
      display:flex;
      flex-direction:column;
      align-items:center;
      gap: 18px;
    }

    /* 상단 레이아웃: 컨텐츠 + 우측 유튜브 */
    .topGrid{
      width:100%;
      display:grid;
      grid-template-columns: 1fr;
      gap: 16px;
      justify-items:center;
      align-items:start;
    }
    @media(min-width: 980px){
      .topGrid{
        grid-template-columns: minmax(0, 760px) 280px;
        justify-content:center;
      }
    }

    .card{
      width:100%;
      background: rgba(251,248,243,.86);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      backdrop-filter: blur(8px);
    }

    .hero{
      padding: 22px 20px 18px;
      text-align:center;
      position:relative;
      overflow:hidden;
    }
    .hero::before{
      content:"";
      position:absolute;
      inset:-40px -80px auto -80px;
      height:220px;
      background:
        radial-gradient(240px 160px at 30% 40%, rgba(233,106,123,.20), transparent 60%),
        radial-gradient(220px 150px at 70% 30%, rgba(255,209,138,.24), transparent 60%);
      filter: blur(2px);
      opacity:.9;
    }
    .heroInner{ position:relative; z-index:1; }
    .title{
      font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
      font-weight: 800;
      letter-spacing: -0.02em;
      font-size: clamp(30px, 4.5vw, 44px);
      margin: 0 0 6px;
    }
    .title .emoji{ font-size: .95em; }
    .sub{
      margin: 0;
      color: var(--muted);
      line-height: 1.65;
      font-size: 14px;
    }
    .ctaRow{
      display:flex;
      gap: 10px;
      justify-content:center;
      flex-wrap:wrap;
      margin-top: 14px;
    }
    .btn{
      border: 1px solid rgba(0,0,0,.10);
      border-radius: 999px;
      padding: 11px 16px;
      font-weight: 800;
      cursor:pointer;
      transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
      display:inline-flex;
      align-items:center;
      gap: 8px;
    }
    .btn:active{ transform: translateY(0); }
    .btn:hover{ transform: translateY(-1px); box-shadow: var(--shadow2); }
    .btnPrimary{
      background: linear-gradient(180deg, var(--pink2), var(--pink));
      color: white;
      border-color: rgba(0,0,0,.08);
    }
    .btnGhost{
      background: rgba(255,255,255,.55);
    }

    /* 폴라로이드(히어로 사진) */
    .polaroidWrap{
      margin-top: 16px;
      display:flex;
      justify-content:center;
    }
    .polaroid{
      width: min(420px, 82%);
      background: white;
      border-radius: 14px;
      border: 1px solid rgba(0,0,0,.10);
      box-shadow: var(--shadow);
      padding: 14px 14px 10px;
      transform: rotate(-1.2deg);
      position: relative;
    }
    .polaroid::before{
      content:"";
      position:absolute;
      top:-10px;
      left: 50%;
      transform: translateX(-50%) rotate(-2deg);
      width: 110px;
      height: 26px;
      background: rgba(245, 215, 160, .55);
      border: 1px solid rgba(0,0,0,.08);
      border-radius: 6px;
      box-shadow: 0 6px 18px rgba(0,0,0,.10);
    }
    .polaroidImg{
      width:100%;
      border-radius: 10px;
      display:block;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      background: #eee;
    }
    .polaroidCap{
      margin-top: 10px;
      text-align:center;
      font-weight: 700;
      color: rgba(0,0,0,.75);
      font-size: 14px;
    }
    .polaroidMeta{
      margin-top: 6px;
      text-align:center;
      color: rgba(0,0,0,.45);
      font-size: 12px;
      letter-spacing: .02em;
    }

    /* 우측 유튜브(작게) */
    .side{
      width:100%;
      max-width: 760px;
    }
    @media(min-width: 980px){
      .side{
        max-width: 280px;
        position: sticky;
        top: 16px;
      }
    }
    .sideCard{
      padding: 14px 12px 12px;
      text-align:center;
    }
    .sideTitle{
      font-weight: 900;
      letter-spacing: -0.02em;
      margin: 2px 0 10px;
    }
    .iframeWrap{
      border-radius: 18px;
      overflow:hidden;
      border: 1px solid rgba(0,0,0,.10);
      box-shadow: 0 10px 22px rgba(0,0,0,.08);
      background: #000;
    }
    .hint{
      margin-top: 10px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.55;
    }

    /* 섹션 타이틀 */
    .section{
      width: 100%;
      max-width: 760px;
      text-align:center;
      padding: 6px 0;
    }
    .section h2{
      margin: 0;
      font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
      font-weight: 800;
      letter-spacing: -0.02em;
      font-size: 28px;
    }
    .section small{
      display:block;
      margin-top: 6px;
      color: var(--muted);
      font-size: 12px;
      letter-spacing: .04em;
      text-transform: uppercase;
    }

    /* Gallery 슬라이더 */
    .galleryCard{
      width: 100%;
      max-width: 760px;
      padding: 16px;
      text-align:center;
    }
    .frame{
      position: relative;
      width: 100%;
      border-radius: 18px;
      overflow:hidden;
      border: 1px solid rgba(0,0,0,.10);
      background: #fff;
      box-shadow: var(--shadow2);
    }
    .track{
      display:flex;
      transition: transform 260ms ease;
      will-change: transform;
    }
    .slide{
      min-width: 100%;
      padding: 16px 16px 12px;
      display:flex;
      flex-direction:column;
      align-items:center;
      gap: 10px;
      background: #fff;
    }
    .polaroidSmall{
      width: min(460px, 92%);
      background:white;
      border-radius: 14px;
      border: 1px solid rgba(0,0,0,.10);
      box-shadow: var(--shadow2);
      padding: 12px 12px 10px;
      position: relative;
      transform: rotate(.8deg);
    }
    .polaroidSmall::before{
      content:"";
      position:absolute;
      top:-10px;
      left: 34%;
      transform: translateX(-50%) rotate(2deg);
      width: 90px;
      height: 24px;
      background: rgba(245, 215, 160, .55);
      border: 1px solid rgba(0,0,0,.08);
      border-radius: 6px;
      box-shadow: 0 6px 16px rgba(0,0,0,.10);
    }
    .polaroidSmall img{
      width:100%;
      border-radius: 10px;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      background:#eee;
      display:block;
    }
    .dots{
      display:flex;
      justify-content:center;
      gap: 8px;
      padding: 12px 0 2px;
    }
    .dot{
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: rgba(0,0,0,.18);
    }
    .dot.active{
      background: rgba(233,106,123,.95);
    }
    .navRow{
      display:flex;
      justify-content:center;
      gap: 10px;
      margin-top: 10px;
    }
    .navBtn{
      border: 1px solid rgba(0,0,0,.10);
      background: rgba(255,255,255,.70);
      border-radius: 999px;
      padding: 10px 14px;
      cursor:pointer;
      font-weight: 800;
    }

    /* Memories 카드(찢어진 종이 느낌) */
    .memoriesCard{
      width: 100%;
      max-width: 760px;
      padding: 18px 16px 10px;
    }
    .memoList{
      display:flex;
      flex-direction:column;
      gap: 12px;
      margin-top: 12px;
    }
    .memo{
      background: #fff;
      border: 1px solid rgba(0,0,0,.10);
      border-radius: 16px;
      box-shadow: var(--shadow2);
      padding: 14px 14px 12px;
      position: relative;
      overflow:hidden;
    }
    .memo::after{
      content:"";
      position:absolute;
      inset:auto 0 0 0;
      height: 18px;
      background:
        radial-gradient(14px 10px at 10% 50%, transparent 60%, rgba(0,0,0,.06) 61%),
        radial-gradient(14px 10px at 30% 50%, transparent 60%, rgba(0,0,0,.06) 61%),
        radial-gradient(14px 10px at 50% 50%, transparent 60%, rgba(0,0,0,.06) 61%),
        radial-gradient(14px 10px at 70% 50%, transparent 60%, rgba(0,0,0,.06) 61%),
        radial-gradient(14px 10px at 90% 50%, transparent 60%, rgba(0,0,0,.06) 61%);
      opacity:.35;
    }
    .memoTitle{
      font-weight: 900;
      letter-spacing: -0.02em;
      margin: 0 0 6px;
    }
    .memoBody{
      margin:0;
      color: rgba(0,0,0,.60);
      line-height: 1.6;
      font-size: 14px;
    }

    /* 모달(편지) */
    .overlay{
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.35);
      display:grid;
      place-items:center;
      padding: 18px;
      z-index: 9998;
    }
    .modal{
      width: min(560px, 92vw);
      background: rgba(251,248,243,.98);
      border: 1px solid rgba(0,0,0,.12);
      border-radius: 22px;
      box-shadow: 0 25px 80px rgba(0,0,0,.22);
      padding: 18px;
      text-align:center;
    }
    .modal h3{
      margin: 4px 0 10px;
      font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
      font-size: 24px;
      letter-spacing: -.02em;
    }
    .letter{
      background: #fff;
      border: 1px solid rgba(0,0,0,.10);
      border-radius: 18px;
      padding: 14px;
      text-align:left;
      white-space: pre-wrap;
      line-height: 1.75;
      color: rgba(0,0,0,.70);
    }
    .modalRow{
      display:flex;
      justify-content:center;
      gap:10px;
      margin-top: 12px;
      flex-wrap:wrap;
    }

    .toast{
      position:fixed; left:50%; bottom:18px; transform:translateX(-50%);
      background: rgba(20,20,20,.78);
      color: #fff;
      border: 1px solid rgba(255,255,255,.18);
      padding: 10px 12px;
      border-radius: 999px;
      font-size: 13px;
      opacity:0;
      pointer-events:none;
      transition: opacity 160ms ease, transform 160ms ease;
      z-index: 9999;
    }
    .toast.show{ opacity:1; transform:translateX(-50%) translateY(-6px); }
  `;

  const heroPhoto = photos[0];

  return (
    <>
      <style>{styles}</style>
      <div className="grain" />

      <div className="page">
        <div className="topGrid">
          {/* Left: Hero */}
          <div className="card hero">
            <div className="heroInner">
              <h1 className="title">
                Happy Birthday, {FRIEND_NAME} <span className="emoji">🍰</span>
              </h1>
              <p className="sub">{SUB1}</p>
              <p className="sub">{SUB2}</p>

              <div className="ctaRow">
                <button
                  className="btn btnPrimary"
                  onClick={() => {
                    confettiBurst(190);
                    showToast("🎉 축하해!");
                    scrollToId("gallery");
                  }}>
                  {PRIMARY_CTA} ↓
                </button>
                <button
                  className="btn btnGhost"
                  onClick={() => setIsLetterOpen(true)}>
                  {SECONDARY_CTA} ✉️
                </button>
              </div>

              <div className="polaroidWrap">
                <div className="polaroid">
                  <img className="polaroidImg" src={heroPhoto.src} alt="hero" />
                  <div className="polaroidCap">{heroPhoto.caption}</div>
                  <div className="polaroidMeta">
                    {heroPhoto.date ?? today} · from you
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Small YouTube */}
          <aside className="card side sideCard">
            <div className="sideTitle">🎧 오늘의 노래</div>
            <div className="iframeWrap">
              <iframe
                width="100%"
                height="190"
                src={YT_EMBED_URL}
                title="music"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            <div className="hint">
              노래 틀어두고
              <br />
              사진 천천히 넘겨봐 :)
            </div>

            <div className="navRow">
              <button
                className="navBtn"
                onClick={() => {
                  confettiBurst(160);
                  showToast("🎉 축하 폭죽!");
                }}>
                한 번 더 축하하기
              </button>
            </div>
          </aside>
        </div>

        {/* Gallery */}
        <div className="section" id="gallery">
          <h2>Gallery</h2>
          <small>우리의 소중한 순간들</small>
        </div>

        <div className="card galleryCard">
          <div
            className="frame"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}>
            <div
              className="track"
              style={{ transform: `translateX(${-idx * 100}%)` }}>
              {gallery.map((g, i) => (
                <div className="slide" key={i}>
                  <div className="polaroidSmall">
                    <img src={g.src} alt={`g-${i}`} />
                  </div>
                  <div style={{ color: "rgba(0,0,0,.65)", fontWeight: 800 }}>
                    {g.caption}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dots">
            {gallery.map((_, i) => (
              <div key={i} className={"dot " + (i === idx ? "active" : "")} />
            ))}
          </div>

          <div className="navRow">
            <button
              className="navBtn"
              onClick={() => setIdx((p) => Math.max(p - 1, 0))}>
              ←
            </button>
            <button
              className="navBtn"
              onClick={() =>
                setIdx((p) => Math.min(p + 1, gallery.length - 1))
              }>
              →
            </button>
          </div>
        </div>

        {/* Memories */}
        <div className="section">
          <h2>Memories</h2>
          <small>짧게 남긴 문장들</small>
        </div>

        <div className="card memoriesCard">
          <div className="memoList">
            {memories.map((m, i) => (
              <div className="memo" key={i}>
                <div className="memoTitle">{m.title}</div>
                <p className="memoBody">{m.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ height: 10 }} />
        <div style={{ color: "rgba(0,0,0,.45)", fontSize: 12 }}>
          {today} · From. {FRIEND_NAME}’s friend
        </div>
      </div>

      {/* Letter Modal */}
      {isLetterOpen && (
        <div className="overlay" onClick={() => setIsLetterOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>편지</h3>
            <div className="letter">{LETTER}</div>
            <div className="modalRow">
              <button
                className="btn btnPrimary"
                onClick={() => (
                  confettiBurst(150), showToast("🎉 생일 축하해!")
                )}>
                축하하기
              </button>
              <button
                className="btn btnGhost"
                onClick={() => setIsLetterOpen(false)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={"toast " + (toast ? "show" : "")}>{toast ?? ""}</div>
    </>
  );
}
