import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  signUpForm: FormGroup;
  selectedFile: File | null = null;
  downloadURL: string | null = null;
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

  onSubmit1() {
    if (this.signUpForm.valid) {
      console.log(this.signUpForm.value);
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
  }
  onSubmit(): void {
    if (this.selectedFile) {
      const filePath = `profile_images/${Date.now()}_${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedFile);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.downloadURL = url;
            // Now you can submit the form data along with the image URL
            this.submitForm(url);
          });
        })
      ).subscribe();
    } else {
      this.submitForm();
    }
  }

  submitForm(imageUrl?: string): void {
    const formData = this.signUpForm.value;
    formData.imageUrl = imageUrl || null;
    this.SignUp(formData)
    // Handle the form submission, e.g., send data to the server
    console.log('Form data:', formData);
  }


  SignUp(formData:any) {
    this.angularFireAuth
     .createUserWithEmailAndPassword(this.signUpForm.value.email, this.signUpForm.value.password)
     .then((result) => {
       this.SetUserData(result.user,formData);
       this.route.navigate(['/login'])
     })
     .catch((error) => {
       window.alert(error.message);
     });
 }
 SetUserData(user: any,formData:any) {
   const userRef: AngularFirestoreDocument<any> = this.firestore.doc(
     `users/${user.uid}`
   );
   const userData = {
     uid: user.uid,
     email: user.email,
     displayName: formData.firstName + ' ' + formData.lastName,
     first_name: formData.firstName,
     last_name: formData.lastName,
     mobile_number: formData.mobileNumber, 
     bmi: formData.bmi, 
     photoURL: formData.imageUrl,
     emailVerified: user.emailVerified,
     accountType: 2
   };
   return userRef.set(userData, {
     merge: true,
   });
 }
}
