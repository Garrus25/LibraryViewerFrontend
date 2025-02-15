import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthorDTO, DefaultService} from "../../openapi";
import {Location} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-add-author-form',
  templateUrl: './add-author-form.component.html',
  styleUrls: ['./add-author-form.component.css']
})
export class AddAuthorFormComponent implements OnInit {
  form!: FormGroup;
  selectedImage: string | ArrayBuffer | null = null;

  constructor(private formBuilder: FormBuilder,
              private api: DefaultService,
              private location: Location,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(64)]],
      lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(64)]],
      description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(6000)]],
      authorPictureName: [''],
      image: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.valid && this.selectedImage) {
      let author: AuthorDTO = {
        name: this.form.get('firstName')?.value,
        surname: this.form.get('lastName')?.value,
        description: this.form.get('description')?.value,
        pictureName: this.form.value.authorPictureName ,
        createdBy: sessionStorage.getItem('id') || '',
        additionDate: new Date().toISOString().split('T')[0],
      }

      this.api.addAuthor(author).subscribe({
        next: () => {
          console.log('Author added successfully');
        },
        error: error => {
          console.error('Could not add author:', error);
        }
      });

      this.api.uploadAuthorPicture(this.form.value.image).subscribe({
        next: () => {
          console.log('Author image added successfully');
          this.snackBar.open('Autor został dodany', '', {
            duration: 3000,
          });
        },
        error: error => {
          console.error('Could not add author:', error);
        }
      });

    }
    this.selectedImage = null;
    this.form.reset();
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      if (!file.name.endsWith('.jpg')) {
        const imageControl = this.form.get('image');
        if (imageControl) {
          imageControl.setErrors({invalidSize: true});
        }
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          if (img.width !== 351 || img.height !== 500) {
            const imageControl = this.form.get('image');
            if (imageControl) {
              imageControl.setErrors({invalidSize: true});
            }
            this.selectedImage = null;
          }
        };
      };
      reader.readAsDataURL(file);

      this.form.patchValue({
        image: file,
      });

      this.form.patchValue({
        authorPictureName: file.name
      });
      console.log('Cover name:', file.name);
    }
  }

  goBack(): void {
    this.location.back();
  }
}
