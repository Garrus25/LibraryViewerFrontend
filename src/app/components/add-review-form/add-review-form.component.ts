import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {Location} from "@angular/common";
import {DefaultService, ReviewDTO} from "../../openapi";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-add-review-form',
  templateUrl: './add-review-form.component.html',
  styleUrls: ['./add-review-form.component.css']
})
export class AddReviewFormComponent implements OnInit {
  reviewForm: FormGroup;
  bookTitle: string | null = null;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private location: Location,
              private api: DefaultService,
              private snackBar: MatSnackBar) {
    this.reviewForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(64)]],
      content: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5000)]]
    });
  }

  ngOnInit(): void {
    this.bookTitle = this.route.snapshot.paramMap.get('isbn');
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      console.log(this.reviewForm.value);
    }
    this.saveReview();
  }

  private saveReview(): void {
    let review: ReviewDTO = {
      title: this.reviewForm.get('title')?.value,
      content: this.reviewForm.get('content')?.value,
      createdBy: sessionStorage.getItem('id') || '',
      bookId: this.route.snapshot.paramMap.get('title')!
    }

    this.api.addReview(review).subscribe({
      next: () => {
        console.log('Author added successfully');
        this.snackBar.open('Recenzja została dodana', '', {
          duration: 3000,
        });
      },
      error: error => {
        console.error('Could not add author:', error);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
