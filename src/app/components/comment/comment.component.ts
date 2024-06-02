import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommentDTO} from "../../openapi";
import {ActiveCommentInterface} from "../../interfaces/activeComment.interface";
import {ActiveCommentTypeEnum} from "../../interfaces/activeCommentType.enum";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  @Input() comment!: CommentDTO;
  @Input() currentUserId!: string;
  @Input() replies!: CommentDTO[]
  @Output()
  setActiveComment = new EventEmitter<ActiveCommentInterface | null>();
  activeCommentType = ActiveCommentTypeEnum;

  createdAt: string = '';
  canReply: boolean = false;
  canEdit: boolean = true;
  canDelete: boolean = false;

  ngOnInit(): void {
    if (this.comment.createdAt) {
      this.canReply = Boolean(this.currentUserId);
      this.canDelete =
        this.currentUserId === this.comment.userId &&
        this.replies.length === 0;
    }
  }
}
