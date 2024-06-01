import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
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
  bookId: string | null = null;

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
    this.bookTitle = this.route.snapshot.paramMap.get('title');

    let bookId = "";

    const reviewId = this.route.snapshot.paramMap.get('reviewId');
    const isbn = this.route.snapshot.paramMap.get('isbn');

    if (reviewId && !isbn) {
      this.api.getReviewById(Number(reviewId)).subscribe(review => {
        this.reviewForm.patchValue({
          title: review.title,
          content: review.content
        });
        this.bookId = review.bookId!;
        this.api.getBookById(review.bookId!).subscribe(book => {
          this.bookTitle = book.title!;
        });
      });
    } else {
      this.bookTitle = "";
    }
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      this.saveReview();
    }
    this.reviewForm.reset();
  }

  private saveReview(): void {
    let review: ReviewDTO = {
      title: this.reviewForm.get('title')?.value,
      content: this.reviewForm.get('content')?.value,
      createdBy: sessionStorage.getItem('id') || '',
      bookId: this.route.snapshot.paramMap.get('isbn')!,
      reviewId: Number(this.route.snapshot.paramMap.get('reviewId')) || 0
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
