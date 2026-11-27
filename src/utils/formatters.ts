export function toPersianDigits(n: number | string): string {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n
    .toString()
    .replace(/[0-9]/g, (w) => farsiDigits[+w]);
}

export function formatNumberWithCommas(n: number | string): string {
  if (n === undefined || n === null) return '۰';
  const parts = n.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '،');
  return toPersianDigits(parts.join('.'));
}

export function formatRial(amount: number): string {
  if (isNaN(amount)) return '۰ ریال';
  return `${formatNumberWithCommas(amount)} ریال`;
}

export function formatToman(amount: number): string {
  if (isNaN(amount)) return '۰ تومان';
  return `${formatNumberWithCommas(amount)} تومان`;
}

export function calculateTotalFee(
  serviceToman: number,
  additionalGovFees: { title: string; costToman: number }[]
) {
  const govTotal = additionalGovFees.reduce((acc, item) => acc + (item.costToman || 0), 0);
  const grandTotal = serviceToman + govTotal;

  return {
    serviceToman,
    serviceRial: serviceToman * 10,
    govTotalToman: govTotal,
    govTotalRial: govTotal * 10,
    grandTotalToman: grandTotal,
    grandTotalRial: grandTotal * 10,
  };
}
