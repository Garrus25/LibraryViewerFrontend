import { Component } from '@angular/core';
import {AuthorDTO, BookDTO, DefaultService, ReviewDTO, UserDTO} from "../../openapi";
import {Router} from "@angular/router";
import {catchError, map, Observable, of} from "rxjs";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material/snack-bar";

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
  reviews: ReviewDTO[] = [];

  private bookTitles: Map<string, string> = new Map();

  constructor(private api: DefaultService,
              private router: Router,
              private sanitizer: DomSanitizer,
              private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.fetchUserData();
    this.fetchBooks();
    this.fetchAuthors();
    this.fetchReviews();
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

   deleteBook(bookId: string): void {
    this.api.deleteBookById(bookId).subscribe({
      next: () => {
        console.log('Book deleted successfully');
        this.booksDto = this.booksDto.filter(book => book.isbn !== bookId);
        this.snackBar.open('Książka została usunięta', '', {
          duration: 3000,
        });
      },
      error: error => {
        console.error('Error during deleting book:', error);
      }
    });
  }

  deleteAuthor(authorId: number): void {
    this.api.deleteAuthorById(authorId).subscribe({
      next: () => {
        console.log('Author deleted successfully');
        this.authors = this.authors.filter(author => author.authorId !== authorId);
        this.snackBar.open('Autor został usunięty', '', {
          duration: 3000,
        });
      },
      error: error => {
        console.error('Error during deleting author:', error);
      }
    });
  }

  private fetchReviews(): void {
    const id = sessionStorage.getItem("id");
    if (id !== null) {
      this.api.getAllReviewsCreatedBySpecificUser(id).subscribe({
        next: (reviews) => {
          this.reviews = reviews;
          console.log('Review data fetched:', this.userDto);
        },
        error: error => {
          console.error('Error during fetching review data:', error);
        }
      });
    } else {
      console.error('User id is undefined');
    }
  }

  getBookNameByBookId(isbn: string): Observable<string> {
    if (this.bookTitles.has(isbn)) {
      return of(this.bookTitles.get(isbn) || '');
    } else {
      return this.api.getBookById(isbn).pipe(
        map(bookDto => {
          const title = bookDto.title || '';
          this.bookTitles.set(isbn, title);
          return title;
        }),
        catchError(error => {
          console.error('Error during fetching books:', error);
          return of('');
        })
      );
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
