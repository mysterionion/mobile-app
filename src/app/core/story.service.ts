
import {Inject, Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {UserStory} from "../../dto/user-story";
import {background, getMessageFromBackendError, getThumbnails, getUrlImage, youtubeId} from "../utils";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Environment, EnvironmentToken} from "../environment";
import { Camera } from "@ionic-native/camera";
import { FilePath } from "@ionic-native/file-path";
import {File} from "@ionic-native/file";
import { ToastController } from "ionic-angular";

interface storyResponse {
  response:UserStory
}

interface storiesResponse {
  response:UserStory[]
}

declare var cordova: any;

@Injectable()
export class StoryService {
  constructor(@Inject(EnvironmentToken) private env: Environment,
              private http: HttpClient,
              private camera: Camera,
              private filePath: FilePath,
              private file: File,
              private toastCtrl: ToastController) {
    this.handleError = this.handleError.bind(this);
  }

  getUserStory(patientId: string, storyId: string): Observable<UserStory | Error> {

    return this.http.get(`${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${this.env.api.getStory}/${storyId}`)
      .map(({response}:storyResponse) => new UserStory(response))
      .catch(err => this.handleError(err));
  }

  getUserStories(): Observable<UserStory[]| Error >  {
    return this.http.get("assets/json/stories.json")
      .map(({response}:storiesResponse) => response.map(story => new UserStory(story)))
      .catch(error => this.handleError(error));
  }

  addStory(patientId: number, newStory: UserStory): Observable<UserStory| Error >  {

    return this.http.post(`${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${this.env.api.getStory}`,newStory)
      .map(({response}:storyResponse) =>  new UserStory(response))
      .catch(err => this.handleError(err));
  }

  deleteStory(patientId: number, storyId: number): Observable<Object| Error >  {
    return this.http.delete(`${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${this.env.api.getStory}/${storyId}`)
      .catch(err => this.handleError(err));
  }

  updateStory(patientId: number, newStory: UserStory): Observable<UserStory| Error >  {
    return this.http.patch(`${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${this.env.api.getStory}/${newStory.id}`, newStory)
      .map(({response}:storyResponse) => new UserStory(response))
      .catch(err => this.handleError(err));
  }

  getImage(filename: string): Observable<string| Error >  {
    return getUrlImage.call(this, filename)
  }

  getYoutubeId(url:string):string {
    return youtubeId(url)
  }

  getThumb(url):string{
    return getThumbnails(url);
  }

  getBackground(story: UserStory){
    return background.call(this,story)
  }

  addYoutubeLinkAsset(patient_id: string, storyId: string, asset: string):Observable<Object|Error> {

    return this.http.post(`${this.env.apiUrl}/${this.env.api.getPatient}/${patient_id}/${this.env.api.getStory}/${storyId}/${this.env.api.getAsset}`, {
      "asset": asset,
      "assetType": "youtube"
    })
      .catch(err => this.handleError(err));
  }

  takeAPicture(): Observable<string> {
    return this.getPicture(this.camera.PictureSourceType.CAMERA);
  }

  chooseAFile(): Observable<string> {
    return this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  }

  getPicture(sourceType):Observable<string> {
    const options = {
      quality: 90,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 1000,
      targetHeight: 1000,
      correctOrientation: true
    };

    return Observable.fromPromise(this.camera.getPicture(options))
      .map((imagePath) => {
        if(sourceType === this.camera.PictureSourceType.PHOTOLIBRARY){
          return Observable.fromPromise(this.filePath.resolveNativePath(imagePath))
            .map((filePath)=>{
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
              return this.copyFileToLocalDir(correctPath, currentName)
            }).switchMap(x=>x)
        } else {
          let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          return this.copyFileToLocalDir(correctPath, currentName)
        }
      }).switchMap(x => x)
  }

  copyFileToLocalDir(correctPath,currentName):Observable<string>{
    return Observable.fromPromise(this.file.copyFile(correctPath, currentName, cordova.file.dataDirectory, `${new Date().getTime()}.jpg`))
      .map(file => file.name)
  }

  handleError(err: HttpErrorResponse): Observable<Error> {
    return Observable.of(new Error(
      `${getMessageFromBackendError(err.error && err.error.meta && err.error.meta.message)}
      `));
  }
}
