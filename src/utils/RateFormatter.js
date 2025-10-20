const RateFormatter = (value, decimal = 2) => {
  if (value === null || value === undefined) return '';
  
  const num = Number(value).toFixed(decimal);
  return num;
}

export default RateFormatter;