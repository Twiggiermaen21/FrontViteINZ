export const getBottomSectionBackground = ({
  style,
  bgColor,
  gradientEndColor,
  gradientTheme,
  
  gradientVariant,
  backgroundImage,
}) => {
  if (style === "style1") {
    return { background: bgColor };
  }

  if (style === "style2") {
    if (gradientTheme !== "classic") {
      const themes = {
        aurora: {
          background: `radial-gradient(circle at 30% 30%, ${bgColor}, ${gradientEndColor}, ${bgColor})`,
          color: "white",
        },
        liquid: {
          background: `linear-gradient(135deg, ${bgColor} 0%, ${gradientEndColor} 100%)`,
          color: "white",
        },
        mesh: {
          background: `linear-gradient(120deg, ${bgColor} 0%, ${gradientEndColor} 100%)`,
          color: "white",
        },
        waves: {
          background: `repeating-linear-gradient(135deg, ${bgColor}, ${gradientEndColor} 20%, ${bgColor} 40%)`,
          color: "white",
        },
      };

      return themes[gradientTheme] || { background: bgColor };
    }

    const blendMap = { soft: "66", medium: "99", hard: "cc" };
    
    const blendedEnd = gradientEndColor;

    let gradientStyle;
    switch (gradientVariant) {
      case "vertical":
        gradientStyle = `linear-gradient(to bottom, ${bgColor}, ${blendedEnd})`;
        break;
      case "horizontal":
        gradientStyle = `linear-gradient(to right, ${bgColor}, ${blendedEnd})`;
        break;
      case "radial":
        gradientStyle = `radial-gradient(circle, ${bgColor}, ${blendedEnd})`;
        break;
      case "diagonal":
      default:
        gradientStyle = `linear-gradient(to bottom right, ${bgColor}, ${blendedEnd})`;
        break;
    }

    return { background: gradientStyle };
  }

  if (style === "style3" && backgroundImage) {
    const imageUrl =
      typeof backgroundImage === "string" ? backgroundImage : backgroundImage.url;

    return {
      background: `url(${imageUrl}) center/cover no-repeat`,
      color: "white",
    };
  }

  return { background: "#ffffff" };
};
