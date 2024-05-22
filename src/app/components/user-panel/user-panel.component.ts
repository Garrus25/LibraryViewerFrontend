import { Component } from '@angular/core';
import {BookDTO, DefaultService, UserDTO} from "../../openapi";
import {Router} from "@angular/router";
import {Observable, of} from "rxjs";
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

  constructor(private api: DefaultService,
              private router: Router,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.fetchUserData();
    this.fetchBooks();
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

  navigateToBookDetails(isbn: string | undefined): void {
    if (isbn) {
      this.router.navigate(['/book-details', isbn]).then(r => console.log('Navigation result:', r));
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

}
