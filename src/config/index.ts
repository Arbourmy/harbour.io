export const PRODUCT_CATEGORIES = [
	{
		label: "Medicines",
		value: "medicines" as const,
		featured: [
			{
				name: "Editor Picks",
				href: "#",
				imageSrc: '/nav/ui-kits/mixed.jpg'
			},
			{
				name: "New Releases",
				href: "#",
				imageSrc: '/nav/ui-kits/blue.jpg'
			},
			{
				name: "Best Sellers",
				href: "#",
				imageSrc: '/nav/ui-kits/purple.jpg'
			}
		]
	},
	{
		label: "Foods",
		value: "foods" as const,
		featured: [
			{
				name: "Favorite Foods",
				href: "#",
				imageSrc: '/nav/icons/picks.jpg'
			},
			{
				name: "New Releases",
				href: "#",
				imageSrc: '/nav/icons/new.jpg'
			},
			{
				name: "Best Sellers",
				href: "#",
				imageSrc: '/nav/icons/bestsellers.jpg'
			}
		]
	}
]

export const SOL_FEE = 0.001 as number