import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommentDTO} from "../../openapi";
import {ActiveCommentInterface} from "../../interfaces/activeComment.interface";
import {ActiveCommentTypeEnum} from "../../interfaces/activeCommentType.enum";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit{
  @Input() comment!: CommentDTO;
  @Input() currentUserId!: string;
  @Input() replies!: CommentDTO[]
  @Output()
  setActiveComment = new EventEmitter<ActiveCommentInterface | null>();
  activeCommentType = ActiveCommentTypeEnum;
  @Output()
  addComment = new EventEmitter<{ text: string; parentId: number | null }>();
  @Input() parentId!: number | null;
  replyId: number | null = null;

  createdAt: string = '';
  canReply: boolean = false;
  canDelete: boolean = false;
  activeComment: ActiveCommentInterface | null = null;

  ngOnInit(): void {
    if (this.comment.createdAt) {
      this.canReply = Boolean(this.currentUserId);
      this.canDelete =
        this.currentUserId === this.comment.userId &&
        this.replies.length === 0;
    }
    this.replyId = this.parentId ? this.parentId : this.comment.commentId!;
  }

  isReplying(): boolean {
    if (!this.activeComment) {
      console.log('No active comment')
      return false;
    }
    console.log('Active comment:', this.activeComment);
    return (
      this.activeComment.id === this.comment.commentId &&
      this.activeComment.type === this.activeCommentType.replying
    );
  }
}
