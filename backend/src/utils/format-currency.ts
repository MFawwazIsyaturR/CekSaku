// Convert dollars to cents when saving
export function convertToCents(amount: number) {
  return Math.round(amount * 100);
}

// Convert cents to dollars when retrieving
//convertFromCents
export function convertToDollarUnit(amount: number) {
  return amount / 100;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2, // Menampilkan dua angka di belakang koma
    maximumFractionDigits: 2
  }).format(amount);
}