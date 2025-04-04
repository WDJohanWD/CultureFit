import { useTranslation } from "react-i18next";

function Memberships() {
  const { t } = useTranslation("memberships");

  const tiers = [
    {
      name: t("n1"),
      id: t("id1"),
      priceId: "price_1R4jFS2esfOHTwEzogii8lfq", // ID del precio en Stripe
      priceMonthly: t("p1"),
      description: t("d1"),
      features: [t("f11"), t("f12"), t("f13"), t("f14")],
    },
    {
      name: t("n2"),
      id: t("id2"),
      priceId: "price_1R4jNE2esfOHTwEzlJUbL54J", // ID del precio en Stripe
      priceMonthly: t("p2"),
      description: t("d2"),
      features: [t("f21"), t("f22"), t("f23"), t("f24"), t("f25")],
    },
    {
      name: t("n3"),
      id: t("id3"),
      priceId: "price_1R4jRN2esfOHTwEzAfcJXAOi", // ID del precio en Stripe
      priceMonthly: t("p3"),
      description: t("d3"),
      features: [t("f31"), t("f32"), t("f33"), t("f34")],
    }
  ];

  // Metodo para redirigir al checkout-session
  const handleCheckout = async (priceId) => {
    const CHECKOUT_SESSION_URL = "http://localhost:9000/payments/create-checkout-session/";

    try {
      const response = await fetch(CHECKOUT_SESSION_URL + priceId, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al iniciar la sesión de pago");
      }

      const { url } = await response.json(); // Stripe devuelve la URL de pago
      window.location.href = url; // Redirige a Stripe Checkout
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="relative isolate bg-white px-6 py-24 lg:px-8">
      <img src="/CultureFitLogoNegro.png" alt="" className="h-12 mx-auto mb-3"/>
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
          {t("titulo1")}
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-gray-600 sm:text-xl">
        {t("subtitulo1")}
      </p>
      <div className="mx-auto pt-18 grid max-w-lg grid-cols-1 gap-x-6 sm:gap-y-6 lg:max-w-6xl lg:grid-cols-3">
        {tiers.map((tier) => (
          <div key={tier.id} className='flex flex-col h-full rounded-3xl bg-white/60 sm:mx-8 lg:mx-0 p-8 ring-1 ring-gray-300 sm:p-10'>
            <h3 id={tier.id} className='text-base/7 font-semibold text-primary'>
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span className="text-5xl font-semibold tracking-tight text-gray-900">
                {tier.priceMonthly}
              </span>
              <span className='text-base text-gray-500'>/{t("mes")}</span>
            </p>

            <p className='mt-6 text-base/7 text-gray-600'>
              {tier.description}
            </p>
            <div className="flex flex-col flex-grow">
              <ul role="list" className="mt-8 space-y-3 text-sm/6 sm:mt-10 text-gray-600 mb-15">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex gap-x-3">
                    <span className="font-bold me-1">&#8226;</span>
                    {feature}
                  </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCheckout(tier.priceId)}
                  className='mt-auto block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 
                      focus-visible:outline-offset-2 text-font ring-1 ring-font ring-inset 
                      hover:ring-primary hover:bg-primary hover:text-white focus-visible:outline-primary transition cursor-pointer'>
                  {t("elegir")}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Memberships;