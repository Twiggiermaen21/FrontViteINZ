import React, { useState } from "react";
import CalendarPreview from "./CalendarPreview.jsx";

const CalendarDetailsModal = ({
  selectedCalendar,
  onClose,
  onDelete,
  onAddToProduction,
  deadline,
  quantity,
  note,
  setDeadline,
  setQuantity,
  setNote,
}) => {
  // Logika daty: dzisiaj + 7 dni
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 7);
  const minDateString = minDate.toISOString().split("T")[0];

  if (!selectedCalendar) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Walidacja daty
    if (new Date(deadline) < minDate) {
      alert(
        "Termin realizacji musi być wyznaczony na co najmniej tydzień od dzisiaj.",
      );
      return;
    }

    // 1. Przekazanie danych do produkcji
    onAddToProduction(selectedCalendar.id, { quantity, deadline, note });

    // 2. ZAMKNIĘCIE MODALA
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-7xl h-[80vh] bg-[#1e1f1f] rounded-2xl shadow-lg overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-5 text-white text-2xl hover:text-[#a0f0f0] transition z-10 cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>

        {/* LEWA STRONA (1/3) */}
        <div className="w-1/3 bg-[#151616] border-r border-[#2a2b2b] flex justify-center overflow-hidden relative">
          <div className="w-full h-full overflow-y-auto custom-scroll flex justify-center py-6">
            <div className="[zoom:0.85] origin-top">
              <CalendarPreview calendar={selectedCalendar} />
            </div>
          </div>
        </div>

        {/* PRAWA STRONA (2/3) */}
        <div className="w-2/3 h-full overflow-y-auto custom-scroll p-8 text-white relative flex flex-col">
          <h2 className="text-3xl font-bold mb-6 pr-8">
            {selectedCalendar.name}
          </h2>

          <div className="bg-[#2a2b2b] rounded-3xl p-8 shadow-lg mb-6">
            <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider border-b border-gray-600 pb-2">
              Dodaj do produkcji
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#989c9e] uppercase mb-2">
                    Ilość
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Sztuk"
                    className="w-full p-3 rounded-xl bg-[#d2e4e2] text-[#1e1f1f] placeholder:text-[#595f5e] focus:outline-none focus:ring-2 focus:ring-[#afe5e6] transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#989c9e] uppercase mb-2">
                    Termin realizacji (min. 7 dni)
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    min={minDateString}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#d2e4e2] text-[#1e1f1f] focus:outline-none focus:ring-2 focus:ring-[#afe5e6] transition cursor-pointer"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#989c9e] uppercase mb-2">
                  Notatka dla produkcji
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Dodatkowe informacje..."
                  className="w-full p-4 rounded-xl bg-[#d2e4e2] text-[#1e1f1f] placeholder:text-[#595f5e] focus:outline-none focus:ring-2 focus:ring-[#afe5e6] transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 text-lg rounded-xl font-bold bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f] hover:opacity-90 transition-all duration-300 shadow-lg mt-2 cursor-pointer"
              >
                Dodaj do produkcji
              </button>
            </form>
          </div>

          <div className="mt-auto border-t border-[#2a2b2b] pt-6 flex justify-between items-center">
            <span className="text-gray-500 text-sm">
              ID: {selectedCalendar.id}
            </span>
            <button
              className="bg-red-900/20 text-red-400 border border-red-900/50 py-2 px-6 rounded-lg hover:bg-red-600 hover:text-white transition-all text-sm font-medium cursor-pointer"
              onClick={() => {
                onDelete(selectedCalendar.id);
                onClose(); // Opcjonalnie: zamyka modal również po usunięciu
              }}
            >
              Usuń projekt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarDetailsModal;
