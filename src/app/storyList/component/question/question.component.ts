import {Component, Input, OnInit} from '@angular/core';
import {QuestionService} from '../../../core/question.service';

@Component({
  selector: 'prisma-question',
  template: `
    <div *ngIf="hasTopics()">
      <div class="clear">
      <div class="topic-wrapper" *ngIf="hasTopics()">
        <div class="topic-container" *ngIf="currentQuestion">
          <span class="topic-sub">Onderwerp</span>
          <span class="topic-title">{{currentQuestion}}</span>
          <span (click)="nextQuestion()" class="topic-other">
            <ion-icon name="refresh"></ion-icon>
            &nbsp;Ander onderwerp
          </span>
        </div>
      </div>
      </div>
    </div>
  `
})
export class QuestionComponent implements OnInit {
  questions: string[] = [];
  currentQuestion = '';

  @Input() query: string;

  hasTopics(): boolean {
    return this.questions.length > 0;
  }

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.questions = this.questionService.getQuestions(this.query);
    this.nextQuestion();
  }

  nextQuestion() {
    this.currentQuestion = this.questions[
      Math.floor(Math.random() * this.questions.length)
    ];
  }
}
