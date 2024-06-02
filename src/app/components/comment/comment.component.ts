import {Component, Input} from '@angular/core';
import {CommentDTO} from "../../openapi";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  @Input() comment!: CommentDTO;
  @Input() currentUserId!: string;
  @Input() replies!: CommentDTO[]

  createdAt: string = '';
  canReply: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;

  ngOnInit(): void {
    const fiveMinutes = 300000;
    if (this.comment.createdAt) {
      const timePassed =
        new Date().getMilliseconds() -
        new Date(this.comment.createdAt).getMilliseconds() >
        fiveMinutes;
      this.canReply = Boolean(this.currentUserId);
      this.canEdit = this.currentUserId === this.comment.userId && !timePassed;
      this.canDelete =
        this.currentUserId === this.comment.userId &&
        this.replies.length === 0 &&
        !timePassed;
    }
  }
}
