import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {env} from "../app/environment";
@Injectable()
export class TranslatorService {
  public translate: TranslateService;
  public lang: string = 'nl';

  public constructor(private translateIn: TranslateService) {
    translateIn.addLangs(['en', 'fr', 'nl']);
    translateIn.setDefaultLang(this.lang);
    translateIn.use(this.translateIn.getBrowserLang());
    this.translate = translateIn;
    this.refresh();
  }

  /*
   Allows the translator to refresh the local language
   */
  public refresh() {
    if (localStorage.getItem(env.localstorage.LOCALSTORAGE_SELECTEDLANG)) {
      this.lang = '' + localStorage.getItem(env.localstorage.LOCALSTORAGE_SELECTEDLANG);
      this.refreshTranslation();
      return;
    }
    this.refreshTranslation();
  }

  private refreshTranslation() {
    this.translate.use(this.lang);
  }

  public switchLang(lang?: string): void {
    this.lang = lang;
    localStorage.setItem(env.localstorage.LOCALSTORAGE_SELECTEDLANG, lang || this.lang);
    this.refreshTranslation();
  }

  /**
   * Return the available language to select
   */
  public notSelectedLang(lang?: string): string {
    if (lang) {
      if (lang == 'fr' || lang == 'en')
        return lang;
    }

    if (this.lang == 'fr')
      return 'en';
    else
      return 'fr';
  }

}
