import {ErrorHandler, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";

import {StoriesPage} from "../pages/stories/stories";
import {BrowsePage} from "../pages/browse/browse";
import {PatientProfilePage} from "../pages/patientprofile/patientprofile";
import {TabsPage} from "../pages/tabs/tabs";

import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StanizerService} from "../services/stanizer.service";
import {StoryDetailsPage} from "../pages/storydetails/storydetails";
import {PrismaService} from "../services/back-end/prisma-api.service";
import {UserService} from "../services/back-end/user.service";
import {HttpModule} from "@angular/http";
import {StoryService} from "../services/back-end/story.service";

@NgModule({
  declarations: [
    MyApp,
    StoriesPage,
    BrowsePage,
    PatientProfilePage,
    StoryDetailsPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StoriesPage,
    BrowsePage,
    PatientProfilePage,
    StoryDetailsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    StanizerService,
    PrismaService,
    StoryService,
    UserService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
