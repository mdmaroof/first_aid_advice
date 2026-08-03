import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SnapAid — Instant first aid guidance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(160deg, #d9ecee 0%, #c5e0e4 40%, #0A6B6F 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 88,
            height: 88,
            borderRadius: 20,
            background: "#0A6B6F",
            marginBottom: 36,
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 9a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4a1 1 0 0 1 1 1v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4a1 1 0 0 1 1-1h4a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-4a1 1 0 0 1-1-1V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4a1 1 0 0 1-1 1z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#122026",
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          SnapAid
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#4F646C",
            maxWidth: 780,
            lineHeight: 1.35,
          }}
        >
          Instant first-aid steps for emergencies — clear guidance when every
          second counts.
        </div>
      </div>
    ),
    { ...size }
  );
}
