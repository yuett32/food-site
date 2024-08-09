import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  clientForm: FormGroup;
  employeeForm: FormGroup;
  selectedFile: File | null = null;
  downloadURL: string | null = null;
  accountType:any = 3;
  bmi:any
  bmiCategory : any
  constructor(private route: Router, private fb: FormBuilder,private storage: AngularFireStorage,public angularFireAuth: AngularFireAuth,private firestore: AngularFirestore, private toastr: ToastrService) {
    this.clientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      weight: ['', Validators.required],
      height: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
  }
  onSubmit(): void {
    if (this.selectedFile && (this.accountType == 2 ? this.employeeForm.valid : this.clientForm.valid)) {
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
      this.toastr.info('Please Enter all the data first.')
    }
  }

  submitForm(imageUrl?: string): void {
    const formData = this.accountType == 2 ? this.employeeForm.value : this.clientForm.value
    formData.imageUrl = imageUrl || null;
    this.SignUp(formData)
    // Handle the form submission, e.g., send data to the server
    console.log('Form data:', formData);
  }


  SignUp(formData:any) {
    this.angularFireAuth
     .createUserWithEmailAndPassword(this.accountType == 2 ? this.employeeForm.value.email : this.clientForm.value.email,this.accountType == 2 ? this.employeeForm.value.password : this.clientForm.value.password)
     .then((result) => {
       this.SetUserData(result.user,formData);
       if (this.accountType == 2) {
        this.toastr.success('Congratulatios you are regitered Successfully, please ask admin to approve your account.')
       }
       else this.toastr.success('Congratulatios you are regitered Successfully, please logid in.')
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
     bmi: this.accountType == 3 ? this.bmi : 0, 
     weight: this.accountType == 3 ? formData.weight : 0, 
     height: this.accountType == 3 ? formData.height : 0, 
     photoURL: formData.imageUrl,
     emailVerified: user.emailVerified,
     accountType: this.accountType,
     accountActivated: this.accountType == 3 ? true : false, 
   };
   return userRef.set(userData, {
     merge: true,
   });
 }

 calculateBMI(): void {
  if (this.clientForm.value.weight && this.clientForm.value.height) {
    this.bmi = this.clientForm.value.weight / (this.clientForm.value.height * this.clientForm.value.height);
    this.bmiCategory = this.getBMICategory(this.bmi);
  }
  else {
    this.bmi = '';
    this.bmiCategory = ''
  }
}

getBMICategory(bmi: number): string {
  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi >= 18.5 && bmi < 24.9) {
    return 'Normal weight';
  } else if (bmi >= 25 && bmi < 29.9) {
    return 'Overweight';
  } else {
    return 'Obesity';
  }
}
}
