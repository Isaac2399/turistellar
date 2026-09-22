export default function CheckoutPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Checkout</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Empaqueta tour + productos. Aquí se firmará el pago Stellar (XLM/USDC)
        y se dejará el gancho para Stripe / MoneyGram.
      </p>
    </section>
  );
}
