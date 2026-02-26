export function getPaddingTopFromText(value) {
  const length = value.length;

  if (length <= 20) {
    return "10px";
  } else if (length >= 21 && length <= 29) {
  
    const padding = 30 - length; 
    return `${padding}px`;
  } else {
    return "4px";
  }
}
