import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DefaultService, AuthorDTO } from "../../openapi";
import {Observable, of} from "rxjs";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Location} from "@angular/common";

@Component({
  selector: 'app-all-authors',
  templateUrl: './all-authors.component.html',
  styleUrls: ['./all-authors.component.css']
})
export class AllAuthorsComponent implements OnInit {
  authors: AuthorDTO[] = [];
  private authorPictures: Map<number, Blob> = new Map();


  constructor(private api: DefaultService,
              private router: Router,
              private sanitizer: DomSanitizer,
              private location: Location) { }

  ngOnInit(): void {
    this.fetchAllAuthors();
  }

  private fetchAllAuthors(): void {
    this.api.getAllAuthors().subscribe({
      next: (authors: AuthorDTO[]) => {
        this.authors = authors;
        this.fetchAuthorPictures(authors);
      },
      error: error => {
        console.error('Could not fetch authors:', error);
      }
    });
  }

  private fetchAuthorPictures(authors: AuthorDTO[]): void {
    authors.forEach(author => {
      if (author.authorId) {
        this.api.getAuthorPicture(author.pictureName!).subscribe({
          next: (picture) => {
            this.authorPictures.set(author.authorId!, picture);
          },
          error: error => {
            console.error('Error during fetching author picture:', error);
          }
        });
      } else {
        console.error('Author id is undefined');
      }
    });
  }

  getAuthorPictureUrl(authorId: number): Observable<SafeUrl | undefined> {
    const picture = this.authorPictures.get(authorId);
    if (picture) {
      const objectUrl = URL.createObjectURL(picture);
      return of(this.sanitizer.bypassSecurityTrustUrl(objectUrl));
    }
    return of(undefined);
  }
  navigateToAuthorDetails(authorId: number): void {
    this.router.navigate(['/author-details', authorId]);
  }

  navigateToAddAuthor(): void {
    this.router.navigate(['/add-author-form']);
  }

  goBack(): void {
    this.location.back();
  }
}
