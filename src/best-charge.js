
//fix bug cost 26 min, 22:52 -> 23:18

//22:38 -> 22:52 14min 
function bestCharge(selectedItems) {
  var itemIdAndNum = getObjectOfItemIdAndNum(selectedItems);
  var bestCharge = '============= 订餐明细 =============\n';
  var subTotal = 0;
  for(let itemId in itemIdAndNum){
    let item = getItemByItemId(itemId);
    let num = Number(itemIdAndNum[itemId]);
    bestCharge+=`${item.name} x ${num} = ${item.price * num}元\n`;
    subTotal+=(item.price * num);
  }
  bestCharge+='-----------------------------------\n'
  var promotion = getMaxDiscountPromotion(subTotal, itemIdAndNum);
  if(promotion.discountMoney === 0){
    bestCharge+=`总计：${subTotal}元\n===================================`;
  } else {
    if(promotion.type === '满30减6元'){
      bestCharge+=`使用优惠:
满30减6元，省6元
-----------------------------------
总计：${subTotal - 6}元
===================================`;
    } else if(promotion.type === '指定菜品半价'){
      bestCharge+=`使用优惠:
指定菜品半价(${(promotion.discountItems).join('，')})，省${promotion.discountMoney}元
-----------------------------------
总计：${subTotal - promotion.discountMoney}元
===================================`;
    }
  }
  return bestCharge;
}

// 4min
function getObjectOfItemIdAndNum(selectedItems){
  var itemIdAndNum = {};
  selectedItems.forEach(selectedItem => {
    let splited = selectedItem.split("x");
    let itemId = splited[0].trim();
    let num = Number(splited[1].trim());
    itemIdAndNum[itemId] = num;
  });
  return itemIdAndNum;
}

// 2min
function getItemByItemId(itemId){
  var items = loadAllItems();
  return items.find(item => item.id === itemId);
}

// 5min
function getMaxDiscountPromotion(totalMoney, itemIdAndNum){
  var basePromotion = {type:'', discountItems: [], discountMoney: 0};
  var discountOfBuy30Save6Yuan = getDiscountByUseBuy30Save6Yuan(totalMoney);
  var promotionOfSpecItem = getDiscountBy50PercentOfSpecItem(itemIdAndNum);
  if(discountOfBuy30Save6Yuan > promotionOfSpecItem.discountMoney){
    basePromotion.type = '满30减6元';
    basePromotion.discountMoney = 6;
  } else {
    basePromotion = promotionOfSpecItem;
  }
  return basePromotion;
}

// 1min
function getDiscountByUseBuy30Save6Yuan(totalMoney){
  if(totalMoney < 30){
    return 0;
  } else {
    return 6;
  }
}

// 11min
function getDiscountBy50PercentOfSpecItem(itemIdAndNum){
  var promotion = {type:'指定菜品半价', discountItems: [], discountMoney: 0};
  var promotions = loadPromotions();
  var specItems = promotions.find(p => p.type === '指定菜品半价').items;
  for(let itemId in itemIdAndNum){
    if(specItems.includes(itemId)){
      let item = getItemByItemId(itemId);
      promotion.discountItems.push(item.name);
      promotion.discountMoney+=(item.price / 2);
    }
  }
  return promotion;
}