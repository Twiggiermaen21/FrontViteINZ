import { useState, useEffect } from "react";

export default function FlappyBirdPage() {
  const [birdY, setBirdY] = useState(200);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([{ x: 400, gap: 150, scored: false }]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const gravity = 0.5;
  const jumpStrength = -8;
  const gameHeight = 400;
  const pipeWidth = 50;

  // parametry dynamiczne
  const baseGap = 180;
  const minGap = 110; // minimalna przerwa między rurami
  const baseSpeed = 2;
  const maxSpeed = 4; // maksymalna prędkość
  const spawnDelay = 3500; // co ile ms tworzyć rurę

  // obliczamy trudność zależną od wyniku
  const gapSize = Math.max(baseGap - score * 5, minGap);
  const pipeSpeed = Math.min(baseSpeed + score * 0.1, maxSpeed);

  // Ruch + grawitacja
  useEffect(() => {
    if (gameOver) return;

    const loop = setInterval(() => {
      setBirdY((y) => y + velocity);
      setVelocity((v) => v + gravity);

      setPipes((pipes) =>
        pipes
          .map((p) => ({ ...p, x: p.x - pipeSpeed }))
          .filter((p) => p.x > -pipeWidth)
      );
    }, 30);

    return () => clearInterval(loop);
  }, [velocity, gameOver, pipeSpeed]);

  // Generowanie rur
  useEffect(() => {
    if (gameOver) return;

    const pipeGen = setInterval(() => {
      const randomGap = Math.random() * 180 + 100; // środek otworu
      setPipes((p) => [
        ...p,
        { x: 400, gap: randomGap, scored: false },
      ]);
    }, spawnDelay);

    return () => clearInterval(pipeGen);
  }, [gameOver]);

  // Kolizje + punkty
  useEffect(() => {
    const birdTop = birdY;
    const birdBottom = birdY + 24;

    if (birdTop < 0 || birdBottom > gameHeight) {
      setGameOver(true);
    }

    setPipes((pipes) =>
      pipes.map((pipe) => {
        // kolizja
        if (pipe.x < 80 && pipe.x + pipeWidth > 40) {
          if (birdTop < pipe.gap - gapSize / 2 || birdBottom > pipe.gap + gapSize / 2) {
            setGameOver(true);
          }
        }

        // naliczanie punktu (tylko raz)
        if (!pipe.scored && pipe.x + pipeWidth < 40) {
          setScore((s) => s + 1);
          return { ...pipe, scored: true };
        }

        return pipe;
      })
    );
  }, [birdY]);

  // Skok / restart
  const handleJump = () => {
    if (gameOver) {
      setBirdY(200);
      setVelocity(0);
      setPipes([{ x: 400, gap: 150, scored: false }]);
      setScore(0);
      setGameOver(false);
    } else {
      setVelocity(jumpStrength);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleJump);
    return () => window.removeEventListener("keydown", handleJump);
  }, [gameOver]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1e1f1f] text-white">
      <h1 className="text-2xl font-bold mb-4">🐤 Flappy Bird</h1>

      <div
        className="relative bg-sky-300 overflow-hidden rounded-3xl shadow-inner"
        style={{ width: 400, height: gameHeight }}
        onClick={handleJump}
      >
        {/* Bird */}
        <img
          src="/bird.png"
          alt="bird"
          className="absolute"
          style={{
            left: 50,
            top: birdY,
            width: 32,
            height: 24,
          }}
        />

        {/* Pipes */}
        {pipes.map((pipe, i) => (
          <div key={i}>
            {/* Górna rura */}
            <img
              src="/pipe_bottom.png"
              alt="pipe top"
              className="absolute"
              style={{
                left: pipe.x,
                top: 0,
                width: pipeWidth,
                height: pipe.gap - gapSize / 2,
                transform: "rotate(180deg)",
              }}
            />

            {/* Dolna rura */}
            <img
              src="/pipe_bottom.png"
              alt="pipe bottom"
              className="absolute"
              style={{
                left: pipe.x,
                top: pipe.gap + gapSize / 2,
                width: pipeWidth,
                height: gameHeight - (pipe.gap + gapSize / 2),
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 text-lg">
        {gameOver ? (
          <span className="text-red-400 font-bold">💀 Game Over</span>
        ) : (
          <>
            <div>Score: {score}</div>
            <div className="text-sm text-gray-300">
              Gap: {gapSize.toFixed(0)} | Speed: {pipeSpeed.toFixed(1)}
            </div>
          </>
        )}
      </div>

      <button
        onClick={handleJump}
        className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f] font-bold hover:opacity-90 transition-all duration-300"
      >
        {gameOver ? "Restart" : "Jump"}
      </button>
    </div>
  );
}
