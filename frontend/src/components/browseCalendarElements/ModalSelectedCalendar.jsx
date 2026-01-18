import React, { useState } from "react";

// WAŻNE: Jeśli odkomentujesz sekcję podglądu kalendarza, musisz zaimportować te funkcje:
// import { getBottomSectionBackground } from "twoja-sciezka/utils";
// import { getPaddingTopFromText } from "twoja-sciezka/textPadding";
// const months = ["Styczeń", "Luty", ...]; 

const CalendarDetailsModal = ({ 
  selectedCalendar, 
  onClose, 
  onDelete, 
  onAddToProduction 
}) => {
  // Stan formularza przeniesiony lokalnie
  const [quantity, setQuantity] = useState("");
  const [deadline, setDeadline] = useState("");
  const [note, setNote] = useState("");

  if (!selectedCalendar) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Przekazujemy ID oraz dane z formularza do rodzica
    onAddToProduction(selectedCalendar.id, { quantity, deadline, note });
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <div
        className="relative max-w-6xl w-full bg-[#1e1f1f] rounded-2xl shadow-lg overflow-hidden flex gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Zamknij modal */}
        <button
          className="absolute top-3 right-3 text-white text-2xl hover:text-[#a0f0f0] transition"
          onClick={onClose}
        >
          ✕
        </button>

        {/* --- TU BYŁA SEKCJA PODGLĄDU KALENDARZA (zakomentowana) --- 
            Jeśli chcesz ją przywrócić, upewnij się, że zaimportowałeś 
            funkcje pomocnicze (getBottomSectionBackground itp.)
        */}
        
        {/* Panel boczny z nazwą i przyciskami */}
        <div className="flex flex-col justify-start p-6 text-white flex-1">
          <h2 className="text-3xl font-bold mb-6">
            {selectedCalendar.name}
          </h2>

          {/* === PANEL PRODUKCJI === */}
          <div className="bg-[#2a2b2b] rounded-4xl p-8 shadow-lg mb-6">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Dodaj do produkcji
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* ILOŚĆ */}
              <div>
                <label className="block text-xs font-semibold text-[#989c9e] uppercase mb-2">
                  Ilość
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Podaj ilość"
                  className="w-full p-3 rounded-xl bg-[#d2e4e2] text-[#1e1f1f] placeholder:text-[#595f5e] focus:outline-none focus:ring-2 focus:ring-[#afe5e6] transition"
                  required
                />
              </div>

              {/* DEADLINE */}
              <div>
                <label className="block text-xs font-semibold text-[#989c9e] uppercase mb-2">
                  Termin realizacji
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#d2e4e2] text-[#1e1f1f] focus:outline-none focus:ring-2 focus:ring-[#afe5e6] transition"
                />
              </div>

              {/* NOTATKA */}
              <div>
                <label className="block text-xs font-semibold text-[#989c9e] uppercase mb-2">
                  Notatka dla produkcji
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Np. rodzaj papieru, format, wykończenie..."
                  className="w-full p-4 rounded-xl bg-[#d2e4e2] text-[#1e1f1f] placeholder:text-[#595f5e] focus:outline-none focus:ring-2 focus:ring-[#afe5e6] transition"
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full py-4 text-lg rounded-xl font-bold bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f] hover:opacity-90 transition-all duration-300 disabled:opacity-50"
              >
                Dodaj do produkcji
              </button>
            </form>
          </div>

          {/* === USUWANIE === */}
          <button
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            onClick={() => onDelete(selectedCalendar.id)}
          >
            Usuń
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarDetailsModal;