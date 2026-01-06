/** @format */
/* eslint-disable */

import { useEffect, useMemo, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";

type Photo = {
  src: string;
  caption: string;
  orientation?: "portrait" | "landscape";
};

function confettiBurst(count = 120) {
  const colors = ["#ff6b6b", "#ffa8a8", "#ffd6a5", "#bde0fe", "#cdb4db"];
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.style.position = "fixed";
    el.style.top = "-10px";
    el.style.left = Math.random() * 100 + "vw";
    el.style.width = 8 + Math.random() * 10 + "px";
    el.style.height = 10 + Math.random() * 18 + "px";
    el.style.borderRadius = "3px";
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.opacity = String(0.75 + Math.random() * 0.25);
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

function useOnceInView<T extends HTMLElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (!ref.current || seen) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35, ...options }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [seen, options]);

  return { ref, seen };
}

function useScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
        const next = Math.min(1, Math.max(0, doc.scrollTop / max));
        setP(next);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return p;
}

function makeRotations(n: number) {
  const arr: number[] = [];
  let seed = 1234567;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < n; i++) {
    const r = (rand() - 0.5) * 4.2; // -2.1 ~ 2.1deg
    arr.push(Number(r.toFixed(2)));
  }
  return arr;
}

function PolaroidItem({ p, i, rot }: { p: Photo; i: number; rot: number }) {
  const { ref, seen } = useOnceInView<HTMLDivElement>({ threshold: 0.35 });

  return (
    <Polaroid
      ref={ref}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen
          ? `translateY(0) rotate(${rot}deg)`
          : `translateY(24px) rotate(${rot + 2.5}deg)`,
        transition: "all 700ms cubic-bezier(.22,1,.36,1)",
        transitionDelay: `${i * 70}ms`,
        willChange: "transform, opacity",
      }}>
      <PolaroidFrame>
        <PolaroidImg
          src={p.src}
          alt={`photo-${i}`}
          loading="lazy"
          $orientation={p.orientation}
        />
      </PolaroidFrame>
      <PolaroidCaption>{p.caption}</PolaroidCaption>
    </Polaroid>
  );
}

export default function App() {
  const TITLE = `Happy B-DAY!`;
  const SUBTITLE = "그녀의 26번째 생일을 축하하며!";

  const YT_EMBED_URL =
    "https://www.youtube-nocookie.com/embed/TOVO7MhYEtU?playsinline=1&rel=0";

  const LETTER_TITLE = "TO. 세은";
  const LETTER = `생일 축하한다 막내야!

오후 근무 짬내서 만들어봤다..;;
항상 건강하고 행복하자 ~ 😎🤗

ps. 혹시 웃었다면 숙소 좀 알아봐라ㅋㅎ`;

  // ✅ 캡션 제거: 사진만
  const base = import.meta.env.BASE_URL;

  const photos: Photo[] = [
    { src: `${base}photos/01.jpeg`, caption: "1년전 그녀의 생일" },
    { src: `${base}photos/02.jpeg`, caption: "브이 1" },
    { src: `${base}photos/03.jpeg`, caption: "브이 2" },
    { src: `${base}photos/04.jpeg`, caption: "ㄹㅈㄷ 브이 귀신" },
    { src: `${base}photos/05.jpeg`, caption: "이거 너무 베이비 페이스여요ㅋ" },
    { src: `${base}photos/06.jpeg`, caption: "앞으로 브이 금지" },
    {
      src: `${base}photos/07.jpeg`,
      caption: "그냥 현지가 웃겨서 넣음",
      orientation: "landscape",
    },
    {
      src: `${base}photos/08.jpeg`,
      caption: "나 그만 좋아해라 ~~~~",
    },
    {
      src: `${base}photos/09.jpeg`,
      caption: "자체 컨텐츠녀",
      orientation: "landscape",
    },
    { src: `${base}photos/10.jpeg`, caption: "5개 정도 있는 단체사진 중 하나" },
    { src: `${base}photos/11.jpeg`, caption: "귀여워라" },
    // { src: `${base}photos/12.jpeg`, caption: "웃음 버튼 ㅋㅋ" },
    { src: `${base}photos/13.jpeg`, caption: "브이 압수" },
    {
      src: `${base}photos/14.jpeg`,
      caption: "HAPPY BIRTHDAY! 🩵",
    },
  ];
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

  const progress = useScrollProgress();
  const rotations = useMemo(
    () => makeRotations(photos.length),
    [photos.length]
  );

  const photosSection = useOnceInView<HTMLElement>({ threshold: 0.25 });

  const pageStyle = useMemo(
    () => ({ "--p": progress } as React.CSSProperties),
    [progress]
  );

  return (
    <Page style={pageStyle}>
      <GlobalStyle />

      <Section>
        <Container>
          <TopLayout>
            <CenterBlock>
              <Kicker>
                <Dot />
                {today}
              </Kicker>

              <H1>{TITLE}</H1>
              <Sub>{SUBTITLE}</Sub>
            </CenterBlock>

            <Side>
              <SideTitle>🎉 축하~~~쏭! 🎈</SideTitle>
              <IframeWrap>
                <iframe
                  src={YT_EMBED_URL}
                  title="youtube-shorts"
                  width="100%"
                  height="450"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </IframeWrap>
              <SideHint>bgm 레츠고</SideHint>
            </Side>

            <Actions>
              <PrimaryButton
                onClick={() => {
                  confettiBurst(180);
                  showToast("🎉 생일 축하해!");
                  scrollToId("photos");
                }}>
                Go!
              </PrimaryButton>
            </Actions>

            <Divider />
          </TopLayout>
        </Container>
      </Section>

      <Section id="photos" ref={photosSection.ref as any}>
        <Container>
          <PolaroidStack>
            {photos.map((p, i) => {
              return <PolaroidItem key={i} p={p} i={i} rot={rotations[i]} />;
            })}
          </PolaroidStack>
        </Container>
      </Section>

      <Section>
        <Container>
          <CakeCandle
            age={26}
            onBlowOut={() => {
              confettiBurst(220);
            }}
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <FooterInner>
            <Button
              onClick={() => {
                setIsLetterOpen(true);
                confettiBurst(150);
                showToast("🎉 생일 축하해!");
              }}>
              💌 내 마음 💌
            </Button>
          </FooterInner>
        </Container>
      </Section>

      {isLetterOpen && (
        <Overlay onClick={() => setIsLetterOpen(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{LETTER_TITLE}</ModalTitle>
            <Letter>{LETTER}</Letter>
          </Modal>
        </Overlay>
      )}

      <Toast className={toast ? "show" : ""}>{toast ?? ""}</Toast>
    </Page>
  );
}

type CakeCandleProps = {
  age?: number;
  title?: string;
  hint?: string;
  onBlowOut?: () => void;
};

function CakeCandle({
  age = 26,
  hint = "후 불어야 꺼진다 ~~~",
  onBlowOut,
}: CakeCandleProps) {
  const [lit, setLit] = useState(true);

  return (
    <CakeWrap>
      <CakeHint>{hint}</CakeHint>

      <CakeButton
        type="button"
        aria-label="blow candle"
        onClick={() => {
          if (!lit) return;
          setLit(false);
          onBlowOut?.();
        }}>
        <CakeSVG viewBox="0 0 420 280" role="img" aria-label="cake">
          {/* plate shadow */}
          <ellipse cx="210" cy="240" rx="140" ry="18" fill="rgba(0,0,0,0.08)" />
          {/* plate */}
          <ellipse cx="210" cy="232" rx="165" ry="22" fill="#f3f4f6" />
          <ellipse cx="210" cy="228" rx="155" ry="18" fill="#ffffff" />

          {/* cake base */}
          <g>
            <rect
              x="95"
              y="118"
              width="230"
              height="115"
              rx="26"
              fill="#ffd6a5"
            />
            {/* cake shading */}
            <path
              d="M110 132 C150 150, 175 140, 210 154 C250 172, 278 160, 310 178 L310 220 C270 238, 170 240, 110 222 Z"
              fill="rgba(0,0,0,0.05)"
            />
            {/* frosting */}
            <path
              d="M95 128
                 C120 100, 150 110, 175 96
                 C200 82, 220 110, 245 96
                 C270 82, 305 105, 325 100
                 L325 140
                 C300 160, 280 150, 255 162
                 C230 174, 200 156, 175 170
                 C150 184, 120 166, 95 176
                 Z"
              fill="#fff"
              opacity="0.92"
            />
            {/* drip dots */}
            <circle cx="130" cy="170" r="5" fill="rgba(255,255,255,0.9)" />
            <circle cx="165" cy="190" r="6" fill="rgba(255,255,255,0.85)" />
            <circle cx="245" cy="186" r="6" fill="rgba(255,255,255,0.85)" />
            <circle cx="286" cy="170" r="5" fill="rgba(255,255,255,0.9)" />
          </g>

          {/* candle */}
          <g>
            <rect x="202" y="62" width="16" height="64" rx="8" fill="#ff6b6b" />
            <path
              d="M202 78 C206 74, 214 82, 218 76"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M202 96 C206 92, 214 100, 218 94"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />

            {/* flame (lit) */}
            <g style={{ opacity: lit ? 1 : 0 }}>
              <path
                className="flame flameOuter"
                d="M210 34
                   C222 52, 220 70, 210 76
                   C200 70, 198 52, 210 34 Z"
                fill="#f79009"
              />
              <path
                className="flame flameInner"
                d="M210 44
                   C218 56, 216 66, 210 70
                   C204 66, 202 56, 210 44 Z"
                fill="#ffd6a5"
              />
              <circle
                className="spark"
                cx="232"
                cy="58"
                r="2.8"
                fill="#ffd6a5"
              />
              <circle
                className="spark2"
                cx="188"
                cy="54"
                r="2.2"
                fill="#fff"
                opacity="0.9"
              />
            </g>

            {/* smoke (after blow) */}
            <g style={{ opacity: lit ? 0 : 1 }}>
              <path
                className="smoke"
                d="M210 34
                   C198 48, 200 62, 214 70
                   C232 80, 226 98, 210 108"
                fill="none"
                stroke="rgba(20,20,20,0.25)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                className="smoke2"
                d="M210 40
                   C220 54, 218 66, 206 74
                   C190 84, 196 96, 210 104"
                fill="none"
                stroke="rgba(20,20,20,0.18)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
          </g>

          {/* label */}
          <g>
            <rect
              x="170"
              y="198"
              width="80"
              height="30"
              rx="14"
              fill="rgba(255,255,255,0.85)"
            />
            <text
              x="210"
              y="219"
              textAnchor="middle"
              fontSize="16"
              fontWeight="900"
              fill="rgba(20,20,20,0.75)"
              style={{ userSelect: "none" }}>
              {age}
            </text>
          </g>
        </CakeSVG>
      </CakeButton>

      <CakeState>{lit ? "" : "💨 는 개뻥 ~~ "}</CakeState>
    </CakeWrap>
  );
}

/* ================== styles ================== */

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0 ;
    padding: 0;
    background: #fff;
    color: #141414;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
      "Apple SD Gothic Neo", "Noto Sans KR", Arial;
    overflow-x: hidden;
  }
`;

const Page = styled.main`
  width: 100%;
  min-height: 100vh;

  --p: 0;

  background: radial-gradient(
      900px 480px at 50% -10%,
      rgba(247, 144, 9, calc(0.18 + var(--p) * 0.1)),
      transparent 60%
    ),
    radial-gradient(
      900px 520px at 12% 30%,
      rgba(255, 90, 114, calc(0.1 + var(--p) * 0.08)),
      transparent 55%
    ),
    radial-gradient(
      900px 520px at 90% 75%,
      rgba(189, 224, 254, calc(0.06 + var(--p) * 0.1)),
      transparent 55%
    ),
    #fff;
`;

const Section = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 24px 0;
`;

const Container = styled.div`
  width: 100%;
  max-width: 720px; /* ✅ 여기 */
  margin: 0 auto; /* ✅ 여기 */
  padding: 0 16px;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
`;

const CenterBlock = styled.div`
  width: 100%;
  max-width: 720px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Kicker = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: rgba(20, 20, 20, 0.62);
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(180deg, #fec84b, #f79009);
`;

const H1 = styled.h1`
  margin: 12px 0 10px;
  font-size: clamp(30px, 5vw, 54px);
  letter-spacing: -0.035em;
  line-height: 1.05;
`;

const Sub = styled.p`
  margin: 0;
  max-width: 58ch;
  color: rgba(20, 20, 20, 0.62);
  line-height: 1.75;
  font-size: 15px;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 32px;
`;

const Button = styled.button`
  cursor: pointer;
  border: 1px solid rgba(20, 20, 20, 0.1);
  background: white;
  color: #141414;
  padding: 11px 14px;
  border-radius: 999px;
  font-weight: 800;
  transition: transform 120ms ease, background 120ms ease,
    border-color 120ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(20, 20, 20, 0.18);
    background: rgba(255, 90, 114, 0.05);
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(180deg, #f79009, #f79009);
  border-color: transparent;
  color: white;
  font-weight: 500;

  &:hover {
    background: linear-gradient(180deg, #f79009, #f79009);
    filter: brightness(0.98);
  }
`;

const Divider = styled.div`
  width: 100%;
  max-width: 720px;
  height: 1px;
  background: rgba(20, 20, 20, 0.1);
  margin: 38px 0 0;
`;

const Side = styled.aside`
  width: 100%;
  max-width: 720px;
  margin-top: 10px;
`;

const SideTitle = styled.div`
  font-weight: 900;
  letter-spacing: -0.02em;
  text-align: center;
  margin: 0 0 10px;
`;

const IframeWrap = styled.div`
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(20, 20, 20, 0.1);
  background: #000;
`;

const SideHint = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: rgba(20, 20, 20, 0.62);
  text-align: center;
  line-height: 1.6;
`;

const PolaroidStack = styled.div`
  width: 100%;
  max-width: 85vw;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;
`;

const Polaroid = styled.div`
  width: 90%;
  max-width: 85vw;
  margin: 0 auto;
  position: relative;
  border-radius: 20px;
  background: #fff;
  border: 1px solid rgba(20, 20, 20, 0.08);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.1);
  padding: 12px 12px 14px;
  transition: transform 180ms ease, box-shadow 180ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.14);
  }

  /* 테이프 (회전 없이 중앙 고정) */
  &::before {
    content: "";
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 110px;
    height: 26px;
    border-radius: 7px;
    background: rgba(245, 215, 160, 0.6);
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 7px 16px rgba(0, 0, 0, 0.08);
  }
`;

const PolaroidFrame = styled.div`
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: #f4f4f4;
  border: 1px solid rgba(20, 20, 20, 0.08);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35);
`;

const PolaroidImg = styled.img<{ $orientation?: "portrait" | "landscape" }>`
  width: 100%;
  display: block;
  object-fit: cover;

  aspect-ratio: ${({ $orientation }) =>
    $orientation === "landscape" ? "4 / 3" : "3 / 4"};
`;

const PolaroidCaption = styled.div`
  margin-top: 10px;
  padding: 6px 6px 0;
  text-align: center;
  font-weight: 800;
  color: rgba(20, 20, 20, 0.72);
  font-size: 14px;
  line-height: 1.4;
`;

const FooterInner = styled.div`
  width: 100%;
  max-width: 720px;
  text-align: center;
  color: rgba(20, 20, 20, 0.62);
  font-size: 12px;
  line-height: 1.7;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: grid;
  place-items: center;
  padding: 18px;
  z-index: 9998;

  /* ✅ iOS/모바일에서 주소창/노치 때문에 잘리는거 방지 */
  overflow: auto;

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const Modal = styled.div`
  width: min(360px, 80vw);
  max-height: 85vh; /* ✅ 화면을 넘기지 않게 */
  overflow: auto; /* ✅ 내용이 길면 모달 내부 스크롤 */
  -webkit-overflow-scrolling: touch;

  background: white;
  border: 1px solid rgba(20, 20, 20, 0.14);
  border-radius: 20px;
  padding: 18px;
  // text-align: center;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.18);
`;

const ModalTitle = styled.h3`
  margin: 6px 0 12px;
  font-size: 22px;
  letter-spacing: -0.02em;
`;

const Letter = styled.div`
  border: 1px solid rgba(20, 20, 20, 0.1);
  border-radius: 16px;
  padding: 14px;
  text-align: left;

  white-space: pre-wrap;
  line-height: 1.75;
  color: rgba(20, 20, 20, 0.78);
  background: rgba(255, 90, 114, 0.03);

  overflow-wrap: anywhere; /* ✅ 긴 문자열/이모지/URL도 줄바꿈 */
  word-break: break-word; /* ✅ 추가 안전장치 */
`;

const Toast = styled.div`
  position: fixed;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  background: rgba(20, 20, 20, 0.82);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 10px 12px;
  border-radius: 999px;
  font-size: 13px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 160ms ease, transform 160ms ease;
  z-index: 9999;

  &.show {
    opacity: 1;
    transform: translateX(-50%) translateY(-6px);
  }
`;

const CakeWrap = styled.div`
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  text-align: center;
  display: grid;
  gap: 8px;
`;

const CakeTitle = styled.div`
  font-weight: 900;
  letter-spacing: -0.02em;
  font-size: 16px;
`;

const CakeHint = styled.div`
  font-size: 12px;
  color: rgba(20, 20, 20, 0.62);
`;

const CakeState = styled.div`
  font-size: 12px;
  color: rgba(20, 20, 20, 0.62);
`;

const CakeButton = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  margin: 0 auto;
  cursor: pointer;
  width: 100%;
  -webkit-tap-highlight-color: transparent;

  &:active {
    transform: scale(0.99);
  }
`;

const CakeSVG = styled.svg`
  width: 100%;
  height: auto;
  display: block;

  filter: drop-shadow(0 18px 40px rgba(0, 0, 0, 0.1));

  /* 촛불 깜빡임 */
  .flame {
    transform-origin: 210px 74px;
    animation: flameFlicker 1.1s infinite ease-in-out;
  }
  .flameInner {
    animation-duration: 0.9s;
  }

  /* 스파크 */
  .spark {
    transform-origin: center;
    animation: sparkFloat 1.3s infinite ease-in-out;
  }
  .spark2 {
    transform-origin: center;
    animation: sparkFloat2 1.1s infinite ease-in-out;
  }

  /* 연기 */
  .smoke {
    animation: smokeRise 1.2s ease-out forwards;
  }
  .smoke2 {
    animation: smokeRise2 1.4s ease-out forwards;
  }

  @keyframes flameFlicker {
    0% {
      transform: rotate(-2deg) scale(0.98);
      opacity: 0.95;
    }
    50% {
      transform: rotate(2deg) scale(1.02);
      opacity: 1;
    }
    100% {
      transform: rotate(-1deg) scale(0.99);
      opacity: 0.96;
    }
  }

  @keyframes sparkFloat {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 0.8;
    }
    60% {
      transform: translate(4px, -10px) scale(1.1);
      opacity: 0.9;
    }
    100% {
      transform: translate(2px, -16px) scale(0.9);
      opacity: 0;
    }
  }

  @keyframes sparkFloat2 {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 0.7;
    }
    60% {
      transform: translate(-4px, -9px) scale(1.05);
      opacity: 0.85;
    }
    100% {
      transform: translate(-2px, -14px) scale(0.9);
      opacity: 0;
    }
  }

  @keyframes smokeRise {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }
    20% {
      opacity: 0.35;
    }
    100% {
      opacity: 0;
      transform: translateY(-18px);
    }
  }

  @keyframes smokeRise2 {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    25% {
      opacity: 0.28;
    }
    100% {
      opacity: 0;
      transform: translateY(-22px);
    }
  }

  /* 접근성: 모션 최소화 */
  @media (prefers-reduced-motion: reduce) {
    .flame,
    .spark,
    .spark2,
    .smoke,
    .smoke2 {
      animation: none !important;
    }
  }
`;
