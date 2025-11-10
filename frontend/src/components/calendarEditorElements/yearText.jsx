import { useState, useEffect } from "react";

const YearText = ({
  yearText,
  setYearText,
  yearColor,
  setYearColor,
  yearFontSize,
  setYearFontSize,
  yearFontFamily,
  setYearFontFamily,
  yearFontWeight,
  setYearFontWeight,
  yearPosition,
  setYearPosition,
  setYearActive,
  yearActive,
  dragging,
  setXLimits,
  setYLimits,
  xLimits,
  yLimits,
}) => {
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (dragging) {
      setIsCustom(true);
    }
  }, [dragging]);

  const handleYearPositionChange = (value) => {
    let newPosition = {};

    switch (value) {
      case "top-left":
        newPosition = { position: value, coords: { x: 0, y: 0 } };
        isCustom && setIsCustom(false);
        break;
      case "top-center":
        newPosition = { position: value, coords: { x: 50, y: 0 } };
        isCustom && setIsCustom(false);
        break;
      case "top-right":
        newPosition = { position: value, coords: { x: 100, y: 0 } };
        isCustom && setIsCustom(false);
        break;
      case "center-left":
        newPosition = { position: value, coords: { x: 0, y: 50 } }; 
        isCustom && setIsCustom(false);
        break;
      case "center":
        newPosition = { position: value, coords: { x: 50, y: 50 } };
        isCustom && setIsCustom(false);
        break;
      case "center-right":
        newPosition = { position: value, coords: { x: 100, y: 50 } };
        isCustom && setIsCustom(false);
        break;
      case "bottom-left":
        newPosition = { position: value, coords: { x: 0, y: 100 } };
        isCustom && setIsCustom(false);
        break;
      case "bottom-center":
        newPosition = { position: value, coords: { x: 50, y: 100 } };
        isCustom && setIsCustom(false);
        break;
      case "bottom-right":
        newPosition = { position: value, coords: { x: 100, y: 100 } };
        isCustom && setIsCustom(false);
        break;
      case "custom":
        newPosition = { position: "custom", coords: yearPosition.coords };
        break;
      default:
        newPosition = yearPosition;
    }

    setYearPosition(newPosition);
  };

  const updateLimitsByFontSize = (fontSize) => {
    if (fontSize <= 24) {
      setXLimits({ min: 50, max: 325 });
      setYLimits({ min: 20, max: 235 });
    } else if (fontSize <= 48) {
      setXLimits({ min: 60, max: 300 });
      setYLimits({ min: 30, max: 220 });
    } else {
      setXLimits({ min: 90, max: 280 });
      setYLimits({ min: 40, max: 200 });
    }
  };

  const handleFontSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setYearFontSize(newSize);
    updateLimitsByFontSize(newSize);

    setYearPosition((prev) => ({
      ...prev,
      coords: {
        x: Math.min(Math.max(prev.coords.x, xLimits.min), xLimits.max),
        y: Math.min(Math.max(prev.coords.y, yLimits.min), yLimits.max),
      },
    }));
  };

  return (
    <div className="bg-[#2a2b2b] rounded-4xl p-4 shadow-lg mt-4 space-y-4">
      <h3 className="flex items-center gap-3 text-base font-semibold text-[#d2e4e2]">
        Napis z rokiem
        <div
          onClick={() => setYearActive(!yearActive)}
          className={`relative w-12 h-6 flex items-center rounded-full cursor-pointer transition-all duration-300 ${
            yearActive ? "bg-[#6d8f91]" : "bg-[#374b4b]"
          }`}
        >
          <div
            className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center text-[10px] font-bold ${
              yearActive
                ? "translate-x-6 text-[#6d8f91]"
                : "translate-x-[2px] text-[#374b4b]"
            }`}
          >
            {yearActive ? "ON" : "OFF"}
          </div>
        </div>
      </h3>

      {/* Rok */}
      <div className="flex   gap-4">
        {/* Wybór roku */}
        <div className="w-1/2 ">
          <label className="block text-sm font-medium text-[#d2e4e2] mb-1">
            Wybierz rok
          </label>
          <select
            value={yearText}
            onChange={(e) => setYearText(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b] hover:border-[#6d8f91] transition-colors"
          >
            {Array.from({ length: 11 }, (_, i) => 2020 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Kolor */}
        <div className="w-1/2">
          <label className="block text-sm font-medium text-[#d2e4e2] mb-1">
            Kolor napisu
          </label>
          <input
            type="color"
            value={yearColor}
            onChange={(e) => setYearColor(e.target.value)}
            className="w-full h-12 rounded-lg cursor-pointer bg-transparent border border-[#374b4b] hover:border-[#6d8f91] transition-colors"
          />
        </div>
      </div>

      {/* Rozmiar */}
      <div className="mb-0">
        <label className="block text-sm font-medium text-[#d2e4e2] mb-1">
          Rozmiar czcionki (px)
        </label>
        <input
          type="range"
          min="12"
          max="72"
          value={yearFontSize}
          onChange={handleFontSizeChange}
          className="w-full accent-[#6d8f91]"
        />
        <div className="text-xs text-[#989c9e] text-right">
          {yearFontSize}px
        </div>
      </div>

      {/* Czcionka */}
      <div>
        <label className="block text-sm font-medium text-[#d2e4e2] mb-1">
          Rodzaj czcionki
        </label>
        <select
          value={yearFontFamily}
          onChange={(e) => setYearFontFamily(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b] hover:border-[#6d8f91]"
        >
          <option value="Arial">Arial</option>
          <option value="'Roboto', sans-serif">Roboto</option>
          <option value="'Montserrat', sans-serif">Montserrat</option>
          <option value="Georgia">Georgia</option>
          <option value="'Courier New', monospace">Courier New</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
        </select>
      </div>

      {/* Grubość */}
      <div>
        <label className="block text-sm font-medium text-[#d2e4e2] mb-1">
          Grubość czcionki
        </label>
        <select
          value={yearFontWeight}
          onChange={(e) => setYearFontWeight(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b] hover:border-[#6d8f91]"
        >
          <option value="normal">Normal</option>
          <option value="bold">Pogrubiona</option>
          <option value="bolder">Bardziej pogrubiona</option>
          <option value="lighter">Lżejsza</option>
        </select>
      </div>

      {/* Pozycja */}
      <div>
        <label className="block text-sm font-medium text-[#d2e4e2] mb-1">
          Pozycja napisu
        </label>
        <select
          value={isCustom ? "custom" : yearPosition.position}
          onChange={(e) => handleYearPositionChange(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b] hover:border-[#6d8f91]"
        >
          <option value="top-left">Góra - lewo</option>
          <option value="top-center">Góra - środek</option>
          <option value="top-right">Góra - prawo</option>
          <option value="center-left">Środek - lewo</option>
          <option value="center">Środek - środek</option>
          <option value="center-right">Środek - prawo</option>
          <option value="bottom-left">Dół - lewo</option>
          <option value="bottom-center">Dół - środek</option>
          <option value="bottom-right">Dół - prawo</option>
          {isCustom && (
            <option value="custom">
              Własna (X:{yearPosition.coords.x}, Y:{yearPosition.coords.y})
            </option>
          )}
        </select>

        {isCustom && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-[#d2e4e2] mb-1">
                X ({xLimits.min} - {xLimits.max})
              </label>
              <input
                type="number"
                min={xLimits.min}
                max={xLimits.max}
                value={yearPosition.coords.x}
                onChange={(e) => {
                  let val = Number(e.target.value);
                  if (val < xLimits.min) val = xLimits.min;
                  if (val > xLimits.max) val = xLimits.max;
                  setYearPosition((prev) => ({
                    ...prev,
                    coords: { ...prev.coords, x: val },
                  }));
                }}
                className="w-full rounded-lg px-2 py-1 text-sm bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#d2e4e2] mb-1">
                Y ({yLimits.min} - {yLimits.max})
              </label>
              <input
                type="number"
                min={yLimits.min}
                max={yLimits.max}
                value={yearPosition.coords.y}
                onChange={(e) => {
                  let val = Number(e.target.value);
                  if (val < yLimits.min) val = yLimits.min;
                  if (val > yLimits.max) val = yLimits.max;
                  setYearPosition((prev) => ({
                    ...prev,
                    coords: { ...prev.coords, y: val },
                  }));
                }}
                className="w-full rounded-lg px-2 py-1 text-sm bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YearText;
