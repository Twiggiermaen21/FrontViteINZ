import React, { Fragment, use, useEffect, useRef, useState } from "react";
import { useCalendars } from "../utils/useCalendars";
import { getBottomSectionBackground } from "../utils/getBottomSectionBackground";
import EditRightPanel from "../components/editCalendarElements/EditPanel";
import { getYearPositionStyles } from "../utils/getYearPositionStyles";
import LimitedTextarea from "../components/calendarEditorElements/contentEdittableText";
import ImageEditor from "../components/calendarEditorElements/ImageEditor";
import { fontFamilies, fontWeights } from "../constants";
import {
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
} from "../utils/dragUtils";

const EditCalendar = () => {
  const { calendars, loading, scrollRef } = useCalendars();
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [yearPosition, setYearPosition] = useState({
    coords: { x: 50, y: 20 },
  });
  const [yearText, setYearText] = useState("2026");
  const [yearColor, setYearColor] = useState("#ffffff");
  const [yearFontSize, setYearFontSize] = useState(32);

  const [yearFontWeight, setYearFontWeight] = useState("bold");
  const [yearFontFamily, setYearFontFamily] = useState("Arial");
  const [updateYear,setUpdateYear] = useState(false);


  const [isCustom, setIsCustom] = useState(false);
  const [yearActive, setYearActive] = useState(false);

  const months = ["Grudzień", "Styczeń", "Luty"];
  const dragStartPos = useRef({ mouseX: 0, mouseY: 0, elemX: 0, elemY: 0 });
  const spanRef = useRef(null);
  const [xLimits, setXLimits] = useState({ min: 50, max: 325 });
  const [yLimits, setYLimits] = useState({ min: 20, max: 235 });
  const [dragging, setDragging] = useState(false);

  const [monthTexts, setMonthTexts] = useState(["", "", ""]);
  const [monthImages, setMonthImages] = useState(() => months.map(() => ""));
  const [isImageMode, setIsImageMode] = useState(() => months.map(() => false));
  const [imageScales, setImageScales] = useState(() => months.map(() => 1));
  const [positions, setPositions] = useState(() =>
    months.map(() => ({ x: 0, y: 0 }))
  );
  const [fontSettings, setFontSettings] = useState(
    months.map(() => ({
      fontFamily: "Arial",
      fontWeight: "400",
      fontColor: "#333333",
    }))
  );
  const handleMonthTextChange = (index, value) => {
    setMonthTexts((prev) => prev.map((txt, i) => (i === index ? value : txt)));
  };
  useEffect(() => {
    const onMove = (e) =>
      handleMouseMove(e, {
        dragging,
        dragStartPos,
        xLimits,
        yLimits,
        setYearPosition,
      });

    const onUp = () => handleMouseUp(setDragging);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, xLimits, yLimits]);

  useEffect(() => {
    if (!selectedCalendar) return;

    // aktualizujemy isImageMode
    if (selectedCalendar.images_for_fields) {
      updateImageModes(selectedCalendar.images_for_fields);
    }
  updateYearData();
    // aktualizujemy monthTexts tylko jeśli istnieją pola tekstowe

    updateMonthTextsFromFields(selectedCalendar);
  }, [selectedCalendar?.id]);

  // useEffect(() => {
  //   if (!selectedCalendar) return;

  //   updateYearData();

   


  // },[selectedCalendar]);



  
  const updateImageModes = (fields) => {
    const newModes = [false, false, false];

    const newImages = ["", "", ""];
    fields.forEach((field) => {
      if (field.field_number >= 1 && field.field_number <= 3) {
        newModes[field.field_number - 1] = true;
        newImages[field.field_number - 1] = field.url;
      }
    });
    setIsImageMode(newModes);

    setMonthImages(newImages);
  };
  const updateMonthTextsFromFields = (calendar) => {
    if (!calendar) return;

    const newTexts = [
      calendar.field1?.text || "", // jeśli field1 istnieje, weź text, inaczej ""
      calendar.field2?.text || "",
      calendar.field3?.text || "",
    ];

    setMonthTexts(newTexts);
  };

  const [pom,setPom]= useState(null);


  const updateYearData = () => {
    setYearPosition(({
    coords: {  x: selectedCalendar.year_data?.positionX,
      y: selectedCalendar.year_data?.positionY, },
  }));
    setYearText(selectedCalendar.year_data?.text);
    setYearColor(selectedCalendar.year_data?.color);
    setYearFontSize(selectedCalendar.year_data
?.size);
    
    setYearFontWeight(selectedCalendar.year_data?.weight);
    setYearFontFamily(selectedCalendar.year_data?.font);

  };
  
 


useEffect(()=>{
if(pom!==null){
 setSelectedCalendar((prev) => ({
    ...prev,
   year_data:pom
  })); 

 
}

 

 
},[pom])



  return (
    <div className="flex gap-6 w-full max-w-[1812px] mx-auto mt-4 ">
      {/* 🩶 Lewa kolumna z przewijaną listą */}
      <div className="w-[26%] max-h-[88vh] bg-[#2a2b2b] rounded-4xl p-4 shadow-lg mt-4 border-r border-gray-700  flex flex-col">
      <h2 className="text-xl font-bold text-white mb-4 text-center">Wybierz kalendarz</h2>

        {/* 🔹 Scroll tylko na liście kalendarzy */}
        <div
          className="overflow-y-auto custom-scroll max-h-[89vh] pr-2"
          ref={scrollRef}
        >
          {loading && calendars.length === 0 ? (
            <p className="text-gray-400">Ładowanie...</p>
          ) : calendars.length === 0 ? (
            <p className="text-gray-400">Brak dostępnych kalendarzy.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {calendars.map((calendar) => {
                const isActive = selectedCalendar?.id === calendar.id;

                return (
                  <li
                    key={calendar.id}
                    className={`p-3 rounded-lg bg-[#2f3131] hover:bg-[#3a3d3d] text-gray-200 cursor-pointer transition" 
        ${
          isActive
            ? "bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f] font-semibold"
            : "text-[#d2e4e2] hover:bg-[#374b4b] hover:text-white"
        }`}
                    onClick={() => {
                      setSelectedCalendar(calendar);
                      setYearActive(!!calendar.year_data);
                    }}
                  >
                    <h1 className="text-lg">{calendar.name}</h1>
                  </li>
                );
              })}
            </ul>
          )}

          {loading && calendars.length > 0 && (
            <p className="text-gray-500 text-sm mt-3 text-center">
              Ładowanie kolejnych...
            </p>
          )}
        </div>
      </div>

      {/* 🩵 Prawa kolumna — bez scrolla */}
      <div className="flex-1 bg-[#2a2b2b] max-h-[88vh] rounded-4xl mt-4 p-4 flex flex-col">
        {!selectedCalendar ? (
          <p className="text-gray-400 text-lg">
            Wybierz kalendarz z listy po lewej, aby rozpocząć edycję.
          </p>
        ) : (
          <>
            {/* 🔹 Nagłówek edycji */}
            <h2 className="text-xl font-bold text-white mb-4 text-center">
        Ustawienia kalendarza
      </h2>

            {/* 🔹 Główna sekcja: podgląd po lewej, pola edycji po prawej */}
            <div className="flex gap-8 items-start">
              {/* 🖼️ Podgląd kalendarza (po lewej) */}
              <div className="max-w-[272px] bg-white border rounded-lg shadow overflow-hidden">
                <div className="relative h-[152px] bg-gray-200 flex items-center justify-center">
                  {selectedCalendar.top_image_url ? (
                    <div className="relative w-full h-full">
                      <img
                        src={selectedCalendar.top_image_url}
                        alt="Nagłówek"
                        className="w-full h-full object-cover"
                      />

                      {selectedCalendar.year_data && yearActive && (
                        <span
                          ref={spanRef}
                          onMouseDown={(e) =>
                            handleMouseDown(e, {
                              yearPosition,
                              setYearPosition,
                              spanRef,
                              xLimits,
                              yLimits,
                              setDragging,
                              dragStartPos,
                            })
                          }
                          style={{
                            position: "absolute",
                            zIndex: 20,
                            color: selectedCalendar.year_data.color,
                            fontSize: `${selectedCalendar.year_data.size}px`,
                            fontWeight: selectedCalendar.year_data.weight,
                            fontFamily: selectedCalendar.year_data.font,
                            cursor: "move",
                            userSelect: "none",
                            whiteSpace: "nowrap",
                            pointerEvents: "auto",
                            ...getYearPositionStyles(yearPosition),
                          }}
                        >
                          {selectedCalendar.year_data.text}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500">Brak grafiki nagłówka</span>
                  )}
                </div>

                <div
                  className="h-[644px] px-3 py-4 flex flex-col items-center text-center"
                  style={getBottomSectionBackground({
                    style:
                      selectedCalendar.bottom?.content_type_id === 26
                        ? "style1"
                        : selectedCalendar.bottom?.content_type_id === 27
                        ? "style2"
                        : selectedCalendar.bottom?.content_type_id === 28
                        ? "style3"
                        : null,
                    bgColor:
                      selectedCalendar.bottom?.color ??
                      selectedCalendar.bottom?.start_color,
                    gradientEndColor: selectedCalendar.bottom?.end_color,
                    gradientTheme: selectedCalendar.bottom?.theme,
                    gradientStrength: selectedCalendar.bottom?.strength,
                    gradientVariant: selectedCalendar.bottom?.direction,
                    backgroundImage: selectedCalendar.bottom?.url,
                  })}
                >
                  {months.map((month, index) => (
                    <Fragment key={month}>
                      <div className="w-full border rounded bg-white shadow p-2 flex flex-col items-center">
                        <h3 className="text-xl font-bold text-blue-700 uppercase tracking-wide mb-1">
                          {month}
                        </h3>
                        <div className="w-full h-[60px] text-sm text-gray-600 flex items-center justify-center">
                          [Siatka dni dla {month}]
                        </div>
                      </div>
                      {isImageMode[index] ? (
                        <ImageEditor
                          imageSrc={monthImages[index]}
                          setImageSrc={(newValue) =>
                            setMonthImages((prev) =>
                              prev.map((img, i) =>
                                i === index ? newValue : img
                              )
                            )
                          }
                          imageScale={imageScales[index]}
                          setImageScale={(newValue) =>
                            setImageScales((prev) =>
                              prev.map((s, i) => (i === index ? newValue : s))
                            )
                          }
                          position={positions[index]}
                          setPosition={(newValue) =>
                            setPositions((prev) =>
                              prev.map((p, i) => (i === index ? newValue : p))
                            )
                          }
                        />
                      ) : (
                        <LimitedTextarea
                          value={monthTexts[index]}
                          index={index}
                          onChange={handleMonthTextChange}
                          placeholder="Wpisz tekst pod miesiącem..."
                          fontFamily={fontSettings[index].fontFamily}
                          fontWeight={fontSettings[index].fontWeight}
                          fontColor={fontSettings[index].fontColor}
                          maxChars={1000}
                        />
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>

              {/* ⚙️ Panel edycji (po prawej) */}
              <EditRightPanel
                setPom={setPom}
                selectedCalendar={selectedCalendar}
                setYearActive={setYearActive}
                yearActive={yearActive}
                setSelectedCalendar={setSelectedCalendar}
                yearPosition={yearPosition}
                setYearPosition={setYearPosition}
                dragging={dragging}
                setDragging={setDragging}
                isImageMode={isImageMode}
                setIsImageMode={setIsImageMode}
                imageScales={imageScales}
                setImageScales={setImageScales}
                monthTexts={monthTexts}
                setMonthTexts={setMonthTexts}
                monthImages={monthImages}
                setMonthImages={setMonthImages}
                fontSettings={fontSettings}
                setFontSettings={setFontSettings}
                yearText={yearText}
                setYearText={setYearText}
                yearColor={yearColor}
                setYearColor={setYearColor}
                yearFontSize={yearFontSize}
                setYearFontSize={setYearFontSize}
                yearFontWeight={yearFontWeight}
                setYearFontWeight={setYearFontWeight}
                yearFontFamily={yearFontFamily}
                setYearFontFamily={setYearFontFamily}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditCalendar;
