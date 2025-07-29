import React from 'react'

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
   
    setYearPosition}) => {





    return (
        <div className="border rounded p-4 space-y-3">
            <h2 className="text-lg font-semibold">Napis z rokiem</h2>

            {/* Select z latami */}
            <div>
                <label className="block text-sm font-medium mb-1">Wybierz rok</label>
                <select
                    value={yearText}
                    onChange={(e) => setYearText(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                >
                    {Array.from({ length: 11 }, (_, i) => 2020 + i).map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Kolor napisu</label>
                <input
                    type="color"
                    value={yearColor}
                    onChange={(e) => setYearColor(e.target.value)}
                    className="w-full h-10 border rounded"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Rozmiar czcionki (px)</label>
                <input
                    type="range"
                    min="12"
                    max="72"
                    value={yearFontSize}
                    onChange={(e) => setYearFontSize(Number(e.target.value))}
                    className="w-full"
                />
                <div className="text-xs text-gray-600 text-right">{yearFontSize}px</div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Rodzaj czcionki</label>
                <select
                    value={yearFontFamily}
                    onChange={(e) => setYearFontFamily(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
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
            <div>
                <label className="block text-sm font-medium mb-1">Grubość czcionki</label>
                <select
                    value={yearFontWeight}
                    onChange={(e) => setYearFontWeight(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                >
                    <option value="normal">Normal</option>
                    <option value="bold">Pogrubiona</option>
                    <option value="bolder">Bardziej pogrubiona</option>
                    <option value="lighter">Lżejsza</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Pozycja napisu</label>
                <select
                    value={yearPosition}
                    onChange={(e) => setYearPosition(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
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
                </select>
            </div>
        </div>
    )
}

export default YearText