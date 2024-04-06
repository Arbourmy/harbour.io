import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/ProductReel";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  CheckCircle,
  Leaf,
  LockKeyhole,
} from "lucide-react";
import Link from "next/link";

const perks = [
  {
    name: "Secure Payments",
    Icon: LockKeyhole,
    description:
      "We use the latest encryption technology to ensure that your transactions are always secure.",
  },
  {
    name: "Quality Assurance",
    Icon: CheckCircle,
    description:
      "Every product listed on our platform goes through a rigorous quality assurance process.",
  },
  {
    name: "For the Planet",
    Icon: Leaf,
    description:
      "We are committed to sustainability and reducing our impact on the environment.",
  },
];

export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Your marketplace for high-quality{" "}
            <span className="text-blue-600">medicine and food</span>.
          </h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">
            Welcome to Harbour.io ⚓. A holistic preventive health platform that aims to change how healthcare is done. Instead of expensive hospital bills, pills after pills, and just generally feeling awful, we want to help you stop yourself from falling sick in the first place. We are looking to deliver end-to-end care, spanning telehealth consultations and diagnosis, to day-to-day monitoring of diets and exercise, to give you and your caregivers the insight you need to truly target your self-care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link href="/products" className={buttonVariants()}>
              Browse Trending
            </Link>
            <Button variant="ghost">Our quality promise &rarr;</Button>
          </div>
        </div>

        <ProductReel
          query={{ sort: 'desc', limit: 4, category: 'medicines'}}
          href='/products?sort=recent&category=medicines'
          title='Medicine'
        />

        <ProductReel
          query={{ sort: 'desc', limit: 4, category: 'foods' }}
          href='/products?sort=recent&category=foods'
          title='Food'
        />
      </MaxWidthWrapper>
      <section className="border-t border-gray-200 bg-gray-50">
        <MaxWidthWrapper className="py-20">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-8">
            {perks.map((perk) => (
              <div
                key={perk.name}
                className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
              >
                <div className="md:flex-shrink-0 flex justify-center">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-900">
                    {<perk.Icon className="w-1/3 h-1/3" />}
                  </div>
                </div>
                <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                  <h3 className="text-base font-medium text-gray-900">
                    {perk.name}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
