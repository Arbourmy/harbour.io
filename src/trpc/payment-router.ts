import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../get-payload";
import { SOL_FEE } from "../config";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";
import { shopAddress } from "../lib/transaction/addresses";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useConnection } from "@solana/wallet-adapter-react";

export const paymentRouter = router({
  createSession: privateProcedure
    .input(
      z.object({
        productIds: z.array(z.string()),
        buyerPublicKeyString: z.string(),
        reference: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      let { productIds, buyerPublicKeyString, reference } = input;
      // console.log("productIds", productIds);

      if (productIds.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const payload = await getPayloadClient();
      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: {
            in: productIds,
          },
        },
      });

      const filteredProducts = products.filter(
        (prod) => Number(prod.price) > 0 && prod.approvedForSale === "approved"
      );

      const totalPrice =
        filteredProducts.reduce((acc, prod) => acc + Number(prod.price), 0) +
        SOL_FEE;

      // console.log("totalPrice", totalPrice);
      // console.log("buyerPublicKey", buyerPublicKeyString);

      if (totalPrice <= SOL_FEE) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      try {
        const buyerPublicKey = new PublicKey(buyerPublicKeyString);
        const shopPublicKey = shopAddress;
        const network = WalletAdapterNetwork.Devnet;
        const endpoint = clusterApiUrl(network);
        const connection = new Connection(endpoint);

        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash("finalized");

        const trasaction = new Transaction({
          feePayer: buyerPublicKey,
          blockhash: blockhash,
          lastValidBlockHeight: lastValidBlockHeight,
        });

        const transferInstruction = SystemProgram.transfer({
          fromPubkey: buyerPublicKey,
          lamports: totalPrice * LAMPORTS_PER_SOL,
          toPubkey: shopPublicKey,
        });

        transferInstruction.keys.push({
          pubkey: new PublicKey(reference),
          isSigner: false,
          isWritable: false,
        });

        trasaction.add(transferInstruction);
        const sereializedTransaction = trasaction.serialize({
          requireAllSignatures: false,
        });
        const base64 = sereializedTransaction.toString("base64");

        // console.log("Success!");

        const order = await payload.create({
          collection: "orders",
          data: {
            _isPaid: false,
            products: filteredProducts.map((prod) => prod.id),
            user: user.id,
            base64: base64,
          },
        });

        return { base64: base64, orderId: order.id };
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create transaction",
          cause: err,
        });
      }
    }),
  pollOrderStatus: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const { orderId } = input;

      const payload = await getPayloadClient();

      const { docs: orders } = await payload.find({
        collection: "orders",
        where: {
          id: {
            equals: orderId,
          },
        },
      });

      if (!orders.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [order] = orders;

      return { isPaid: order._isPaid };
    }),

  orderUpdate: privateProcedure
    .input(
      z.object({ orderId: z.string(), isPaid: z.boolean(), base64: z.string() })
    )
    .mutation(async ({ input }) => {
      const { orderId, isPaid, base64 } = input;
      const payload = await getPayloadClient();
      const { docs: orders } = await payload.find({
        collection: "orders",
        where: {
          id: {
            equals: orderId,
          },
        },
      });

      const [order] = orders;
      if (order.base64 === base64) {
        await payload.update({
          collection: "orders",
          id: orderId,
          data: {
            _isPaid: isPaid,
          },
        });
        return { success: true };
      } else {
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Failed to update order. Incorrect Transaction.",
        });
      }
    }),
});
