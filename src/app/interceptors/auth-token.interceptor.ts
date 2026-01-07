import { HttpInterceptorFn } from "@angular/common/http";

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const user = sessionStorage.getItem('user');
    const parsedUser = user ? JSON.parse(user) : null;
    const token = parsedUser?.token;

    const authReq = token
        ? req.clone({
            setHeaders: {
            Authorization: `Bearer ${token}`,
            },
        })
        : req;

    return next(authReq);
}