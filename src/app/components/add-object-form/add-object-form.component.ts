import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-object-form',
  templateUrl: './add-object-form.component.html',
  styleUrls: ['./add-object-form.component.css']
})
export class AddObjectFormComponent implements OnInit {
  form!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      isbn: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: [null]
    });
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      if (this.form) {
        // @ts-ignore
        this.form.get('image').setValue(file);
      }
    }
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
