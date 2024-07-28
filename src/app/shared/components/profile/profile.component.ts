import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  signUpForm: FormGroup;
  selectedFile: File | null = null;
  downloadURL: string | null = null;
  profilePictureUrl : any;
  constructor(private route: Router, private fb: FormBuilder,private storage: AngularFireStorage,public angularFireAuth: AngularFireAuth,private firestore: AngularFirestore) {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      bmi: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
  }

  onSubmit() {}
}
