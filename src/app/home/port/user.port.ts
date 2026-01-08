import { BehaviorSubject, Observable } from "rxjs";

import { User } from "src/utils/model/user-interface";

export abstract class UserPort {
    abstract user$: Observable<User | null>;
    abstract getUserInfo(uid: string): Observable<User>;
}