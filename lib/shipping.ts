export const calculateShippingFee = (subtotal: number): number => {
  if (subtotal <= 0) return 0;
  if (subtotal < 500) return 50;
  if (subtotal < 1000) return 100;
  if (subtotal < 2000) return 200;
  if (subtotal < 3000) return 300;
  if (subtotal < 4000) return 400;
  if (subtotal < 5000) return 500;
  if (subtotal < 6000) return 600;
  if (subtotal < 7000) return 700;
  if (subtotal < 8000) return 800;
  if (subtotal < 9000) return 900;
  if (subtotal < 10000) return 999;
  if (subtotal < 30000) return 1500;
  return 0; // Free for 30,000+
};
