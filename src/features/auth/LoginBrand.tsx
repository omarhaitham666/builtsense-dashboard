import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import "./LoginBrand.css";

const REST_PITCH = -7;
const REST_YAW = -12;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function LoginBrand() {
  const shapeId = useId();
  const hintId = useId();
  const rotor = useRef<HTMLSpanElement>(null);
  const reducedMotion = useRef(false);
  const rotation = useRef({ pitch: REST_PITCH, yaw: REST_YAW });

  const drag = useRef<{
    pointerId: number;
    x: number;
    y: number;
    pitch: number;
    yaw: number;
  } | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    function syncPreference() {
      reducedMotion.current = media.matches;
    }

    syncPreference();
    media.addEventListener("change", syncPreference);
    return () => media.removeEventListener("change", syncPreference);
  }, []);

  function rotate(pitch: number, yaw: number) {
    rotation.current = { pitch, yaw };

    if (rotor.current) {
      rotor.current.style.setProperty("--pitch", `${pitch}deg`);
      rotor.current.style.setProperty("--yaw", `${yaw}deg`);
    }
  }

  function startDrag(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0 || drag.current) return;

    drag.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      ...rotation.current,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = "true";
  }

  function movePointer(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary) return;

    const activeDrag = drag.current;

    if (activeDrag) {
      if (activeDrag.pointerId !== event.pointerId) return;

      const dx = event.clientX - activeDrag.x;
      const dy = event.clientY - activeDrag.y;

      rotate(
        clamp(activeDrag.pitch - dy * 0.65, -65, 65),
        activeDrag.yaw + dx * 1.5,
      );
      return;
    }

    if (event.pointerType !== "mouse" || reducedMotion.current) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    rotate(REST_PITCH - y * 26, REST_YAW + x * 40);
  }

  function endDrag(event: PointerEvent<HTMLButtonElement>) {
    if (drag.current?.pointerId !== event.pointerId) return;

    drag.current = null;
    delete event.currentTarget.dataset.dragging;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    // نرجع لأقرب وضع أمامي عشان العلامة متلفش كذا لفة عكسية.
    const turns = Math.round((rotation.current.yaw - REST_YAW) / 360);
    rotate(REST_PITCH, REST_YAW + turns * 360);
  }

  function resetRotation() {
    rotate(REST_PITCH, REST_YAW);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const { pitch, yaw } = rotation.current;

    switch (event.key) {
      case "ArrowLeft":
        rotate(pitch, yaw - 20);
        break;
      case "ArrowRight":
        rotate(pitch, yaw + 20);
        break;
      case "ArrowUp":
        rotate(clamp(pitch + 12, -65, 65), yaw);
        break;
      case "ArrowDown":
        rotate(clamp(pitch - 12, -65, 65), yaw);
        break;
      case "Home":
        resetRotation();
        break;
      default:
        return;
    }

    event.preventDefault();
  }

  return (
    <div className="bs-login-brand bs-brand-interactive" dir="ltr">
      <button
        type="button"
        className="bs-brand-stage"
        aria-label="تدوير علامة Built Sense"
        aria-describedby={hintId}
        title="اسحب لتدوير العلامة"
        onPointerDown={startDrag}
        onPointerMove={movePointer}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onPointerLeave={() => {
          if (!drag.current) {
            const turns = Math.round((rotation.current.yaw - REST_YAW) / 360);
            rotate(REST_PITCH, REST_YAW + turns * 360);
          }
        }}
        onKeyDown={handleKeyDown}
        onClick={(event) => {
          if (event.detail === 0) resetRotation();
        }}
      >
        <span className="bs-brand-intro" aria-hidden="true">
          <span ref={rotor} className="bs-brand-rotor">
            <svg className="bs-brand-face bs-brand-depth" viewBox="0 0 60 80">
              <path
                id={shapeId}
                d="M4 2 31 17V33L58 48V64L31 79 4 64Z"
                fill="currentColor"
              />
            </svg>

            <svg className="bs-brand-face bs-brand-middle" viewBox="0 0 60 80">
              <use href={`#${shapeId}`} fill="currentColor" />
            </svg>

            <svg className="bs-brand-face bs-brand-front" viewBox="0 0 60 80">
              <path d="M4 2 31 17 4 33Z" fill="#A8D1FF" />
              <path d="M31 33 58 48 31 64Z" fill="#76A8FF" />
              <path d="M4 33 31 17V64L58 48V64L31 79 4 64Z" fill="#477BCB" />
            </svg>
          </span>
        </span>
      </button>

      <span className="bs-login-wordmark">
        Built <span>Sense</span>
      </span>

      <span id={hintId} className="bs-brand-sr-only" lang="ar">
        اسحب لتدوير العلامة، أو استخدم مفاتيح الأسهم. اضغط Home لإعادتها.
      </span>
    </div>
  );
}