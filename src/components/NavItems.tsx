"use client";

import { PRODUCT_CATEGORIES } from "@/config";
import { useEffect, useRef, useState } from "react";
import NavItem from "./NavItem";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const NavItems = () => {
	const [activeIndex, setActiveIndex] = useState<null | number>(null);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setActiveIndex(null);
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const isAnyOpen = activeIndex !== null;

	const navRef = useRef<HTMLDivElement | null>(null);

	useOnClickOutside(navRef, () => setActiveIndex(null));

	return (
		<div className="flex gap-4 h-full" ref={navRef}>
			{PRODUCT_CATEGORIES.map((category, i) => {
				const handleOpen = () => {
					if (activeIndex === i) {
						setActiveIndex(null);
					} else {
						setActiveIndex(i);
					}
				};

				const isOpen = i === activeIndex;
				return (
					<NavItem
						category={category}
						handleOpen={handleOpen}
						isOpen={isOpen}
						key={category.value}
						isAnyOpen={isAnyOpen}
					/>
				);
			})}
			<div className="flex">
				<div className="relative flex items-center">
					<Link
						href='/consult'
						className={cn(buttonVariants({
							variant: 'default',
						}),
							// "bg-white border-2 border-blue-600 text-black hover:text-white"
							"from-blue-400/95 to-blue-500/50 bg-gradient-to-r"
						)}>
						Consult us
					</Link>
				</div>
			</div>
		</div>
	);
};

export default NavItems;
