export function FeatureBar() {
  return (
    <div className="section-container">
      <div className="border-t border-gray-200 py-8 grid sm:grid-cols-2 gap-6 sm:gap-0 sm:divide-x divide-gray-200">
        <div className="pr-0 sm:pr-8">
          <h3 className="font-semibold text-brand-black mb-1.5">Free Checkup</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Comprehensive evaluation with no upfront costs. Limited time offer.
          </p>
        </div>
        <div className="pl-0 sm:pl-8">
          <h3 className="font-semibold text-brand-black mb-1.5">Custom Treatment Plan</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            From diagnosis to recovery, we map every step for your unique needs.
          </p>
        </div>
      </div>
    </div>
  );
}
