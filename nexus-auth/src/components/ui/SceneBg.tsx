export default function SceneBg() {
  return (
    <div className="scene-bg" aria-hidden="true">
      {/* Gradient blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />

      {/* Subtle grid */}
      <div className="grid-overlay" />

      {/* Edge vignette */}
      <div className="vignette" />
    </div>
  );
}
