import next from "next"

const PORT = Number(process.env.PORT) || 3000

export const nextApp = next({
	dev: process.env.NODE_ENV !== "production",
	port: PORT,
	conf: {
		images: {
			domains: ['localhost', 'https://arbour-io.onrender.com']
		}
	}
})

export const nextHandler = nextApp.getRequestHandler()