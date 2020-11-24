import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

// @Injectable()
// export class ApiAuthInterceptor implements HttpInterceptor {
//   intercept(
//     request: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     console.log(request.url);
//     if (request.url.indexOf('graphql') > 0) {
//       return next.handle(request);
//     }
//
//     const currentJWT = JSON.parse(localStorage.getItem('token'));
//
//     request = request.clone({
//       setHeaders: {
//         Authorization: 'Basic ' + currentJWT
//       }
//     });
//     console.log(request);
//
//
//     return next.handle(request);
//   }
// }

