import 'zone.js/dist/zone-node';

import {ngExpressEngine} from '@nguniversal/express-engine';
import * as express from 'express';
import {join} from 'path';

import {AppServerModule} from './src/main.server';
import {APP_BASE_HREF} from '@angular/common';
import {existsSync} from 'fs';
import {REQUEST, RESPONSE} from "@nguniversal/express-engine/tokens";
import redis from 'redis';

console.log = function () {
};

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const redisClient = redis.createClient();
  const cacheKey: (req: express.Request) => string = (req) =>
    `ssr_${req.originalUrl}`;
  const distFolder = join(process.cwd(), 'dist/musshop-front/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // todo -add cache (Redis) https://www.kgajera.com/blog/improve-angular-ssr-performance-using-redis-cache
  const cachedResponse: express.RequestHandler = (req, res, next) =>
    redisClient.get(cacheKey(req), (error: Error, reply: string) => {
      if (reply?.length) {
        // Cache exists. Send the response.
        res.send(reply);
      } else {
        // Use the Universal engine to render a response.
        next();
      }
    });

  const universalRenderer: express.RequestHandler = (req, res) => {
    res.render(
      indexHtml,
      {
        req,
        providers: [
          {provide: APP_BASE_HREF, useValue: req.baseUrl},
          {provide: REQUEST, useValue: req},
          {provide: RESPONSE, useValue: res}
        ],
      },
      (error: Error, html: string) => {
        if (error) {
          return req.next(error);
        }
        if (res.statusCode === 200) {
          // Cache the rendered HTML
          redisClient.set(cacheKey(req), html);
        }
        res.send(html);
      }
    );
  };

  // All regular routes use the Universal engine
  server.get('*', cachedResponse, universalRenderer);
  // server.get('*', (req, res) => {
  //   res.render(indexHtml, {
  //     req,
  //     providers: [
  //       {provide: APP_BASE_HREF, useValue: req.baseUrl},
  //       {provide: REQUEST, useValue: req},
  //       {provide: RESPONSE, useValue: res}
  //     ]
  //   });
  // });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
