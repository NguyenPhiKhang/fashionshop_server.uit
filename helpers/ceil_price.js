exports.CeilPrice = (price, percent) =>{
    var pricePercent = price*(1 - percent*0.01);
    var finalPrice = Math.ceil(pricePercent/1000)*1000;
    return finalPrice;
}