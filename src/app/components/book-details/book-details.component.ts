import {Component, Injectable} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BookDTO, DefaultService, RateIdentityDTO} from "../../openapi";
import {Observable, of, tap} from "rxjs";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import { Location } from '@angular/common';
import RateTypeEnum = RateIdentityDTO.RateTypeEnum;


@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})

@Injectable()
export class BookDetailsComponent {
  isbn?: string | null;
  bookDto: BookDTO | null = null;
  bookCover?: Blob;
  isDescriptionExpanded = false;
  shortDescriptionLimit = 100;

  isDescriptionLongerThanLimit(): boolean {
    return !!(this.bookDto?.description && this.bookDto.description.length > this.shortDescriptionLimit);  }


  constructor(private route: ActivatedRoute,
              private api: DefaultService,
              private sanitizer: DomSanitizer,
              private location: Location) { }

  ngOnInit() {
    this.isbn = this.route.snapshot.paramMap.get('isbn');
    this.loadBookDetails(this.isbn)

    this.route.params.subscribe(params => {
      const bookId = params['isbn'];
      this.loadBookDetails(bookId);
    });
  }

  loadBookDetails(isbn: string | null): void {
    if (this.isbn) {
      if (isbn != null) {
        this.fetchBookByIsbn(isbn).pipe(
          tap(() => {
            console.log("Attempt to fetch book cover with name: ", this.bookDto?.coverName);
            this.fetchBooksCover(this.bookDto?.coverName);
          })
        ).subscribe();
      }
    } else {
      console.error('No isbn provided');
    }
  }

  getDisplayedDescriptionPercentage(): number {
    if (this.bookDto?.description) {
      const displayedLength = this.isDescriptionExpanded ? this.bookDto.description.length : this.shortDescriptionLimit;
      return (displayedLength / this.bookDto.description.length) * 100;
    }
    return 100;
  }

  private fetchBookByIsbn(isbn: string): Observable<BookDTO> {
    return this.api.getBookById(isbn).pipe(
      tap((book) => {
        console.log('Book fetched:', book);
        this.bookDto = book;
      })
    );
  }

  private fetchBooksCover(coverName?: string): void {
    if (coverName) {
      this.api.getBookCover(coverName).subscribe({
        next: (cover) => {
          this.bookCover = cover;
        },
        error: error => {
          console.error('Error during fetching cover:', error);
        }
      });
    } else {
      console.error('Cover name or book id is undefined');
    }
  }

  getCoverUrl(): Observable<SafeUrl | undefined> {
    if (this.bookCover) {
      const objectUrl = URL.createObjectURL(this.bookCover);
      return of(this.sanitizer.bypassSecurityTrustUrl(objectUrl));
    }
    return of(undefined);
  }

  goBack(): void {
    this.location.back();
  }

  protected readonly RateTypeEnum = RateTypeEnum;
}
