export const toggleImageMode = (index, setIsImageMode) => {
  setIsImageMode((prev) => {
    const newMode = [...prev];
    newMode[index] = !newMode[index];
    return newMode;
  });
};

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


export const handleImageScaleChange = (index, value, setImageScales) => {
  setImageScales((prev) => {
    const newScales = [...prev];
    newScales[index] = parseFloat(value);
    return newScales;
  });
};

export const handleFontSettingChange = (index, field, value, fontSettings, setFontSettings) => {
  const updated = [...fontSettings];
  updated[index] = { ...updated[index], [field]: value };
  setFontSettings(updated);
};
