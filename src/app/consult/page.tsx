"use client"

import MapContainer from "@/components/MapContainer"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"

const Page = () => {

	const mapRef = useRef<HTMLDivElement>(null);

	const scrollToElement = () => {
		const {current} = mapRef
		if (current !== null){
			current.scrollIntoView({behavior: "smooth"})
		}
	}
	return (
		<>

			<section className="relative bg-cover bg-center bg-no-repeat">
				<Image
					fill
					src="/hero.webp"
					className="absolute inset-0 w-full h-full object-cover"
					alt="thank you for your order"
				/>
				<div className="absolute inset-0 bg-blue-400/75 sm:bg-transparent sm:from-blue-400/95 sm:to-blue-400/50 ltr:sm:bg-gradient-to-r sm:bg-gradient-to-l"></div>

				<div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
					<div className="max-w-xl text-center ltr:sm:text-left m:text-right">
						<h1 className="text-3xl font-extrabold sm:text-5xl text-white">
							Let us guide you to your
							<strong className="block font-extrabold text-blue-600"> Perfect Health Partner </strong>
						</h1>

						<p className="mt-4 max-w-lg sm:text-xl text-left text-white font-medium">
							Find your ideal health ally with us, where personalized care meets expertise. Start your journey to wellness today with a consultation that understands you.
						</p>

						<div className="mt-8 flex flex-wrap gap-4 text-center">
							<Link
								href='#'
								className={
									cn(buttonVariants({
									variant: 'default',
									size: 'lg',
								}), "w-full px-12 sm:w-auto")} onClick={scrollToElement}>
								Get Started
							</Link>

							<a
								href="#"
								className="block w-full rounded border-white border-2 bg-transparent px-12 py-3 text-sm text-white font-medium hover:bg-white shadow hover:text-blue-700 ease-in-out focus:outline-none focus:ring active:text-blue-500 sm:w-auto"
							>
								Learn More
							</a>
						</div>
					</div>
				</div>
			</section>
			{/* <MaxWidthWrapper className="mt-12"> */}
			<div className="map" ref={mapRef}>
				<MapContainer />
			</div>
			{/* </MaxWidthWrapper> */}
		</>
	)
}

export default Page