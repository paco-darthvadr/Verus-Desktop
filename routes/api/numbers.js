const scientificToDecimal = function(number) {
  let numberHasSign = number.startsWith("-") || number.startsWith("+");
  let sign = numberHasSign ? number[0] : "";
  number = numberHasSign ? number.replace(sign, "") : number;


  if (/\d+\.?\d*e[\+\-]*\d+/i.test(number)) {
    let zero = '0';
    let parts = String(number).toLowerCase().split('e'); 
    let e = parts.pop();
    let l = Math.abs(e);
    let sign = e / l;
    let coeff_array = parts[0].split('.');

    if (sign === -1) {
      coeff_array[0] = Math.abs(coeff_array[0]);
      number = zero + '.' + new Array(l).join(zero) + coeff_array.join('');
    } else {
      let dec = coeff_array[1];
      if (dec) l = l - dec.length;
      number = coeff_array.join('') + new Array(l + 1).join(zero);
    }
  }

  return `${sign}${number}`;
};

module.exports = {
  scientificToDecimal
}