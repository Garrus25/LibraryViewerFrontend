import {Component, Input, OnInit} from '@angular/core';
import {CommentDTO, DefaultService} from "../../openapi";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit {
  @Input() currentUserId: string | undefined;

  public comments: CommentDTO[] = [];

  constructor(private api: DefaultService) {
  }

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

  addComment({
               text,
               parentId,
             }: {
    text: string;
    parentId: string | null;
  }): void {
    let comment: CommentDTO = {
      userId: sessionStorage.getItem('id') || '',
      createdAt: new Date().toISOString(),
      body: text,
      username: sessionStorage.getItem('username') || '',
    };

    console.log(comment)

    this.api.addComment(comment).subscribe({
      next: () => {
        console.log('Comment added successfully');
      },
      error: error => {
        console.error('Could not save comment:', error);
      }
    });
  }
}

