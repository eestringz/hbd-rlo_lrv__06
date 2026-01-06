/** @format */
import { useMemo, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";

type Photo = { src: string };

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
  const YT_EMBED_URL = "https://www.youtube.com/embed/5qap5aO4i9A";

  const LETTER_TITLE = "세은에게";
  const LETTER = `생일 축하해 막내야!

올해는 네가 원하는 일들 다 잘 풀리고,
매일 건강하면 좋겠다 😀😆

PS. 고마우면 숙소 좀 알아봐라`;

  // ✅ 캡션 제거: 사진만
  const base = import.meta.env.BASE_URL;

  const photos: Photo[] = Array.from({ length: 14 }, (_, i) => ({
    src: `${base}photos/${String(i + 1).padStart(2, "0")}.jpeg`,
  }));

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
                  축하 폭죽
                </PrimaryButton>
              </Actions>

              <Divider />
            </CenterBlock>

            <Side>
              <SideTitle>🎉 축하~~~쏭! 🎈</SideTitle>
              <IframeWrap>
                <iframe
                  width="100%"
                  height="190"
                  src={YT_EMBED_URL}
                  title="music"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
              <Polaroid
                key={i}
                $r={i % 2 === 0 ? -1.2 : 1.2} // ✅ 모바일에서 치우침 방지: 회전 각도 최소
                $t={i % 2 === 0 ? -1.5 : 1.5}>
                <PolaroidFrame>
                  <PolaroidImg src={p.src} alt={`photo-${i}`} loading="lazy" />
                </PolaroidFrame>
                <PolaroidBlank />
              </Polaroid>
            ))}
          </PolaroidStack>
        </Container>
      </Section>

      <Section>
        <Container>
          <FooterInner>
            <Actions>
              <Button onClick={() => setIsLetterOpen(true)}>
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
            <ModalRow>
              <PrimaryButton
                onClick={() => {
                  confettiBurst(150);
                  showToast("🎉 생일 축하해!");
                }}>
                축하하기
              </PrimaryButton>
              <Button onClick={() => setIsLetterOpen(false)}>닫기</Button>
            </ModalRow>
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
    margin: 0;
    padding: 0;
    background: #fff;
    color: #141414;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
      "Apple SD Gothic Neo", "Noto Sans KR", Arial;
    overflow-x: hidden;
  }
`;

/**
 * ✅ 핵심: Section은 풀폭, Container는 항상 가운데 + 좌우 패딩 동일
 * - 모바일에서 "한쪽 붙음" 문제 대부분 여기서 해결됨
 */
const Section = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 24px 0;
`;

const Container = styled.div`
  width: 100%;
  max-width: 720px;
  padding-left: 16px;
  padding-right: 16px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 640px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const TopLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;

  @media (min-width: 980px) {
    display: grid;
    grid-template-columns: 720px 280px;
    justify-content: center;
    justify-items: center;
    align-items: start;
    column-gap: 22px;
  }
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
  background: linear-gradient(180deg, #ff8aa0, #ff5a72);
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
  background: linear-gradient(180deg, #ff8aa0, #ff5a72);
  border-color: transparent;
  color: white;

  &:hover {
    background: linear-gradient(180deg, #ff8aa0, #ff5a72);
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

  @media (min-width: 980px) {
    max-width: 280px;
    position: sticky;
    top: 16px;
  }
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
  max-width: 720px; /* ✅ 컨테이너 중앙 + 동일 폭 */
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 46px;
`;

const Polaroid = styled.div<{ $r: number; $t: number }>`
  width: 100%; /* ✅ 항상 중앙/풀폭 */
  max-width: 520px;
  margin: 0 auto;
  position: relative;
  border-radius: 22px;
  background: #fff;
  border: 1px solid rgba(20, 20, 20, 0.08);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  padding: 14px 14px 22px;
  transform: rotate(${(p) => p.$r}deg);
  transition: transform 180ms ease, box-shadow 180ms ease;

  &:hover {
    transform: rotate(${(p) => p.$r}deg) translateY(-2px);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.16);
  }

  &::before {
    content: "";
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%) rotate(${(p) => p.$t}deg);
    width: 120px;
    height: 28px;
    border-radius: 7px;
    background: rgba(245, 215, 160, 0.6);
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
  }

  /* ✅ 모바일에서 “치우쳐 보임” 원천 봉쇄 */
  @media (max-width: 480px) {
    max-width: 100%;
    transform: rotate(0deg);
    &::before {
      transform: translateX(-50%) rotate(0deg);
    }
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
  aspect-ratio: 4 / 3;
  object-fit: cover;
`;

const PolaroidBlank = styled.div`
  height: 18px;
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
`;

const Modal = styled.div`
  width: min(560px, 92vw);
  background: white;
  border: 1px solid rgba(20, 20, 20, 0.14);
  border-radius: 20px;
  padding: 18px;
  text-align: center;
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
`;

const ModalRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
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
