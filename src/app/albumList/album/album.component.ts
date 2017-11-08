import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {AlbumService} from "../../core/album.service";
import {UserStory} from "../../../dto/user-story";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/last";
import {StoryListPage} from "../../storyList/storyList.component";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'prisma-album',
  template:
      `
    <div *ngIf="imageLoaded"
         class="album-thumb"
         (click)="showDetails()">
      <img class="album-thumb" [src]="backgroundImage">
      <div class="tile-overlay-gradient"></div>
      <h3 class="hist-title">{{album.title || '?'}}</h3>
    </div>
    <div *ngIf="!imageLoaded" class="album-thumb">
      <ion-spinner item-start name="dots" color="white"></ion-spinner>
    </div>
  `
})

export class AlbumComponent implements OnInit, OnDestroy {

  colorCodes: string[] = ["#FAD820", "#FF9F00", "#F35A4B", "#D95DB4", "#637DC8"];
  destroy$: Subject<boolean> = new Subject<boolean>();
  backgroundImage: SafeStyle;
  backgroundColor: string;
  imageLoaded: boolean = false;
  isAVideo: boolean = false;
  @Input()
  album;


  constructor(private albumService: AlbumService,
              private sanitizer: DomSanitizer,
              private navCtrl: NavController) {
  }


  ngOnInit(): void {
    this.setBackgroundImage(this.album.stories);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  setBackgroundImage(stories: UserStory[]) {
    if (stories.length !== 0) {
      const story = stories[stories.length-1];
      this.albumService.getBackground(story)
        .takeUntil(this.destroy$)
        .subscribe(imageUrl => {
          this.backgroundImage = this.sanitizer
            .bypassSecurityTrustUrl(imageUrl);
          this.imageLoaded = true;
        });
      this.isAVideo=story.type==='youtube';
    } else {
      this.backgroundColor = this.colorCodes[Math.floor(Math.random() * this.colorCodes.length)]
      this.imageLoaded = true;
    }
  }

  showDetails() {
    this.navCtrl.push(StoryListPage, {
      "album": this.album,
    });
  }
}
