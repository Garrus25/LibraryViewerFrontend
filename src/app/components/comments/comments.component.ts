import {Component, Input} from '@angular/core';
import {CommentDTO, DefaultService} from "../../openapi";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {
  @Input() currentUserId: string | undefined;

  public comments: CommentDTO[] = [];

  constructor(private api: DefaultService) { }

  ngOnInit(): void {
    this.fetchCommentData();
  }

  private fetchCommentData(): void {
    this.api.getAllComments().subscribe({
      next: (comments) => {
        console.info("Comments fetched successfully")
        this.comments = comments;
        console.log(comments)
      },
      error: error => {
        console.error('Error during fetching all comments:', error);
      }
    });
  }

  getReplies(commentId: number): CommentDTO[] {
    return this.comments
      .filter((comment) => comment.parentId === commentId)
      .sort(
        (a, b) => {
          let dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          let dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        }
      );
  }
}
