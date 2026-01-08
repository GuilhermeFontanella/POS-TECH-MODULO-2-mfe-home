import { User } from "./model/user-interface";

export class UserDataHandler {
    constructor(private userData?: User) {}

    storeData() {
        localStorage.setItem('userData', JSON.stringify(this.userData));
    }

    getUserStored() {
        const info = localStorage.getItem('userData');
        return info ? JSON.parse(info) : null;
    }

    getUserName() {
        const info = localStorage.getItem('userData');
        if (info) {
            const userInfo: User = JSON.parse(info);
            return userInfo.name;
        } else {
            return null;
        }
    }
}