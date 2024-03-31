import express from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { inferAsyncReturnType } from "@trpc/server";
import { parse } from "url";
import { PayloadRequest } from "payload/types";
import nextBuild from "next/dist/build";
import path from "path";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

export type ExpressContext = inferAsyncReturnType<typeof createContext>

const start = async () => {
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`);
      },
    },
  });

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info(
        'Next.js is building for production'
      )

      // @ts-expect-error
      await nextBuild(path.join(__dirname, '../'))

      process.exit()
    })

    return
  }

  const cartRouter = express.Router()

  cartRouter.use(payload.authenticate)

  cartRouter.get('/', (req, res) => {
    const request = req as PayloadRequest

    if (!request.user)
      return res.redirect('/sign-in?origin=cart')

    const parsedUrl = parse(req.url, true)
    const { query } = parsedUrl

    return nextApp.render(req, res, '/cart', query)
  })

  app.use('/cart', cartRouter)

  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext, // make express req/res available in trpc context next js (forward to next js)
    })
  );

  app.use((req, res) => nextHandler(req, res));

  nextApp.prepare().then(() => {
    payload.logger.info("Next JS Started");

    app.listen(PORT, async () => {
      payload.logger.info(
        `Server started on ${process.env.NEXT_PUBLIC_SERVER_URL}`
      );
    });
  });
};

start();
