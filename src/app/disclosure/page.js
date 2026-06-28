// Affiliate disclosure page (server component, so it gets proper metadata).

export const metadata = {
  title: "Affiliate Disclosure",
  description:
    "Zentlify is a participant in the Amazon Services LLC Associates Program. As an Amazon Associate we earn from qualifying purchases.",
};

export default function DisclosurePage() {
  return (
    <>
      <main
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "32px 20px 64px",
          color: "#333",
          lineHeight: 1.7,
        }}
      >
        <h1 style={{ fontWeight: "bold", marginBottom: 16 }}>
          Affiliate Disclosure
        </h1>

        <p>
          Zentlify is a participant in the Amazon Services LLC Associates
          Program, an affiliate advertising program designed to provide a means
          for sites to earn advertising fees by advertising and linking to
          Amazon.com and affiliated sites.
        </p>

        <p>
          <strong>
            As an Amazon Associate, Zentlify earns from qualifying purchases.
          </strong>{" "}
          This means that when you click on a product link on our site and make
          a purchase on Amazon, we may receive a small commission — at no extra
          cost to you.
        </p>

        <p>
          The commissions we earn help us keep Zentlify running and continue
          curating products we genuinely think are worth your attention. We only
          link to products on Amazon; we do not sell anything directly, and we do
          not store payment information.
        </p>

        <p>
          Product availability, pricing, and details are determined by Amazon and
          may change at any time. Please refer to the relevant Amazon product
          page for the most up-to-date information before making a purchase.
        </p>

        <p>
          Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its
          affiliates. Zentlify is not affiliated with Amazon.com, Inc. beyond the
          Associates Program described above.
        </p>
      </main>
    </>
  );
}
