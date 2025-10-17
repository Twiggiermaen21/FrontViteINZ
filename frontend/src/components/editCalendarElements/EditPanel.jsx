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
  selectedCalendar,
  setYearActive,
  yearActive,
  setSelectedCalendar,
  yearPosition,
  setYearPosition,
  dragging,
  setDragging,
}) => {
  console.log(selectedCalendar);

  const [style, setStyle] = useState(null);
  const styles = [
    { key: "style1", label: "Grafika + kolor" },
    { key: "style2", label: "Rozciągnięty gradient" },
    { key: "style3", label: "Grafika na całym tle" },
  ];
  const handleMonthTextChange = (index, value) => {
    const newTexts = [...monthTexts];
    newTexts[index] = value;
    setMonthTexts(newTexts);
  };
  const [openSection, setOpenSection] = useState("topImage");
  const [images, setImages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedImageUrl, setSelectedImageUrl] = useState(
    selectedCalendar?.top_image_url || null
  );
  const scrollRef = useRef(null);

  const months = ["Grudzień", "Styczeń", "Luty"];
  const [monthImages, setMonthImages] = useState(() => months.map(() => ""));
  const [isImageMode, setIsImageMode] = useState(() => months.map(() => false));
  const [imageScales, setImageScales] = useState(() => months.map(() => 1));
  const [monthTexts, setMonthTexts] = useState(["", "", ""]);

  const [yearText, setYearText] = useState("2026");
  const [yearColor, setYearColor] = useState("#ffffff");
  const [yearFontSize, setYearFontSize] = useState(32);

  const [fontSettings, setFontSettings] = useState(
    months.map(() => ({
      fontFamily: "Arial",
      fontWeight: "400",
      fontColor: "#333333",
    }))
  );
 const [yearFontWeight, setYearFontWeight] = useState("bold");
  const [yearFontFamily, setYearFontFamily] = useState("Arial");

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
  // 🔹 Synchronizacja year z selectedCalendar
  useEffect(() => {
    if (!selectedCalendar || !yearActive) return;
    if (
      (yearText ||
        yearColor ||
        yearFontFamily ||
        yearFontWeight ||
        yearFontSize) !== null
    )
      return;

  


    const yd = selectedCalendar.year_data || {};
    const needUpdate =
      yd.text !== yearText ||
      yd.color !== yearColor ||
      yd.font !== yearFontFamily ||
      yd.weight !== yearFontWeight ||
      Number(yd.size) !== yearFontSize ||
      Number(yd.positionX) !== yearPosition.x ||
      Number(yd.positionY) !== yearPosition.y;

    if (!needUpdate) return;

    setSelectedCalendar((prev) => {
      if (!prev) return prev; // bezpieczeństwo
      return {
        ...prev,
        year_data: {
          ...prev.year_data,
          text: yearText,
          color: yearColor,
          font: yearFontFamily,
          weight: yearFontWeight,
          size: yearFontSize,
          positionX: yearPosition.x,
          positionY: yearPosition.y,
        },
      };
    });
  }, [
    yearText,
    yearColor,
    yearFontSize,
    yearFontFamily,
    yearFontWeight,
    yearPosition.x,
    yearPosition.y,
    yearActive,
    selectedCalendar?.id, // ✅ tylko id, nie cały obiekt
  ]);

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

  useEffect(() => {
    if (!selectedCalendar || initialYearLoaded.current) return;

    if (selectedCalendar.year_data) {
      const yd = selectedCalendar.year_data;
    
      setYearText(yd.text || "2026");
      setYearColor(yd.color || "#ffffff");
      setYearFontSize(Number(yd.size)|| 32);
      setYearFontWeight(yd.weight);
      setYearFontFamily(yd.font);
      setYearPosition({
        coords: {
          x: Number(yd.positionX) || 50,
          y: Number(yd.positionY) || 20,
        },
      });
    }

    // ustawienia pól
    setFontSettings(
      [
        selectedCalendar.field1,
        selectedCalendar.field2,
        selectedCalendar.field3,
      ].map((field) => ({
        fontFamily: field?.font || "Arial",
        fontWeight: field?.weight || "400",
        fontColor: field?.color || "#333333",
      }))
    );

    initialYearLoaded.current = true; // ✅ tylko raz
  }, [selectedCalendar]);

  const toggleSection = (name) => {
    setOpenSection((prev) => (prev === name ? null : name));
  };

  const handleImageSelect = (url) => {
    setSelectedImageUrl(url);
    setSelectedCalendar((prev) => ({
      ...prev,
      top_image_url: url,
    }));
  };

  return (
    <div className="flex-1 bg-[#1f2020] rounded-2xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-4">
        Ustawienia kalendarza
      </h2>

      <div className="space-y-4">
        <TopImageSection
          openSection={openSection}
          toggleSection={toggleSection}
          images={images}
          selectedImageUrl={selectedImageUrl}
          setSelectedCalendar={setSelectedCalendar}
          selectedCalendar={selectedCalendar}
          setSelectedImageUrl={setSelectedImageUrl}
          handleImageSelect={handleImageSelect}
          loading={loading}
          hasMore={hasMore}
          scrollRef={scrollRef}
        />
        <div>
          <div
            className={`p-3 rounded-lg cursor-pointer flex justify-between items-center transition ${
              openSection === "yearText"
                ? "bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f] font-semibold"
                : "bg-[#2a2b2b] text-gray-300 hover:bg-[#343636]"
            }`}
            onClick={() => toggleSection("yearText")}
          >
            <span>🖼️ Text Górny</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-5 h-5 transition-transform duration-300 ${
                openSection === "yearText" ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 9l6 6 6-6"
              />
            </svg>
          </div>
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
        </div>
        <div>
          <div
            className={`p-3 rounded-lg cursor-pointer flex justify-between items-center transition ${
              openSection === "bottom"
                ? "bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f] font-semibold"
                : "bg-[#2a2b2b] text-gray-300 hover:bg-[#343636]"
            }`}
            onClick={() => toggleSection("bottom")}
          >
            <span>🖼️ Text Doł</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-5 h-5 transition-transform duration-300 ${
                openSection === "bottom" ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 9l6 6 6-6"
              />
            </svg>
          </div>

          {openSection === "bottom" && (
            <>
              <div className="bg-[#2a2b2b] rounded-4xl p-4 shadow-lg mt-4">
                <h2 className="text-base font-semibold text-[#d2e4e2] mb-4">
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
        </div>

        <div>
          <div
            className={`p-3 rounded-lg cursor-pointer flex justify-between items-center transition ${
              openSection === "months"
                ? "bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f] font-semibold"
                : "bg-[#2a2b2b] text-gray-300 hover:bg-[#343636]"
            }`}
            onClick={() => toggleSection("months")}
          >
            <span>🖼️ edytor sekcji miesiecy</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-5 h-5 transition-transform duration-300 ${
                openSection === "months" ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 9l6 6 6-6"
              />
            </svg>
          </div>
          {openSection === "months" && (
            <div className="lg:col-span-3 space-y-2 ">
              {months.map((month, index) => (
                <MonthEditor
                  key={month}
                  month={month}
                  index={index}
                  isImageMode={isImageMode[index]}
                  // toggleImageMode={toggleImageMode}
                  fontSettings={fontSettings}
                  // handleFontSettingChange={handleFontSettingChange}
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
                  setMonthTexts={setMonthTexts}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditRightPanel;
