import { useState } from "react";

export default function GenerateButton({ generateImage, loading: externalLoading, staffMode}) {
  const [repeatCount, setRepeatCount] = useState(1);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setProgress(0);

    for (let i = 0; i < repeatCount; i++) {
        console.log(`Generating image ${i + 1} of ${repeatCount}`);
      generateImage();
      setProgress(i + 1);

      if (i < repeatCount - 1) {
        await new Promise((resolve) => setTimeout(resolve, 60000)); // 60s
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Pasek postępu */}
      {loading && (
        <div className="w-full bg-gray-700 rounded-lg overflow-hidden h-4">
          <div
            className="bg-[#6d8f91] h-4 transition-all duration-300"
            style={{ width: `${(progress / repeatCount) * 100}%` }}
          />
        </div>
      )}

      <div className="flex items-center justify-center gap-4 w-full">
        {/* Główny przycisk */}
        <button
          onClick={handleGenerate}
          disabled={loading || externalLoading}
          className="flex-1 py-4 text-lg rounded-xl font-bold bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f] hover:opacity-90 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? `Generating ${progress}/${repeatCount}...` : "Generate"}
        </button>

        {/* Select widoczny tylko w staff mode */}
        {staffMode && (
          <select
            name="repeat"
            value={repeatCount}
            onChange={(e) => setRepeatCount(Number(e.target.value))}
            className="w-auto p-2 rounded-lg bg-[#374b4b] text-[#d2e4e2] font-semibold focus:outline-none focus:ring-2 focus:ring-[#afe5e6] transition cursor-pointer"
          >
            <option value="">Choose repeats</option>
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
