import {Injectable} from "@angular/core";
import {Mixpanel} from '@ionic-native/mixpanel';


declare var cordova: any;

@Injectable()
export class Analytics {
  isInit = false;
  private token = '7cfdbb200c3ee86ff8b5c1deda4b7b24';

  constructor(private mixpanel: Mixpanel) {
    this.init();
  }

  init() {
    return this.initMixpanel()
      .then((success) => {
        this.isInit = true;
      })

  }

  initMixpanel(): Promise<any> {
    return this.mixpanel.init(this.token)
      .catch((err) => {
        console.log('Error mixpanel.init', err);
        this.isInit = false;
      });
  }

  track(eventName, props?: any) {
    if (this.isInit) {
      this.mixpanel.track(eventName, props);
      return;
    }

    this.init().then(() => {
      this.mixpanel.track(eventName, props);
    });
  }
}
