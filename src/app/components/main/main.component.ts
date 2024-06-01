import {Component, OnInit, Injectable} from '@angular/core';
import {DefaultService, BookDTO, AuthorDTO} from "../../openapi";
import {Router} from "@angular/router";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Observable, of} from "rxjs";

@Injectable()
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  books: BookDTO[] = [];
  topRatedBooks: BookDTO[] = [];
  authors: AuthorDTO[] = [];
  bookCovers: Map<string, Blob> = new Map();
  authorPhotos: Map<string, Blob> = new Map();

  constructor(private api: DefaultService, private router: Router, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.fetchBooks();
    this.fetchTopRatedBooks();
    this.fetchAuthors();
  }

  private fetchBooks(): void {
    this.api.getNewlyAddedBooks(5).subscribe({
      next: (books) => {
        this.books = books;
        console.log('Books fetched:', this.books);
        this.books.forEach(book => {
          this.fetchBooksCover(book.coverName, book.isbn);
        });
      },
      error: error => {
        console.error('Error during fetching books:', error);
      }
    });
  }

  private fetchAuthors(): void {
    this.api.getNewlyAddedAuthors(5).subscribe({
      next: (authors) => {
        this.authors = authors;
        console.log('Authors fetched:', this.authors);
        this.authors.forEach(author => {
          this.fetchAuthorPictures(author.pictureName, author.authorId);
        });
      },
      error: error => {
        console.error('Error during fetching authors:', error);
      }
    });
  }

  private fetchTopRatedBooks(): void {
    this.api.getSpecifiedAmountOfBestRatedBooks(5).subscribe({
      next: (books) => {
        this.topRatedBooks = books;
        console.log('Top rated books fetched:', this.topRatedBooks);
        this.topRatedBooks.forEach(book => {
          this.fetchBooksCover(book.coverName, book.isbn);
        });
      },
      error: error => {
        console.error('Error during fetching books:', error);
      }
    });
  }


  private fetchAuthorPictures(pictureName?: string, id?: number): void {
    if (pictureName && id) {
      this.api.getAuthorPicture(pictureName).subscribe({
        next: (picture) => {
          this.authorPhotos.set(id.toString(), picture);
        },
        error: error => {
          console.error('Error during fetching author picture:', error);
        }
      });
    } else {
      console.error('Picture name or author id is undefined');
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

  getAuthorPictureUrl(id: number | undefined): Observable<SafeUrl | undefined> {
    if (id) {
      const idStr = id.toString();
      const picture = this.authorPhotos.get(idStr);
      if (picture) {
        const objectUrl = URL.createObjectURL(picture);
        console.log('Author picture url:', objectUrl)
        return of(this.sanitizer.bypassSecurityTrustUrl(objectUrl));
      }
    }
    return of(undefined);
  }

  navigateToBookDetails(isbn: string | undefined): void {
    if (isbn) {
      this.router.navigate(['/book-details', isbn]).then(r => console.log('Navigation result:', r));
    }
  }

  navigateToAuthorDetails(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/author-details', id]).then(r => console.log('Navigation result:', r));
    }
  }
}

