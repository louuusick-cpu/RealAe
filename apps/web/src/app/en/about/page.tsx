export default function AboutPageEN() {
  return (
    <main className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24">
      <div className="mb-16">
        <h1 className="text-4xl md:text-6xl font-light mb-6">About Us</h1>
        <p className="text-lg md:text-xl text-text-dim leading-relaxed max-w-2xl">
          Real Aesthetics is a closed companion agency offering a wide range of services. We focus on high-quality, personalized experiences for every client.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 border-t border-line pt-12">
        <div>
          <h2 className="text-xl font-medium mb-4">Philosophy</h2>
          <p className="text-text-dim leading-relaxed mb-6">
            We believe the perfect evening starts with the right company. Whether it's a business dinner, a social event, or a private meeting — we hand-pick our models, paying attention to every detail.
          </p>
          <p className="text-text-dim leading-relaxed">
            There is no conveyor belt here. We don't work with a flow of clients. Our approach is manual selection, absolute discretion, and attention to your desires.
          </p>
        </div>
        
        <div>
          <h2 className="text-xl font-medium mb-4">Principles</h2>
          <ul className="space-y-4 text-text-dim">
            <li className="flex items-start gap-3">
              <span className="text-text mt-1">01</span>
              <span><strong className="text-text font-medium">Confidentiality.</strong> Complete anonymity and safety for both clients and models.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-text mt-1">02</span>
              <span><strong className="text-text font-medium">Selection.</strong> Only verified girls with model looks and social manners in our catalog.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-text mt-1">03</span>
              <span><strong className="text-text font-medium">Service.</strong> We work 24/7 to arrange your leisure in the shortest possible time.</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
