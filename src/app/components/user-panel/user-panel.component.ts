import { Component } from '@angular/core';
import {AuthorDTO, BookDTO, DefaultService, UserDTO} from "../../openapi";
import {Router} from "@angular/router";
import {catchError, map, Observable, of} from "rxjs";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.css'
})
export class UserPanelComponent {
  userDto: UserDTO | undefined = undefined;
  booksDto: BookDTO[] = [];
  bookCovers: Map<string, Blob> = new Map();
  authorPhotos: Map<string, Blob> = new Map();
  authors: AuthorDTO[] = [];

  constructor(private api: DefaultService,
              private router: Router,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.fetchUserData();
    this.fetchBooks();
    this.fetchAuthors();
  }

  private fetchUserData(): void {
    const id = sessionStorage.getItem("id");
    if (id !== null) {
      this.api.getUserById(id).subscribe({
        next: (user) => {
          this.userDto = user;
          console.log('User data fetched:', this.userDto);
        },
        error: error => {
          console.error('Error during fetching user data:', error);
        }
      });
    } else {
      console.error('User id is undefined');
    }
  }

  private fetchBooks(): void {
    const id = sessionStorage.getItem("id");
    if (id !== null) {
      this.api.getAllBooksCreatedBySpecificUser(id).subscribe({
        next: (books) => {
          this.booksDto = books;
          console.log('Books fetched:', this.booksDto);
          this.booksDto.forEach(book => {
            console.log("cover" + book.coverName, "id" + book.isbn);
            this.fetchBooksCover(book.coverName, book.isbn);
          });
        },
        error: error => {
          console.error('Error during fetching books:', error);
        }
      });
    }
  }

  private fetchBooksCover(coverName?: string, isbn?: string): void {
    if (coverName && isbn) {
      this.api.getBookCover(coverName).subscribe({
        next: (cover) => {
          this.bookCovers.set(isbn, cover);
        },
        error: error => {
          console.error('Error during fetching cover:', error);
        }
      });
    } else {
      console.error('Cover name or book id is undefined');
    }
  }

  private fetchAuthors(): void {
    // @ts-ignore
    this.api.getAllAuthorsCreatedBySpecificUser(sessionStorage.getItem('id')).subscribe({
      next: (authors) => {
        this.authors = authors;
        console.log('Authors fetched:', this.authors);
        this.authors.forEach(author => {
          if (author.pictureName != null) {
            this.fetchAuthorPictures(author.pictureName).subscribe(pictureUrl => {
              if (author.authorId){
                this.authorPhotos.set(author.authorId.toString(), <Blob>pictureUrl);
              }
            });
          }
        });
      },
      error: error => {
        console.error('Error during fetching authors:', error);
      }
    });
  }

  fetchAuthorPictures(pictureName: string | undefined): Observable<SafeUrl | undefined> {
    if (pictureName) {
      return this.api.getAuthorPicture(pictureName).pipe(
        map(picture => {
          if (picture) {
            const objectUrl = URL.createObjectURL(picture);
            return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
          }
          return undefined;
        }),
        catchError(error => {
          console.error('Error during fetching author picture:', error);
          return of(undefined);
        })
      );
    } else {
      return of(undefined);
    }
  }

  navigateToBookDetails(isbn: string | undefined): void {
    if (isbn) {
      this.router.navigate(['/book-details', isbn]).then(r => console.log('Navigation result:', r));
    }
  }

  navigateToAuthorDetails(authorId: number | undefined): void {
    if (authorId) {
      this.router.navigate(['/author-details', authorId]).then(r => console.log('Navigation result:', r));
    }
  }

  getBookCoverUrl(isbn: string | undefined): Observable<SafeUrl | undefined> {
    if (isbn) {
      const cover = this.bookCovers.get(isbn);
      if (cover) {
        const objectUrl = URL.createObjectURL(cover);
        console.log('Book cover url:', objectUrl)
        return of(this.sanitizer.bypassSecurityTrustUrl(objectUrl));
      }
    }
    return of(undefined);
  }

  getAuthorPictureUrl(authorId: string | undefined): Observable<SafeUrl | undefined> {
    if (authorId) {
      return of(this.authorPhotos.get(authorId));
    }
    return of(undefined);
  }
}
