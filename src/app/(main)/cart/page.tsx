"use client"

import { useCart } from "@/src/hooks/cart"



export default function CartPage() {
  const {cart}=useCart()
  console.log(cart,"cart")
  return (
    <div>
      CartPage
    </div>
  )
}
