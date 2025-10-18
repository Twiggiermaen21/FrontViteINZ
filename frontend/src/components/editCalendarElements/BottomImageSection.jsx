// BottomImageSection.jsx
import React, { use, useEffect, useRef, useState } from "react";
import ImgColor from "../calendarEditorElements/imgAndColor";
import GradientSettings from "../calendarEditorElements/imgAndFade";
import BackgroundImg from "../calendarEditorElements/imgAndImg";
import axios from "axios";
import { ACCESS_TOKEN } from "../../constants";

const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

const BottomImageSection = ({
  style,
  selectedCalendar,
  setSelectedCalendar,
}) => {
  const [bgColor, setBgColor] = useState("#ffffff");
  const [imagesBackground, setImagesBackground] = useState([]);
  const [gradientVariant, setGradientVariant] = useState("diagonal");
  const [gradientEndColor, setGradientEndColor] = useState("#ffffff");
  const [gradientStrength, setGradientStrength] = useState("medium");
  const [gradientTheme, setGradientTheme] = useState("classic");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [pageBackground, setPageBackground] = useState(1);

  const [hasMoreBackground, setHasMoreBackground] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchImagesBackground = async () => {
    if (!hasMoreBackground || loading) return;

    setLoading(true);
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const res = await axios.get(`${apiUrl}/generate/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: pageBackground, page_size: 12 }, // backend musi obsługiwać paginację
      });

      setImagesBackground((prev) => [...prev, ...res.data.results]);
      setHasMoreBackground(!!res.data.next);
      setPageBackground((prev) => prev + 1);
    } catch (err) {
      console.error("Błąd podczas pobierania obrazów:", err);
      if (err.response?.status === 401) {
        setTimeout(() => {
          window.location.reload();
        }, 500); // odświeży po 0.5 sekundy
      }
    } finally {
      setLoading(false);
    }
  };

  const [image, setImage] = useState(null);
  const fetchedOnce = useRef(false);

  useEffect(() => {
    if (style === "style3" && !fetchedOnce.current) {
      fetchImagesBackground();
      fetchedOnce.current = true;
    } else {
      setImage({ url: selectedCalendar.top_image_url });
    }
  }, [style]);

  useEffect(() => {
    if (!selectedCalendar || style === null) return;

    let newBottom = { ...selectedCalendar.bottom };

    // ustawiamy content_type_id jeśli style3
    if (style === "style1") {
      newBottom.content_type_id = 26;
    }
    if (style === "style2") {
      newBottom.content_type_id = 27;
    }
    if (style === "style3") {
      newBottom.content_type_id = 28;
    }

    // aktualizujemy tylko odpowiednie pola dla danego stylu
    if (style === "style1") {
      newBottom.color = bgColor;
    } else if (style === "style2") {
      newBottom.end_color = gradientEndColor;
      newBottom.start_color = bgColor;
      newBottom.direction = gradientVariant;
      newBottom.strength = gradientStrength;
      newBottom.theme = gradientTheme;
    } else if (style === "style3") {
      newBottom.url = backgroundImage;
    }

    setSelectedCalendar((prev) => ({
      ...prev,
      bottom: newBottom,
    }));
  }, [
    style,
    bgColor,
    gradientEndColor,
    gradientVariant,
    gradientStrength,
    gradientTheme,
    backgroundImage,
  ]);

  return (
    <div className="lg:col-span-3 space-y-2 ">
      {style === "style1" && (
        <ImgColor
          bgColor={bgColor}
          setBgColor={setBgColor}
          image={image}
          setGradientEndColor={setGradientEndColor}
        />
      )}
      {/* Opcje dla gradientu */}
      {style === "style2" && (
        <GradientSettings
          image={image}
          bgColor={bgColor}
          setBgColor={setBgColor}
          gradientEndColor={gradientEndColor}
          setGradientEndColor={setGradientEndColor}
          gradientVariant={gradientVariant}
          setGradientVariant={setGradientVariant}
          gradientTheme={gradientTheme}
          setGradientTheme={setGradientTheme}
          gradientStrength={gradientStrength}
          setGradientStrength={setGradientStrength}
        />
      )}

      {/* Opcje dla stylu 3: tylko grafika */}
      {style === "style3" && (
        <BackgroundImg
          images={imagesBackground}
          fetchImages={fetchImagesBackground}
          backgroundImage={backgroundImage}
          setBackgroundImage={setBackgroundImage}
          hasMore={hasMoreBackground}
          loading={loading}
        />
      )}
    </div>
  );
};

export default BottomImageSection;
