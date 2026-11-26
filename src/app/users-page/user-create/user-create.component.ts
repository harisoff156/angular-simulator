import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-create',
  imports: [ReactiveFormsModule],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss',
})
export class UserCreateComponent {
  @Output() readonly userCreated = new EventEmitter<User>();
  private readonly formBuilder = inject(FormBuilder).nonNullable;

  protected readonly userForm = this.formBuilder.group({
    name: ['', Validators.maxLength(80)],
    username: ['', [Validators.maxLength(40), Validators.pattern(/^[\p{L}\p{N}_.-]+$/u)]],
    email: ['', [Validators.maxLength(254), Validators.email]],
    phone: ['', [Validators.maxLength(30), Validators.pattern(/^\+?(?:[(). -]*\d){5,15}[(). -]*$/)]],
    website: [
      '',
      [
        Validators.maxLength(200),
        Validators.pattern(/^(?:https?:\/\/)?(?:[a-z0-9-]+\.)+[a-z]{2,}(?::\d{1,5})?(?:[/?#][^\s]*)?$/i),
      ],
    ],
    address: this.formBuilder.group({
      city: ['', Validators.maxLength(80)],
      street: ['', Validators.maxLength(100)],
      suite: ['', Validators.maxLength(40)],
      zipcode: ['', [Validators.maxLength(20), Validators.pattern(/^[\p{L}\p{N} -]+$/u)]],
      geo: this.formBuilder.group({
        lat: new FormControl<number | null>(null, [Validators.min(-90), Validators.max(90)]),
        lng: new FormControl<number | null>(null, [Validators.min(-180), Validators.max(180)]),
      }),
    }),
    company: this.formBuilder.group({
      name: ['', Validators.maxLength(100)],
      catchPhrase: ['', Validators.maxLength(160)],
      bs: ['', Validators.maxLength(160)],
    }),
  });

  protected createUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.getRawValue();
    const { lat, lng } = formValue.address.geo;
    const user: User = {
      ...formValue,
      id: Date.now(),
      address: {
        ...formValue.address,
        geo: { lat: lat?.toString() ?? '', lng: lng?.toString() ?? '' },
      },
    };

    this.userCreated.emit(user);
    this.userForm.reset();
  }
}
