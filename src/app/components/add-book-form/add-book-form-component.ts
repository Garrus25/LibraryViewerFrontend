import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {BookDTO, DefaultService} from "../../openapi";

@Component({
  selector: 'add-book-form-component',
  templateUrl: './add-book-form-component.html',
  styleUrls: ['./add-book-form-component.css']
})
export class AddBookFormComponent implements OnInit {
  form!: FormGroup;
  selectedImage: string | ArrayBuffer | null = null;

  constructor(private formBuilder: FormBuilder, private api: DefaultService,) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      isbn: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(13), Validators.pattern('^[0-9]*$')]],
      title: ['', [Validators.required, Validators.maxLength(64)]],
      description: ['', [Validators.required, Validators.maxLength(10000)]],
      image: [null, Validators.required],
      coverName: ['']
    })
  }

  onSubmit() {
    this.saveBookData()
    this.selectedImage = null;
  }

  saveBookData(): void {
    let book: BookDTO = {
      isbn: this.form.value.isbn,
      title: this.form.value.title,
      description: this.form.value.description,
      additionDate: new Date().toISOString().split('T')[0],
      authorId: 1,
      coverName: this.form.value.coverName,
      createdBy: sessionStorage.getItem('id') || '',
      averageRating: 0,
    };

    this.api.addBook(book).subscribe({
      next: () => {
        console.log('Book added successfully');
      },
      error: error => {
        console.error('Could not fetch book:', error);
      }
    });

    this.api.uploadBookCover(this.form.value.image).subscribe({
      next: () => {
        console.log('Cover uploaded successfully');
        this.form.reset();
      },
      error: error => {
        console.error('Could not fetch book:', error);
      }
    });

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

      // Przechwyć nazwę pliku
      this.form.patchValue({
        coverName: file.name
      });
      console.log('Cover name:', file.name);
    }
  }
}
