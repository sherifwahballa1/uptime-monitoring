const privateKeySecret = `-----BEGIN RSA PRIVATE KEY-----
MIICXwIBAAKBgQC/lWo9+j1O18sn6KxsO7PdWERfAyGTxD/Aa3cD7TJrAnRq+mb9
c6/WQNHpHRX1Qnb4r9h+2fz1MP+wF6edaAwJw9A08YgS0RfHiEZ+vavSl+PdVI90
9TMpD/zYtfE5Ltb1joWK5YZ2s/xoJuthMoLfLhPJPH/RPnivGDlgyV8zAwIDAQAB
AoGBAIvb5NJX8xeym0GILw9YSkcFH+yImaOI+c1b5md8ankKMrjCEhtmr+/mJBdc
v2HrYnTL0m1Qb8UDPzVrH1be1SGq/NUpyRDK5U+UUIQgVbS+hCCxyzbHsUwIdNjo
XJsCqIxMHF8y1b/kucHRhQjG8BGtkh7HvEDc/UvMYS8HV+05AkEA85AlZQiggHA0
+Q7CVAPjh7dvhqpTalBIb1cAg4PTuLCL0OhLZFT/2ILs09tx5P6D1bd7AGas3QIS
BL7kX8xibQJBAMldy2Wz+7mGaSw4rkQSl3PokCryUVjuMMoqZLmPVwzhTUlpdKdF
IUuAYaOTuWjKgiFDnBA8u4/ZT5To74yBBS8CQQCeQpOJysk/q6lAC+8JWF2H2hGF
lzcMZY4rioSy7/2qjEzNOaODVhfIP4pTPswK17YiME6kPBMmqCm9G6yY8t0hAkEA
iuH/FCFD39ydk1twjhDIlq/zJzvD8XMvAXCl0fnUD1Uhah2q0Gd0pE9iiGCtw2HQ
yMKJ1AUfVAKMyeayuZSPDwJBAOqURU1IK5MVK67ETimTtO7dWN10UVs/NjD5zKs7
F9rUO2wKePajfFl6S8XN+UuyGZvIavsMibi1TzdQFFlx464=
-----END RSA PRIVATE KEY-----`;

const publicKeySecret = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/lWo9+j1O18sn6KxsO7PdWERf
AyGTxD/Aa3cD7TJrAnRq+mb9c6/WQNHpHRX1Qnb4r9h+2fz1MP+wF6edaAwJw9A0
8YgS0RfHiEZ+vavSl+PdVI909TMpD/zYtfE5Ltb1joWK5YZ2s/xoJuthMoLfLhPJ
PH/RPnivGDlgyV8zAwIDAQAB
-----END PUBLIC KEY-----`;

const defaultTempTokenSecret = 'AoGBAIvb5NJX8xeym0GILw9YSkcFH+yImaOI+c1b5md8ankKMrjCEhtmr+/mJBdc';


const envs = {
  production: 'production',
  development: 'development'
};

const currentEnv = process.env.NODE_ENV || envs.development;
const config = require(`./env/${currentEnv}.js`);


config.PRIVATEKEY = process.env.PRIVATE_KEY || privateKeySecret;
config.PUBLICKEY = process.env.PUBLIC_KEY || publicKeySecret;

config.tempTokenSecret = process.env.TEMP_TOKEN_SECRET || defaultTempTokenSecret;
config.currentEnv = currentEnv;


console.log(`===================== CONFIG [${currentEnv}] =====================`);
module.exports = config;