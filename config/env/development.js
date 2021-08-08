module.exports = {
	dbURI: "mongodb://127.0.0.1:27017/uptime-down-monitoring",
	SESSION_SECRET: "7fa6f51e-92ae-4f9c-aaa5-9080a003f254",
	ORIGIN_CORS: ["http://localhost:4200", "http://192.168.1.55:4200"],
	tokenValidationInDays: 365,
	tempTokenDurationInHours: 1,
	timeZone: "Africa/Cairo",
	cronTime: 5, //run cron jobs every 5 minutes
	appPushOverToken: "aowxetmn69qp7umvdxe19gs9vy7x75",
	HOST: process.env.HOST,
	email: {
		user: "asc.wargames@gmail.com",
		pass: "@asc2020"
	},
}