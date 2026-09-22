"use client";

import { useCallback, useMemo, useState } from "react";
import type { CartItem } from "@/types";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: CartItem) => {
    setItems((current) => {
      const existing = current.find(
        (row) => row.kind === item.kind && row.itemId === item.itemId,
      );

      if (!existing) return [...current, item];

      return current.map((row) =>
        row.kind === item.kind && row.itemId === item.itemId
          ? { ...row, cantidad: row.cantidad + item.cantidad }
          : row,
      );
    });
  }, []);

  const removeItem = useCallback((kind: CartItem["kind"], itemId: string) => {
    setItems((current) =>
      current.filter((row) => !(row.kind === kind && row.itemId === itemId)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, row) => sum + row.cantidad, 0),
    [items],
  );

  return { items, addItem, removeItem, clear, itemCount };
}
