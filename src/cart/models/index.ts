export type CartItem = {
  product_id: string,
  count: number,
}

export type Cart = {
  id: string,
  items: CartItem[],
}
