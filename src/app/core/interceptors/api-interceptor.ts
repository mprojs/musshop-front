import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from "rxjs";

// @Injectable()
// export class APIInterceptor implements HttpInterceptor {
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     console.log(req.url);
//     if (req.url.startsWith('http://')) {
//       return next.handle(req);
//     }
//     const apiReq = req.clone({ url: `http://musshop-back.local/wp-json/wc/v3/${req.url}` });
//     return next.handle(apiReq);
//   }
// }
