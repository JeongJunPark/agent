const NumberFormatter = (value) => {
  if (value === null || value === undefined) return '';

  let strValue = value.toString();

  return strValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default NumberFormatter;
