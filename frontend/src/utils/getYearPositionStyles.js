export function getYearPositionStyles(position) {
    // console.log("Using custom coordinates for year position:", position.coords);



  if (position.coords) {
    return {
      left: position.coords.x,
      top: position.coords.y,
      transform: "translate(-50%, -50%)",
    };
  }

  switch (position.preset) {
    case "top-left":
      return { top: "10px", left: "10px" };
    case "top-center":
      return { top: "10px", left: "50%", transform: "translateX(-50%)" };
    case "top-right":
      return { top: "10px", right: "10px" };
    case "center-left":
      return { top: "50%", left: "10px", transform: "translateY(-50%)" };
    case "center":
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    case "center-right":
      return { top: "50%", right: "10px", transform: "translateY(-50%)" };
    case "bottom-left":
      return { bottom: "10px", left: "10px" };
    case "bottom-center":
      return { bottom: "10px", left: "50%", transform: "translateX(-50%)" };
    case "bottom-right":
      return { bottom: "10px", right: "10px" };
    default:
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  }
}
