export const purchasePack = (type) => {

  const packs = {
    small: { coins:50, price:"RM 4.90" },
    medium: { coins:120, price:"RM 9.90" },
    large: { coins:300, price:"RM 19.90" }
  };

  return packs[type];
};
