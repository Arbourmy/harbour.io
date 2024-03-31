"use client";

import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES, SOL_FEE } from "@/config";
import { getPayloadClient } from "@/get-payload";
import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Connection, Keypair, Transaction } from "@solana/web3.js";
import { Check, Loader2, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const Page = () => {
	const { items, removeItem, clearCart } = useCart();
	const router = useRouter()

	const { publicKey, sendTransaction } = useWallet();
	const { connection } = useConnection();
	const buyerPublicKeyString = publicKey?.toString() || "";
	const reference = useMemo(() => Keypair.generate().publicKey, []);
	const referenceString = reference.toString();

	const [transaction, setTransaction] = useState<Transaction | null>(null);
	const [orderID, setOrderID] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const { mutate: createCheckoutSession, isLoading } =
		trpc.payment.createSession.useMutation({
			onSuccess: ({ base64, orderId }) => {
				const trasaction = Transaction.from(Buffer.from(base64, "base64"));
				setTransaction(trasaction);
				setOrderID(orderId);
				console.log("Transaction created successfully", trasaction);
			},
			onError: (err) => {
				if (err.data?.code === "UNAUTHORIZED") {
					toast.error("Please sign in to continue.");
					return;
				}
				if (err.data?.code === "BAD_REQUEST") {
					toast.error("An error occurred. Please try again.");
					return;
				}
			},
		});

	const { mutate: updateOrder, isLoading: isLoadingOrder } =
		trpc.payment.orderUpdate.useMutation({
			onSuccess: () => {
				clearCart();
				toast.success("Payment successful!");
				router.push(`/thank-you?orderID=${orderID}`)
			},
			onError: (err) => {
				if (err.data?.code === "UNAUTHORIZED") {
					toast.error("Please sign in to continue.");
					return;
				}
				if (err.data?.code === "UNPROCESSABLE_CONTENT") {
					toast.error("An error occurred. Please try again.");
					return;
				}
			},
		});

	const productIds = items.map(({ product }) => product.id);
	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => {
		async function trySendTransaction() {
			if (!transaction) {
				return;
			}
			try {
				setLoading(true);
				const signature = await sendTransaction(transaction, connection);
				const response = await connection.confirmTransaction(signature, 'processed') // TODO
				updateOrder({ orderId: orderID, isPaid: true, base64: transaction.serialize({ requireAllSignatures: false }).toString("base64") });
				setLoading(false);
			} catch (e) {
				toast.error('Payment failed. Please try again.');
			}
		}

		trySendTransaction();
	}, [transaction, sendTransaction, connection, updateOrder, orderID, setLoading]);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const cartTotal = items.reduce(
		(total, { product }) => total + product.price,
		0
	);

	const fee = 0.001;

	return (
		<div className="bg-white">
			<div className="relative max-w-2xl px-4 pt-16 pb-24 mx-auto sm:px-6 lg:max-w-7xl lg:px-8">
				<div className="flex flex-row justify-between">
					<h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
						Shopping Cart
					</h1>
					<Button
						aria-label="remove product"
						onClick={() => {
							items.length === 0
								? toast.info("There's nothing to clear.")
								: (() => {
									clearCart(), toast.success("Cart cleared.");
								})();
						}}
						variant="ghost"
					>
						<Trash2 className="w-5 h-5 mr-2" aria-hidden="true" />
						Clear All
					</Button>
				</div>

				<div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
					<div
						className={cn("lg:col-span-7", {
							"rounded-lg border-2 border-dashed border-zinc-200 p-12":
								isMounted && items.length === 0,
						})}
					>
						<h2 className="sr-only">Items in your shopping cart</h2>

						{isMounted && items.length === 0 ? (
							<div className="flex flex-col items-center justify-center h-full space-y-1">
								<div
									aria-hidden="true"
									className="relative w-40 h-40 mb-4 text-muted-foreground"
								>
									<Image
										src="/hippo-empty-cart.png"
										fill
										loading="eager"
										alt="empty shopping cart hippo"
									/>
								</div>
								<h3 className="text-2xl font-semibold">Your cart is empty</h3>
								<p className="text-center text-muted-foreground">
									Whoops! Nothing to show here yet.
								</p>
							</div>
						) : null}

						<ul
							className={cn({
								"divide-y divide-gray-200 border-b border-t border-gray-200":
									isMounted && items.length > 0,
							})}
						>
							{isMounted &&
								items.map(({ product, id }) => {
									const label = PRODUCT_CATEGORIES.find(
										(c) => c.value === product.category
									)?.label;

									const { image } = product.images[0];

									return (
										<li key={id} className="flex py-6 sm:py-10">
											<div className="flex-shrink-0">
												<div className="relative w-24 h-24">
													{typeof image !== "string" && image.url ? (
														<Image
															fill
															src={image.url}
															alt="product image"
															className="object-cover object-center w-full h-full rounded-md sm:h-48 sm:w-48"
														/>
													) : null}
												</div>
											</div>

											<div className="flex flex-col justify-between flex-1 ml-4 sm:ml-6">
												<div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
													<div>
														<div className="flex justify-between">
															<h3 className="text-sm">
																<Link
																	href={`/product/${product.id}`}
																	className="font-medium text-gray-700 hover:text-gray-800"
																>
																	{product.name}
																</Link>
															</h3>
														</div>

														<div className="flex mt-1 text-sm">
															<p className="text-muted-foreground">
																Category: {label}
															</p>
														</div>

														<p className="mt-1 text-sm font-medium text-gray-900">
															{formatPrice(product.price)}
														</p>
													</div>

													<div className="w-20 mt-4 sm:mt-0 sm:pr-9">
														<div className="absolute top-0 right-0">
															<Button
																aria-label="remove product"
																onClick={() => removeItem(id)}
																variant="ghost"
															>
																<X className="w-5 h-5" aria-hidden="true" />
															</Button>
														</div>
													</div>
												</div>

												<p className="flex mt-4 space-x-2 text-sm text-gray-700">
													<Check className="flex-shrink-0 w-5 h-5 text-green-500" />

													<span>Eligible for delivery</span>
												</p>
											</div>
										</li>
									);
								})}
						</ul>
					</div>

					<section className="px-4 py-6 mt-16 rounded-lg bg-gray-50 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
						<h2 className="text-lg font-medium text-gray-900">Order summary</h2>

						<div className="mt-6 space-y-4">
							<div className="flex items-center justify-between">
								<p className="text-sm text-gray-600">Subtotal</p>
								<p className="text-sm font-medium text-gray-900">
									{isMounted ? (
										formatPrice(cartTotal)
									) : (
										<Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
									)}
								</p>
							</div>

							<div className="flex items-center justify-between pt-4 border-t border-gray-200">
								<div className="flex items-center text-sm text-muted-foreground">
									<span>Flat Transaction Fee</span>
								</div>
								<div className="text-sm font-medium text-gray-900">
									{isMounted ? (
										items.length < 1 ? (
											formatPrice(0)
										) : (
											formatPrice(SOL_FEE)
										)
									) : (
										<Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
									)}
								</div>
							</div>

							<div className="flex items-center justify-between pt-4 border-t border-gray-200">
								<div className="text-base font-medium text-gray-900">
									Order Total
								</div>
								<div className="text-base font-medium text-gray-900">
									{isMounted ? (
										items.length < 1 ? (
											formatPrice(0)
										) : (
											formatPrice(cartTotal + fee)
										)
									) : (
										<Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
									)}
								</div>
							</div>
						</div>

						<div className="mt-6">
							<Button
								disabled={
									items.length === 0 ||
									isLoading ||
									isLoadingOrder ||
									isMounted === false ||
									loading ||
									buyerPublicKeyString === ""
								}
								onClick={() =>
									createCheckoutSession({
										productIds,
										buyerPublicKeyString,
										reference: referenceString,
									})
								}
								className="w-full"
								size="lg"
							>
								{isLoading || isLoadingOrder || loading ? (
									<Loader2 className="w-4 h-4 animate-spin mr-1.5" />
								) : null}
								{buyerPublicKeyString === ""
									? "Please connect your wallet."
									: "Checkout"}
							</Button>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

export default Page;
