// przełączanie trybu obrazka
export const toggleImageMode = (index, setIsImageMode) => {
  setIsImageMode((prev) => {
    const newMode = [...prev];
    newMode[index] = !newMode[index];
    return newMode;
  });
};

// zmiana obrazka
export const handleImageChange = (index, e, setMonthImages, setImageScales) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];

    setMonthImages((prev) => {
      const newImgs = [...prev];
      newImgs[index] = file;
      return newImgs;
    });

    setImageScales((prev) => {
      const newScales = [...prev];
      newScales[index] = 1;
      return newScales;
    });
  }
};

// zmiana skali obrazka
export const handleImageScaleChange = (index, value, setImageScales) => {
  setImageScales((prev) => {
    const newScales = [...prev];
    newScales[index] = parseFloat(value);
    return newScales;
  });
};

// zmiana tekstu miesiąca
// export const handleMonthTextChange = (index, value, monthTexts, setMonthTexts) => {
//   const newTexts = [...monthTexts];
//   newTexts[index] = value;
//   setMonthTexts(newTexts);
// };

// zmiana ustawień czcionki
// export const handleFontSettingChange = (index, field, value, fontSettings, setFontSettings) => {
//   const updated = [...fontSettings];
//   updated[index] = { ...updated[index], [field]: value };
//   setFontSettings(updated);
// };

// działa na POJEDYNCZYM obiekcie, nie na tablicy
export const handleFontSettingChange = (index, field, value, fontSettings, setFontSettings) => {
  const updated = [...fontSettings];
  updated[index] = { ...updated[index], [field]: value };
  setFontSettings(updated);
};
