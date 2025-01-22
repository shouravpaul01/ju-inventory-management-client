import { TAccessoryCartItem } from "@/src/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Fetch cart from localStorage
const fetchCart = async (): Promise<TAccessoryCartItem[]> => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

// Update cart in localStorage
const updateCart = async (cart: TAccessoryCartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
  return cart;
};

export const useCart = () => {
  const queryClient = useQueryClient();

  const { data: cart = [], refetch } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    staleTime: Infinity,
  });

  const { mutate: addToCart } = useMutation({
    mutationFn: (newItem: TAccessoryCartItem) => {
        const isAlreadyInCart = cart.some((item) => item._id === newItem._id);

      if (isAlreadyInCart) {
        toast.warning("This accessory is already in the cart!");
        return Promise.reject("Already in cart");
      }

      const updatedCart = [...cart, newItem];
      return updateCart(updatedCart);
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart"], updatedCart);
    },
  });

  const { mutate: removeFromCart } = useMutation({
    mutationFn: (id: string) => {
      const updatedCart = cart?.filter((item) => item._id !== id);
      return updateCart(updatedCart);
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart"], updatedCart);
    },
  });

  return { cart, addToCart, removeFromCart, refetch };
};
