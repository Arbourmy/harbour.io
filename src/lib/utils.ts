import { type ClassValue, clsx } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
	price: number | string,
	options: {
		currency?: "USD" | "SOL" | "EUR",
		notation?: Intl.NumberFormatOptions["notation"]
	} = {}
) {
	const { currency = "SOL", notation = "compact" } = options;
	const numericPrice = typeof price === "string" ? parseFloat(price) : price;
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		notation,
		maximumFractionDigits: 3,
	}).format(numericPrice)
}

export function constructMetadata({
	title = 'Harbour.io',
	description = 'Harbour.io - Your marketplace for high-quality medicine and food.',
	image = '/thumbnail.png',
	icons = '/favicon.ico',
	noIndex = false,
  }: {
	title?: string
	description?: string
	image?: string
	icons?: string
	noIndex?: boolean
  } = {}): Metadata {
	return {
	  title,
	  description,
	  openGraph: {
		title,
		description,
		images: [
		  {
			url: image,
		  },
		],
	  },
	  twitter: {
		card: 'summary_large_image',
		title,
		description,
		images: [image],
		creator: '@MY_safe_Harbour',
	  },
	  icons,
	  metadataBase: new URL('https://arbour-io.onrender.com/'),
	  ...(noIndex && {
		robots: {
		  index: false,
		  follow: false,
		},
	  }),
	}
  }