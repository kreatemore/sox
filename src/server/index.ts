import * as cfonts from 'cfonts';
import * as dns from 'dns';
import * as express from 'express';
import * as os from 'os';
import { GREETING_CONFIG, ServerConfiguration } from './config';
import { Initialize } from './decorators/initializable';
import { MIDDLEWARES } from './middlewares';
import { Initializable } from './models/initializable.model';

@Initialize
export class Server implements Initializable {
  static router = express.Router();
  instance = express();

  constructor() {}

  static greet(appConfig: ServerConfiguration): void {
    const hostname = os.hostname();
    const printGreeting = (_err: Error, ipAddress: string, _: null) => {
      cfonts.say(appConfig.NAME, GREETING_CONFIG);
      console.log(`Listening at http://${ipAddress}:${appConfig.PORT}`);
    };

    dns.lookup(hostname, printGreeting);
  }

  init(): void {
    this.setupMiddlewares();
    this.setupRouting();
  }

  private setupRouting(): void {
    this.instance.use('/', Server.router);
  }

  private setupMiddlewares() {
    MIDDLEWARES.map(middleware => Server.router.use(middleware));
  }
}

export const server = new Server().instance;