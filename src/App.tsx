/** @format */
import { useMemo, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";

type Photo = { src: string; caption: string };

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

export default function App() {
  const TITLE = `Happy BDAY!`;
  const SUBTITLE = "그녀의 25번째 생일을 축하하며!";
  // const YT_EMBED_URL = "https://www.youtube.com/embed/5qap5aO4i9A";

  const YT_EMBED_URL =
    "https://www.youtube-nocookie.com/embed/TOVO7MhYEtU?playsinline=1&rel=0";

  const LETTER_TITLE = "TO. 세은";
  const LETTER = `생일 축하해 막내야!

점심시간 투자해서 만들어봤다.
항상 건강하고 행복하자 ~ 😎🤗

ps. 혹시 고마우면 숙소 좀 알아봐라`;

  // ✅ 캡션 제거: 사진만
  const base = import.meta.env.BASE_URL;

  const photos: Photo[] = [
    { src: `${base}photos/01.jpeg`, caption: "1년전 그녀의 생일" },
    { src: `${base}photos/02.jpeg`, caption: "브이 1" },
    { src: `${base}photos/03.jpeg`, caption: "브이 2" },
    { src: `${base}photos/04.jpeg`, caption: "ㄹㅈㄷ 브이 귀신" },
    { src: `${base}photos/05.jpeg`, caption: "이거 너무 베이비 페이스여요ㅋ" },
    { src: `${base}photos/06.jpeg`, caption: "앞으로 브이 금지" },
    { src: `${base}photos/07.jpeg`, caption: "그냥 현지가 웃겨서 넣음" },
    { src: `${base}photos/08.jpeg`, caption: "나 그만 좋아해라 ~~~~" },
    { src: `${base}photos/09.jpeg`, caption: "자체 컨텐츠녀" },
    { src: `${base}photos/10.jpeg`, caption: "5개 정도 있는 단체사진 중 하나" },
    { src: `${base}photos/11.jpeg`, caption: "귀여워라" },
    // { src: `${base}photos/12.jpeg`, caption: "웃음 버튼 ㅋㅋ" },
    { src: `${base}photos/13.jpeg`, caption: "브이 압수" },
    {
      src: `${base}photos/14.jpeg`,
      caption: "너 생일파티만 기다리고 있어 🩵🤍",
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

  return (
    <>
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

              <Actions>
                <PrimaryButton
                  onClick={() => {
                    confettiBurst(180);
                    showToast("🎉 생일 축하해!");
                    scrollToId("photos");
                  }}>
                  클릭해보셔요
                </PrimaryButton>
              </Actions>

              <Divider />
            </CenterBlock>

            <Side>
              <SideTitle>🎉 축하~~~쏭! 🎈</SideTitle>
              <IframeWrap>
                <iframe
                  src={YT_EMBED_URL}
                  title="youtube-shorts"
                  width="100%"
                  height="520" // ✅ 쇼츠는 세로라 높이 크게
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </IframeWrap>
              <SideHint>bgm 레츠고</SideHint>
            </Side>
          </TopLayout>
        </Container>
      </Section>

      <Section id="photos">
        <Container>
          <PolaroidStack>
            {photos.map((p, i) => (
              <Polaroid key={i}>
                <PolaroidFrame>
                  <PolaroidImg src={p.src} alt={`photo-${i}`} loading="lazy" />
                </PolaroidFrame>
                <PolaroidCaption>{p.caption}</PolaroidCaption>
              </Polaroid>
            ))}
          </PolaroidStack>
        </Container>
      </Section>

      <Section>
        <Container>
          <FooterInner>
            <Actions>
              <Button
                onClick={() => {
                  setIsLetterOpen(true);
                  confettiBurst(150);
                }}>
                💌 내 마음 💌
              </Button>
            </Actions>
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
    </>
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
  margin-top: 16px;
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
  margin: 18px 0 0;
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
  max-width: 320px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;
`;

const Polaroid = styled.div`
  width: 100%;
  max-width: 320px;
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
`;

const PolaroidImg = styled.img`
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 3 / 4;
  object-fit: cover;
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
  flex-direction: column;
  align-items: center;
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
