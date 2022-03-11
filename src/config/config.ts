import dotenv from "dotenv";

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = process.env.SERVER_PORT || 3131;

const SERVER = {
	hostname: SERVER_HOSTNAME,
	port: SERVER_PORT,
};

// const LOGS = {
//     level: process.env.LOG_LEVEL || 'silly'
// };

const config = {
	server: SERVER,
	// logs: LOGS
};

export default config;
