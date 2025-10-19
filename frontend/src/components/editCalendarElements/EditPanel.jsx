// EditRightPanel.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ACCESS_TOKEN, fontFamilies, fontWeights } from "../../constants";
import TopImageSection from "./TopImageSection";
import BottomImageSection from "./BottomImageSection";
import YearText from "../calendarEditorElements/yearText";
import MonthEditor from "../calendarEditorElements/textOrImg";
import ImageEditor from "../calendarEditorElements/ImageEditor";
const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

const EditRightPanel = ({
  setPom,
  selectedCalendar,
  setYearActive,
  yearActive,
  setSelectedCalendar,
  yearPosition,
  setYearPosition,
  dragging,
  setDragging,
  isImageMode,
  setIsImageMode,
  imageScales,
  setImageScales,
  monthTexts,
  setMonthTexts,
  monthImages,
  setMonthImages,
  fontSettings,
  setFontSettings,

  yearText,
  setYearText,
  yearColor,
  setYearColor,
  yearFontSize,
  setYearFontSize,
  yearFontWeight,
  setYearFontWeight,
  yearFontFamily,
  setYearFontFamily,
}) => {
  const [style, setStyle] = useState(null);
  const styles = [
    { key: "style1", label: "Grafika + kolor" },
    { key: "style2", label: "Rozciągnięty gradient" },
    { key: "style3", label: "Grafika na całym tle" },
  ];
  const handleMonthTextChange = (index, value) => {
    setMonthTexts((prev) => prev.map((txt, i) => (i === index ? value : txt)));
  };
  const [openSection, setOpenSection] = useState("topImage");
  const [images, setImages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedImageUrl, setSelectedImageUrl] = useState(
    selectedCalendar?.top_image || null
  );
  const scrollRef = useRef(null);

  const months = ["Grudzień", "Styczeń", "Luty"];
  const [saving, setSaving] = useState(false);
  const [calendarName, setCalendarName] = useState(
    selectedCalendar?.name || ""
  );

  const [xLimits, setXLimits] = useState({ min: 50, max: 325 });
  const [yLimits, setYLimits] = useState({ min: 20, max: 235 });
  const initialYearLoaded = useRef(false);
  // 🔹 Pobieranie obrazów z backendu
  const fetchImages = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const res = await axios.get(`${apiUrl}/generate/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, page_size: 6 },
      });

      // 🔹 Scalanie bez duplikatów
      setImages((prev) => {
        const combined = [...prev, ...res.data.results];
        const unique = combined.filter(
          (v, i, a) => a.findIndex((item) => item.url === v.url) === i
        );
        return unique;
      });

      setHasMore(!!res.data.next);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Błąd podczas pobierania obrazów:", err);
      if (err.response?.status === 401) {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // 🔹 Pierwsze pobranie
  useEffect(() => {
    fetchImages();
  }, []);

  // 🔹 Infinite scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (loading || !hasMore) return; // ✅ zabezpieczenie

      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 50
      ) {
        fetchImages();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollRef, loading, hasMore]);

 
useEffect(()=>{
  setPom({
    
      text: yearText,
      color: yearColor,
      size: yearFontSize,
      weight: yearFontWeight,
      font: yearFontFamily,
      positionX: yearPosition.x,
      positionY: yearPosition.y,
    
  });
},[yearColor,yearText,yearFontFamily,yearFontSize,yearFontWeight,yearPosition])

  const toggleSection = (name) => {
    setOpenSection((prev) => (prev === name ? null : name));
  };

  const handleImageSelect = (img) => {
    setSelectedImageUrl(img);
    setSelectedCalendar((prev) => ({
      ...prev,
      top_image_url: img.url,
    }));
  };

  const handleSaveCalendar = async () => {
    setSaving(true);
    const formData = new FormData();
    const token = localStorage.getItem(ACCESS_TOKEN);
    // przykładowe pola
    formData.append("name", calendarName);
    formData.append("top_image", selectedImageUrl.id);
    // np. zmiana top_image jeśli wybierzesz nowy plik:
    // formData.append("top_image", fileInput.files[0]);
    try {
      const res = await axios.patch(
        `${apiUrl}/calendar/${selectedCalendar.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Kalendarz zaktualizowany ✅");
      // setCalendar(res.data);
      console.log("data", res.data);
    } catch (err) {
      console.error(err);
      alert("Błąd podczas zapisu ❌");
    } finally {
      setSaving(false);
    }
  };

  return (
   <div className="flex-1 bg-[#1f2020] rounded-2xl border p-6 border-gray-700 flex flex-col">
  {/* 🔹 Pasek zakładek */}
  <div className="flex flex-wrap justify-between bg-[#2a2b2b] rounded-xl p-2 mb-4 shadow-md">
    {[
      { key: "topImage", label: "🖼️ Image Górny" },
      { key: "yearText", label: "🖼️ Text Górny" },
      { key: "bottom", label: "🖼️ Text Dół" },
      { key: "months", label: "🗓️ Miesiące" },
      { key: "zapisz", label: "💾 Zapisz" },
    ].map(({ key, label }) => (
      <button
        key={key}
        onClick={() => toggleSection(key)}
        className={`flex-1 text-center py-2 px-3 rounded-lg font-medium transition-all duration-200 mx-1
          ${
            openSection === key
              ? "bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f] shadow-md"
              : "bg-[#3a3b3b] text-gray-300 hover:bg-[#404242] hover:text-white"
          }`}
      >
        {label}
      </button>
    ))}
  </div>
{openSection === "topImage" &&

(<TopImageSection
    openSection={openSection}
    toggleSection={toggleSection}
    images={images}
    selectedImageUrl={selectedImageUrl.url}
    setSelectedCalendar={setSelectedCalendar}
    selectedCalendar={selectedCalendar}
    setSelectedImageUrl={setSelectedImageUrl}
    handleImageSelect={handleImageSelect}
    loading={loading}
    hasMore={hasMore}
    scrollRef={scrollRef}
  />)


}
  {/* 🔹 Sekcje treści pod zakładkami */}
  <div className="flex-1 space-y-4">
    {openSection === "yearText" && (
      <YearText
        yearText={yearText}
        setYearText={setYearText}
        yearColor={yearColor}
        setYearColor={setYearColor}
        yearFontSize={yearFontSize}
        setYearFontSize={setYearFontSize}
        yearFontFamily={yearFontFamily}
        setYearFontFamily={setYearFontFamily}
        yearFontWeight={yearFontWeight}
        setYearFontWeight={setYearFontWeight}
        yearPosition={yearPosition}
        setYearPosition={setYearPosition}
        setYearActive={setYearActive}
        yearActive={yearActive}
        dragging={dragging}
        setXLimits={setXLimits}
        setYLimits={setYLimits}
        xLimits={xLimits}
        yLimits={yLimits}
      />
    )}

    {openSection === "bottom" && (
      <>
        <div className="bg-[#2a2b2b] rounded-4xl p-4 shadow-lg">
          <h2 className="text-base font-semibold text-[#d2e4e2] mb-4 text-center">
            Styl kalendarza
          </h2>
          <div className="flex flex-col gap-2">
            {styles.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStyle(key)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm transition-colors
                  ${
                    style === key
                      ? "bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f] font-semibold"
                      : "text-[#d2e4e2] hover:bg-[#374b4b] hover:text-white"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <BottomImageSection
          style={style}
          selectedCalendar={selectedCalendar}
          setSelectedCalendar={setSelectedCalendar}
        />
      </>
    )}

    {openSection === "months" && (
  <div className="lg:col-span-3 space-y-2 max-h-[66vh] overflow-y-auto rounded-xl p-2 custom-scroll">
    {months.map((month, index) => (
      <MonthEditor
        key={month}
        month={month}
        index={index}
        isImageMode={isImageMode[index]}
        fontSettings={fontSettings}
        monthTexts={monthTexts[index]}
        handleMonthTextChange={handleMonthTextChange}
        monthImages={monthImages[index]}
        imageScales={imageScales[index]}
        fontFamilies={fontFamilies}
        fontWeights={fontWeights}
        setIsImageMode={setIsImageMode}
        setImageScales={setImageScales}
        setMonthImages={setMonthImages}
        setFontSettings={setFontSettings}
      />
    ))}
  </div>
)}


    {openSection === "zapisz" && (
      <div className="bg-[#2a2b2b] rounded-3xl p-5 shadow-lg mt-4">
        <label className="block text-sm font-medium text-[#d2e4e2] mb-2">
          Wpisz nazwę kalendarza
        </label>

        <input
          type="text"
          value={calendarName}
          onChange={(e) => setCalendarName(e.target.value)}
          placeholder="np. Kalendarz firmowy 2025"
          className="w-full h-12 rounded-lg px-3 text-sm bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b] hover:border-[#6d8f91] focus:border-[#6d8f91] focus:outline-none transition-colors"
        />

        <button
          onClick={handleSaveCalendar}
          disabled={!calendarName.trim()}
          className={`mt-4 w-full px-6 py-2 rounded-lg text-sm font-semibold shadow transition-all duration-200
            ${
              calendarName.trim()
                ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                : "bg-[#3b3c3c] text-[#8a8a8a] cursor-not-allowed"
            }`}
        >
          Zapisz kalendarz
        </button>
      </div>
    )}
  </div>
</div>

  );
};

export default EditRightPanel;
