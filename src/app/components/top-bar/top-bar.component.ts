import {Component, Injectable} from '@angular/core';
import {FormControl} from "@angular/forms";
import {map, Observable, of, startWith} from "rxjs";
import {BookDTO, DefaultService} from "../../openapi";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})

@Injectable()
export class TopBarComponent {
  searchControl = new FormControl();
  books: BookDTO[] = [];
  filteredOptions?: Observable<BookDTO[]>;
  bookCovers: Map<string, Blob> = new Map<string, Blob>();

  ngOnInit() {
    this.fetchBooks();

    this.filteredOptions = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filter(value))
      );
  }

  constructor(private api: DefaultService,
              private sanitizer: DomSanitizer) {
  }

  private fetchBooks(): void {
    this.api.getAllBooks().subscribe({
      next: (books) => {
        books.forEach(book => {
          this.books.push(book);
          this.fetchBooksCovers(book.coverName, book.title);
        });
        console.log('Books fetched:', books);
      },
      error: error => {
        console.error('Error during fetching books:', error);
      }
    });
  }

  private fetchBooksCovers(coverName?: string, title?: string): void {
    if (coverName && title) {
      this.api.getBookCover(coverName).subscribe({
        next: (cover) => {
          console.log('Cover fetched for book: ', title);
          this.bookCovers.set(title, cover);
          console.log(this.bookCovers);
        },
        error: error => {
          console.error('Error during fetching cover:', error);
        }
      });
    } else {
      console.error('Cover name or book id is undefined');
    }
  }

  getCoverUrl(title?: string): Observable<SafeUrl | undefined> {
    let coverBlob: Blob | undefined;
    if (title != null) {
      coverBlob = this.bookCovers.get(title);
    }
    if (coverBlob) {
      const objectUrl = URL.createObjectURL(coverBlob);
      return of(this.sanitizer.bypassSecurityTrustUrl(objectUrl));
    }
    return of(undefined);
  }

  private filter(value: string): BookDTO[] {
    const filterValue = value.toLowerCase();

    return this.books
      .filter(book => book.title?.toLowerCase().includes(filterValue));
  }
}
