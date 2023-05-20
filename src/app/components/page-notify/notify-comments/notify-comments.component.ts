import { Router } from '@angular/router';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { ACTIONS, CONSTANTS, MENUACTIONROLEAPI } from 'src/app/common/constants/constant';
import { Subject, takeUntil } from 'rxjs';
import queryString from 'query-string';
@Component({
  selector: 'app-notify-comments',
  templateUrl: './notify-comments.component.html',
  styleUrls: ['./notify-comments.component.css'],
})
export class NotifyCommentsComponent implements OnInit, OnChanges{
  @Input() notify: any;
  @Output() saveComment = new EventEmitter<any>();
  comment = '';
  comments: any = [];
  countRecord: any = {
    totalRecord: 0,
    currentRecordStart: 0,
    currentRecordEnd: 0
  };
  MENUACTIONROLEAPI = MENUACTIONROLEAPI;
  ACTIONS = ACTIONS

  query = {
    notiId: 0,
    offSet: 0,
    pageSize: 15
  }
  pagingComponent = {
    total: 0
  }
  // @ViewChild(BasePagingComponent, { static: false }) pagingComponent: BasePagingComponent;
  constructor(
              private router: Router,
              private messageService: MessageService,
              private apiService: ApiHrmService) {
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.notify && this.notify && this.notify.notiId) {
      this.query.notiId = this.notify ? this.notify.notiId : 0;
      this.getNotificationCommentList();
    }
  }


  getNotificationCommentList() {
    let params = {...this.query}
    console.log('params', params)
    const queryParams = queryString.stringify(params);
    this.apiService.getNotifyCommentList(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((res: any) => {
      this.comments = res.data;
      this.comments.forEach(comment => {
        if (comment.childCommentCount > 0) {
          let params2 = {commentId: comment.commentId,offSet: 0, pageSize: 1000}
          const queryParams2 = queryString.stringify(params2);
          this.apiService.getNotifyCommentChilds(queryParams2).subscribe((result: any) => {
            comment.childComments = result.data;
          });
        }
      });
      this.pagingComponent.total = res.recordsTotal;
      this.countRecord.totalRecord = res.recordsTotal;
      this.countRecord.currentRecordStart = this.query.offSet + 1;
      if ((res.recordsTotal - this.query.offSet) > this.query.pageSize) {
        this.countRecord.currentRecordEnd = this.query.offSet + Number(this.query.pageSize);
      } else {
        this.countRecord.currentRecordEnd = res.recordsTotal;
      }
    });
  }

  ngOnInit(): void {
  }

  handleAddComment() {
    if (this.comment === '') {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: CONSTANTS.MESSAGE_ALERT.ADD_COMMENT });
      return;
    }
    this.apiService.setNotifyComment({
      notiId: this.notify.notiId,
      parrentId: null,
      comments: this.comment
    }).subscribe((res: any) => {
      if (res.status === 'success') {
        this.comment = '';
        this.comments.unshift(res.data);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail:res.message });
      }
    });
  }

  toggleAnswer(comment) {
    comment.isAnswer ? comment.isAnswer = !comment.isAnswer : comment.isAnswer = true;
  }

  handleAnswer(data) {
    if (data.answerComment === '') {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail:CONSTANTS.MESSAGE_ALERT.ADD_COMMENT });
      return;
    }
    const commentForSave = {
      notiId: 0,
      parrentId: data.commentId,
      comments: data.answerComment
    };
    data.answerComment = '';
    this.apiService.setNotifyComment(commentForSave)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((res: any) => {
      if (res.status === 'success') {
        if (!data.childComments) {
          data.childComments = [];
        }
        data.childComments.unshift(res.data);
        data.isAnswer = !data.isAnswer;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: res.message });
      }
    });
  }

  changePageSize() {
    this.getNotificationCommentList();
  }

  first = 0
  paginate(event) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows;
    this.getNotificationCommentList();
  }

  showSubComment(comment) {
    comment.showSubComment ? comment.showSubComment = !comment.showSubComment : comment.showSubComment = true;
  }

  handleAuthComment(comment, status) {
    this.apiService.setNotifyCommentAuth({
      commentId: comment.commentId,
      status
    })
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((res: any) => {
      if (res.status === 'success') {
        if (status) {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: CONSTANTS.MESSAGE_ALERT.APPROVED_SUCCESSFUL });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: CONSTANTS.MESSAGE_ALERT.CANCEL_APRROCE_SUCCESSFUL });
        }
        comment.auth_St = status;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: res.message });
      }
    });
  }
}
