
export default function DisplayQuantityCard({quantity}:{quantity:number}) {
  return (
    <div className="px-4 py-2 rounded border">
    <p className="text-sm text-slate-600 border-b border-dashed pb-1 mb-1">Total Qty</p>
    <p className="text-xl font-semibold">
      {quantity ?? 0}
    </p>
  </div>
  )
}
