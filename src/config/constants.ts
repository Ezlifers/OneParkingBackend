const env = process.env.NODE_ENV || 'development'
const publicDir = env == 'development' || env == 'local'? '' : '/home';

export const CONFIG_DEFAULTS = "config";
export const CONFIG_ID = "configId";

export const DATA_VERSION = "dataVersion"
export const PERMISSIONS = "permissions"

export const TIME_RANGE = ['Lunes-Viernes', 'Sabado', 'Domingo']

export const SUPER = "Super"
export const STTM = "Sttm"
export const SUPERVISOR = "Supervisor"
export const AUX = "Auxiliar"
export const CLIENT = "Cliente"

export const IMG_USER_NAME_DEFAULT = "unknown.jpg"
export const IMG_USER_DEFAULT = `${publicDir}/public/imgsrc/${IMG_USER_NAME_DEFAULT}`
export const IMG_USER_PATH = `${publicDir}/public/images/usuarios/`
export const IMG_INCIDENT_PATH = `${publicDir}/public/images/incidencias/`

export const LOC_RADIUS = 4;




