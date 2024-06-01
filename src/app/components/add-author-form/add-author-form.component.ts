import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthorDTO, DefaultService} from "../../openapi";
import {Location} from "@angular/common";

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
              private location: Location) {
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
        pictureName: this.form.value.coverName ,
        createdBy: sessionStorage.getItem('id') || ''
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
      reader.onload = e => {
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
        coverName: file.name
      });
      console.log('Cover name:', file.name);
    }
  }

  goBack(): void {
    this.location.back();
  }
}
