import { DEPOSIT_USD, DISCOUNT_PCT } from "./catalog";

/** Price breakdown in USD: discount always applied, fixed deposit now, balance on the day. */
export function quote(price: number) {
  const final = Math.round(price * (1 - DISCOUNT_PCT / 100));
  const deposit = Math.min(DEPOSIT_USD, final);
  return { price, final, deposit, balance: final - deposit };
}
