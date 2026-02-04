import React from "react";
import { getBottomSectionBackground } from "../../utils/getBottomSectionBackground";
import { getPaddingTopFromText } from "../../utils/textPadding";
import { MONTHS } from "../../constants";

// Stałe wymiary dla łatwiejszego zarządzania (zgodne z Twoim edytorem)
const DIMENSIONS = {
  WIDTH: 3661,
  HEADER_HEIGHT: 2480,
  BOTTOM_HEIGHT: 7087, // Reszta wysokości
  MONTH_BOX_HEIGHT: 1594,
  MONTH_BOX_WIDTH: 3425,
  AD_STRIP_HEIGHT: 768,
  SCALE_FACTOR: 12.5, // Mnożnik dla paddingów itp.
};

const CalendarPreview = ({ calendar }) => {
  if (!calendar) return null;

  return (
    // 1. KONTENER SKALUJĄCY (Zoom 0.08)
    <div className="mx-auto rounded shadow-lg overflow-hidden bg-white origin-top" style={{ zoom: 0.08 }}>
      
      {/* 2. GŁÓWNY KONTENER (Pełna rozdzielczość 3661px) */}
      <div style={{ width: `${DIMENSIONS.WIDTH}px` }}>
        
        {/* --- HEADER SECTION --- */}
        <div 
          className="relative bg-gray-200 flex items-center justify-center overflow-hidden"
          style={{ height: `${DIMENSIONS.HEADER_HEIGHT}px` }}
        >
          {calendar.top_image ? (
            <img
              src={calendar.top_image_url}
              alt="Nagłówek"
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <span className="text-gray-500" style={{ fontSize: "100px" }}>Brak grafiki nagłówka</span>
          )}

          {calendar.year_data && (
            <span
              style={{
                position: "absolute",
                color: calendar.year_data.color,
                // Zakładamy, że w bazie dane są już zapisane w dużej skali (np. 400px), więc nie mnożymy
                fontSize: `${calendar.year_data.size}px`, 
                fontWeight: calendar.year_data.weight,
                fontFamily: calendar.year_data.font,
                // Bezpośrednie koordynaty z bazy (duża rozdzielczość)
                left: `${calendar.year_data.positionX}px`,
                top: `${calendar.year_data.positionY}px`,
                lineHeight: 1,
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
            >
              {calendar.year_data.text}
            </span>
          )}
        </div>

        {/* --- BOTTOM SECTION --- */}
        <div
          className="flex flex-col items-center overflow-hidden"
          style={{
            height: `${DIMENSIONS.BOTTOM_HEIGHT}px`,
            ...getBottomSectionBackground({
              style:
                calendar.bottom?.content_type_id === 26
                  ? "style1"
                  : calendar.bottom?.content_type_id === 27
                  ? "style2"
                  : calendar.bottom?.content_type_id === 28
                  ? "style3"
                  : null,
              bgColor: calendar.bottom?.color ?? calendar.bottom?.start_color,
              gradientEndColor: calendar.bottom?.end_color,
              gradientTheme: calendar.bottom?.theme,
              gradientVariant: calendar.bottom?.direction,
              backgroundImage: calendar.bottom?.url,
            }),
          }}
        >
          {[calendar.field1, calendar.field2, calendar.field3].map(
            (field, index) => (
              <React.Fragment key={`group-${calendar.id}-${index}`}>
                
                {/* Box miesiąca */}
                <div
                  className="bg-white shadow-sm flex flex-col items-center border-gray-200"
                  style={{
                    height: `${DIMENSIONS.MONTH_BOX_HEIGHT}px`,
                    width: `${DIMENSIONS.MONTH_BOX_WIDTH}px`,
                    marginTop: "25px",      // Symetryczne odstępy
                    marginBottom: "25px",   // Symetryczne odstępy
                    borderWidth: "5px",     // Grubsza ramka
                  }}
                >
                  <h3 
                    className="font-bold text-blue-700 uppercase tracking-wide"
                    style={{ fontSize: "150px", marginTop: "40px", marginBottom: "10px" }}
                  >
                    {MONTHS[index]}
                  </h3>
                  <div 
                    className="w-full text-gray-400 flex items-center justify-center"
                    style={{ fontSize: "100px", flexGrow: 1 }}
                  >
                    [Siatka dni dla {MONTHS[index]}]
                  </div>
                </div>

                {/* Box reklamowy (Dynamiczne pole) */}
                <div
                  className="w-full flex items-center justify-center px-28 overflow-hidden"
                  style={{ height: `${DIMENSIONS.AD_STRIP_HEIGHT}px` }}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <CalendarFieldContent
                      calendar={calendar}
                      index={index}
                    />
                  </div>
                </div>
              </React.Fragment>
            )
          )}
        </div>
      </div>
    </div>
  );
};

// --- Sub-komponent do renderowania zawartości pola ---
const CalendarFieldContent = ({ calendar, index }) => {
  const fieldData = calendar[`field${index + 1}`];

  if (!fieldData) return null;

  const isTextField = fieldData.text !== undefined;
  const isImageField = fieldData.path !== undefined;

  if (isTextField) {
    // Obliczamy padding i skalujemy go
    const basePadding = getPaddingTopFromText(fieldData.text);
    const scaledPadding = basePadding * DIMENSIONS.SCALE_FACTOR;

    return (
      <textarea
        className="w-full h-full resize-none text-center bg-transparent overflow-hidden border-none focus:outline-none"
        rows={2}
        readOnly
        defaultValue={fieldData.text}
        style={{
          // fieldData.size powinno być już duże (np. 200), jeśli pochodzi z nowego edytora
          fontSize: `${fieldData.size}px`, 
          fontFamily: fieldData.font,
          fontWeight: fieldData.weight,
          color: fieldData.color,
          // lineHeight: "1.2",
          padding: 0,
          paddingTop: `${scaledPadding}px`, // Zastosowanie przeskalowanego paddingu
          display: "block",
        }}
      />
    );
  }

  if (isImageField) {
    return calendar.images_for_fields
      ?.filter((img) => img.field_number === index + 1)
      .map((img) => (
        <div
          key={`img-${calendar.id}-${index}-${img.id}`}
          className="mx-auto w-full overflow-hidden relative"
          style={{ height: "100%" }} // Wypełnia kontener 768px
        >
          <img
            src={img.url}
            alt="Field content"
            style={{
              position: "absolute",
              // Pozycje z bazy powinny być już w dużej skali
              left: `${Number(fieldData.positionX || 0)}px`,
              top: `${Number(fieldData.positionY || 0)}px`,
              // Obrazek skalujemy transformacją
              transform: `scale(${Number(fieldData.size || 1)})`, // Tutaj size to mnożnik skali (np. 1.5)
              transformOrigin: "top left",
              maxWidth: "none",
            }}
          />
        </div>
      ));
  }

  return null;
};

export default CalendarPreview;