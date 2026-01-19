import React from "react";
import { getYearPositionStyles } from "../../utils/getYearPositionStyles";
import { getBottomSectionBackground } from "../../utils/getBottomSectionBackground";
// Upewnij się, że masz tę funkcję zaimportowaną lub zdefiniowaną w utils
import { getPaddingTopFromText } from "../../utils/textPadding";
import { MONTHS } from "../../constants";


const CalendarPreview = ({ calendar }) => {
  if (!calendar) return null;

  return (
    <div className="w-[292px] mx-auto rounded shadow-lg overflow-hidden bg-white">
      {/*HEADER SECTION*/}
      <div className="relative h-[198px] w-full bg-gray-200 flex items-center justify-center">
        {calendar.top_image ? (
          <img
            src={calendar.top_image_url}
            alt="Nagłówek"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500">Brak grafiki nagłówka</span>
        )}

        {calendar.year_data && (
          <span
            style={{
              position: "absolute",
              color: calendar.year_data.color,
              fontSize: `${calendar.year_data.size}px`,
              fontWeight: calendar.year_data.weight,
              fontFamily: calendar.year_data.font,
              ...getYearPositionStyles({
                coords: {
                  x: calendar.year_data.positionX,
                  y: calendar.year_data.positionY,
                },
              }),
            }}
          >
            {calendar.year_data.text}
          </span>
        )}
      </div>

      {/*BOTTOM SECTION*/}
      <div
        className="h-[602px] flex flex-col items-center overflow-hidden"
        style={getBottomSectionBackground({
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
          gradientStrength: calendar.bottom?.strength,
          gradientVariant: calendar.bottom?.direction,
          backgroundImage: calendar.bottom?.url,
        })}
      >
        {[calendar.field1, calendar.field2, calendar.field3].map(
          (field, index) => (
            <React.Fragment key={`group-${calendar.id}-${index}`}>
              {/* Box miesiąca */}
              <div
                className="bg-white shadow-sm flex flex-col items-center border border-gray-200"
                style={{
                  height: "132px",
                  width: "273px",
                  marginTop: "4px",
                }}
              >
                <h3 className="text-[12px] font-bold text-blue-700 uppercase tracking-wide mb-1">
                  {MONTHS[index]}
                </h3>
                <div className="w-full text-[10px] text-gray-400 flex items-center justify-center ">
                  [Siatka dni dla {MONTHS[index]}]
                </div>
              </div>

              {/* Box reklamowy (Dynamiczne pole) */}
              <div
                className="w-full flex items-center justify-center px-2 overflow-hidden"
                style={{ height: "65px" }}
              >
                <div className="relative w-full my-2">
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
  );
};

// --- Sub-komponent do renderowania zawartości pola (Tekst lub Obrazek) ---
const CalendarFieldContent = ({ calendar, index }) => {
  // Pobieramy dynamicznie dane pola (field1, field2, field3)
  const fieldData = calendar[`field${index + 1}`];

  if (!fieldData) return null;

  const isTextField = fieldData.text !== undefined;
  const isImageField = fieldData.path !== undefined;

  if (isTextField) {
    return (
      <textarea
        className="w-full h-[60px] resize-none  text-center bg-transparent overflow-hidden"
        rows={2}
        readOnly
        defaultValue={fieldData.text}
        style={{
          fontSize: `${fieldData.size}px`,
          fontFamily: fieldData.font,
          fontWeight: fieldData.weight,
          color: fieldData.color,
          lineHeight: "1.2",
          padding: 0,
          paddingTop: getPaddingTopFromText(fieldData.text),
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
          className=" mx-auto w-full overflow-hidden relative"
          style={{ height: 60 }}
        >
          <img
            src={img.url}
            alt="Field content"
            style={{
              position: "absolute",
              left: `${Number(fieldData.positionX || 0)}px`,
              top: `${Number(fieldData.positionY || 0)}px`,
              height: "60px",
              // Uwaga: Tutaj używamy `size` jako skali, zgodnie z Twoim kodem.
              // Jeśli w bazie masz pole `scale`, zmień `fieldData.size` na `fieldData.scale`.
              transform: `scale(${Number(fieldData.size || 1)})`,
              transformOrigin: "top left",
            }}
          />
        </div>
      ));
  }

  return null;
};

export default CalendarPreview;