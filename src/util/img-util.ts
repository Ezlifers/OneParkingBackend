import { IMG_USER_PATH, IMG_USER_DEFAULT, IMG_INCIDENT_PATH } from '../config/constants'
export { IMG_USER_NAME_DEFAULT } from '../config/constants'
import * as fs from 'fs'

const env = process.env.NODE_ENV || 'development'
const publicDir = env == 'development' || env == 'local'? 'out' : '/home';

export function saveUserImage(image: string, success: (path: string) => void, undefinedImage: (defaultImg: string) => void, fail: () => void) {
    if (image == null) {
        undefinedImage(IMG_USER_DEFAULT);
    } else {
        saveImage(image, IMG_USER_PATH, "jpg", success, undefinedImage, fail);
    }
}

export function saveIncidentImage(image: string, success: (path: string) => void, undefinedImage: (defaultImg: string) => void, fail: () => void) {
    saveImage(image, IMG_INCIDENT_PATH, "webp", success, undefinedImage, fail);
}

function saveImage(imageBase64: string, rootPath: string, ext: string, success: (path: string) => void, undefinedImage: (defaultImg: string) => void, fail: () => void) {

    let img = new Buffer(imageBase64, "base64");
    let name: string = `${Date.now()}.${ext}`;
    let path: string = rootPath + name;
    let filePath: string = publicDir + path;

    fs.writeFile(filePath, img, (err) => {
        if (err) {
            fail();
        } else {
            success(path);            
        }
    })

}

export function deleteUserImage(name: string) {
    const path = `${publicDir}${IMG_USER_PATH}${name}`;
    deleteImg(`${publicDir}${IMG_USER_PATH}${name}`)
}

export function deleteIncidentImage(name: string) {
    deleteImg(`${publicDir}${IMG_INCIDENT_PATH}${name}`)
}

function deleteImg(path: string) {
    fs.unlink(path);
}