import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {DefaultService, RateIdentityDTO} from "../../openapi";
import RateTypeEnum = RateIdentityDTO.RateTypeEnum;

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.css']
})
export class RateComponent {
  @Input() ratedObjectId?: string;
  @Input() rateType?: RateTypeEnum;
  selectedRate: number = 0;
  averageRate: number = 0;
  protected readonly RateTypeEnum = RateTypeEnum;

  constructor(private api: DefaultService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getUserRate();
    this.getAverageRate()
  }

  getUserRate() {
    const userId = sessionStorage.getItem("id");
    if (this.ratedObjectId && userId) {
      this.api.getRateById({rateType: this.rateType, userId: sessionStorage.getItem("id") || "",
        ratedObjectId: this.ratedObjectId}).subscribe({
        next: (rate) => {
          this.selectedRate = rate.rateValue || 0;
          console.log("Rate fetched: ", this.selectedRate);
        },
        error: error => {
          console.error('Could not fetch the user rating', error);
        }
      });
    }
  }

  rateObject(stars: number) {
    this.selectedRate = stars;
    console.log(this.selectedRate)
    this.api.addRate({ratedObjectId: this.ratedObjectId, rateType: this.rateType, rateValue: stars, userId: sessionStorage.getItem("id") || ""}).subscribe({
      next: () => {
        console.log('Object rating updated successfully');
        window.location.reload();
      },
      error: () => {
        console.error('Could not update the object rating' + 'Object ID : ' + this.ratedObjectId + 'RateType: ' + this.rateType + 'Stars: ' + stars + 'UserID: '+ sessionStorage.getItem("id") || "");
      }
    });
  }

  getAverageRate(): void {
    console.log('rateType:', this.rateType);
    console.log('ratedObjectId:', this.ratedObjectId);

    if (this.rateType && this.ratedObjectId) {
      this.api.getAverageRateForObject(this.ratedObjectId, this.rateType).subscribe({
        next: (rate) => {
          this.averageRate = rate
          console.log("Average rate fetched: ", rate);
          this.cdr.detectChanges();
        },
        error: error => {
          console.error('Could not fetch the average rating', error);
        }
      });
    } else {
      console.error('rateType or ratedObjectId is not defined');
    }
  }
}
