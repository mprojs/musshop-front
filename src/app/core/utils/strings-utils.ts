export const removeHTMLTags = text => {
  return text ? text.replace( /(<([^>]+)>)/ig, '') : text;
}

export const parsePrice = stringPrice => {
  let price = stringPrice.replace(/[$,]/g, '');
  price = +price;
  if (!isNaN(price)) {
    return price;
  } else {
    throw new Error('Cannot parse price from string: ' + stringPrice);
  }
}

export const toPrice = price => {
  return '$' + price.toFixed(2);
}
