export function getPaddingTopFromText(value) {
  const length = value.length;

  if (length <= 20) {
    return "10px";
  } else if (length >= 21 && length <= 29) {
    // Dla długości od 21 do 29 zmniejszamy padding od 9px do 1px (np.)
    // linearne zmniejszanie: padding = 30 - length
    const padding = 30 - length; 
    return `${padding}px`;
  } else {
    // powyżej 30 znaków padding 4px (mały)
    return "4px";
  }
}
