import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { readFileSync } from 'fs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, Observer } from 'rxjs';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';

export function universalLoader(state: TransferState): TranslateLoader {
  return {
    getTranslation: (lang: string) => {
      return Observable.create((observer: Observer<any>) => {
        const jsonData = JSON.parse(readFileSync(`./dist/browser/assets/i18n/${lang}.json`, 'utf8'));
        const key: StateKey<number> = makeStateKey<number>('transfer-translate-' + lang);
        state.set(key, jsonData);
        observer.next(jsonData);
        observer.complete();
      });
    }
  } as TranslateLoader;
}

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: universalLoader,
        deps: [TransferState]
      }
    })
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule { }
