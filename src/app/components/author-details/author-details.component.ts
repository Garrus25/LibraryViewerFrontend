import {Component, Injectable} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthorDTO, DefaultService, RateIdentityDTO} from "../../openapi";
import {Observable, of, tap} from "rxjs";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import RateTypeEnum = RateIdentityDTO.RateTypeEnum;


@Component({
  selector: 'app-author-details',
  templateUrl: './author-details.component.html',
  styleUrl: './author-details.component.css'
})

@Injectable()
export class AuthorDetailsComponent {
  id?: number | null;
  authorDTO?: AuthorDTO | null = null;
  authorPicture?: Blob;
  isDescriptionExpanded = false;
  shortDescriptionLimit = 100;
  protected readonly RateTypeEnum = RateTypeEnum;

  isDescriptionLongerThanLimit(): boolean {
    return !!(this.authorDTO?.description && this.authorDTO.description.length > this.shortDescriptionLimit);
  }

  constructor(private route: ActivatedRoute, private api: DefaultService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.id = parseInt(this.route.snapshot.paramMap.get('id') ?? '', 10);
    this.loadBookDetails(this.id)

    this.route.params.subscribe(params => {
      const bookId = params['isbn'];
      this.loadBookDetails(bookId);
    });
  }

  loadBookDetails(id: number | null): void {
    if (this.id) {
      if (id != null) {
        this.fetchAuthorById(id).pipe(
          tap(() => {
            console.log("Attempt to fetch author picture with name: ", this.authorDTO?.pictureName);
            this.fetchAuthorPicture(this.authorDTO?.pictureName);
          })
        ).subscribe();
      }
    } else {
      console.error('No id provided');
    }
  }

  getDisplayedDescriptionPercentage(): number {
    if (this.authorDTO?.description) {
      const displayedLength = this.isDescriptionExpanded ? this.authorDTO.description.length : this.shortDescriptionLimit;
      return (displayedLength / this.authorDTO.description.length) * 100;
    }
    return 100;
  }

  private fetchAuthorById(id: number): Observable<AuthorDTO> {
    return this.api.getAuthorBYId(id).pipe(
      tap((authorDto) => {
        console.log('Author data fetched fetched:', authorDto);
        this.authorDTO = authorDto;
      })
    );
  }

  private fetchAuthorPicture(coverName?: string): void {
    if (coverName) {
      this.api.getAuthorPicture(coverName).subscribe({
        next: (cover) => {
          this.authorPicture = cover;
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
    if (this.authorPicture) {
      const objectUrl = URL.createObjectURL(this.authorPicture);
      return of(this.sanitizer.bypassSecurityTrustUrl(objectUrl));
    }
    return of(undefined);
  }

}
