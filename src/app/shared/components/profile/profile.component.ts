import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from '../../services/main.service';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  profileForm: FormGroup;
  selectedFile: File | null = null;
  downloadURL: string | null = null;
  profilePictureUrl : any;
  userInfo:any = {};
  user_id:any;
  selectedFileUrl: any;
  bmi:any
  bmiCategory : any
  constructor(private route: Router,private toastr:ToastrService,private cdr: ChangeDetectorRef, private fb: FormBuilder,private storage: AngularFireStorage,public angularFireAuth: AngularFireAuth,private mainService: MainService) {
    this.profileForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      mobile_number: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      bmi: ['', Validators.required],
      height : ['',Validators.required],
      weight : ['',Validators.required]
    });
  }
  ngOnInit(): void {
    this.user_id = localStorage.getItem('user_id');
    this.getUserInfo();
  }
  onFileSelected(event: any): void {
    let file = event.target.files[0] as File;

    this.selectedFile = file;
      this.selectedFileUrl = window.URL.createObjectURL(file);
      this.cdr.detectChanges(); // Manually trigger change detection
  }

  getUserInfo(){
    this.mainService.getUserInfo(this.user_id).subscribe((res:any)=>{
      this.userInfo = res
      this.profileForm.patchValue(res);
      this.downloadURL = res.photoURL;
      this.bmi = res.bmi;
      this.bmiCategory = this.getBMICategory(this.bmi);
    })
  }

  onSubmit(): void {
    if (this.selectedFile && this.profileForm.valid) {
      const filePath = `products/${Date.now()}_${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedFile);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.downloadURL = url;
            // Now you can submit the form data along with the image URL
            this.submitForm();
          });
        })
      ).subscribe();
    } else {
      if (this.downloadURL && this.profileForm.valid) 
        this.submitForm();
      else
        this.toastr.error(this.profileForm.invalid ? 'Please add the data in the field.':'Please select picture of the product first.')
    }
  }

  submitForm(): void {
    const formData = this.profileForm.value;
    formData.photoURL = this.downloadURL || null;
    this.updateProfile(formData)
    // Handle the form submission, e.g., send data to the server
    console.log('Form data:', formData);
  }

  updateProfile(formData:any) {
  
  // const lesson = {
  //   // productTitle: formData.productTitle,
  //   // price: formData.price,
  //   // description: formData.description,
  //   // calories: formData.calories,
  //   // productImage: formData.productImage,
  //   // date: new Date(),
  //   photoURL
  // };
  const userData = {
    email: formData.email,
    displayName: formData.first_name + ' ' + formData.last_name,
    first_name: formData.first_name,
    last_name: formData.last_name,
    mobile_number: formData.mobile_number, 
    bmi: this.bmi, 
    photoURL: formData.photoURL,
    height: formData.height,
    weight: formData.weight,
  };
  if (this.userInfo.id) {
    this.mainService.updateProfile(this.userInfo.id,userData);
    this.toastr.success('Profile data updated Successfully.')
  }
  this.route.navigateByUrl('/home')
  
}
calculateBMI(): void {
  if (this.profileForm.value.weight && this.profileForm.value.height) {
    this.bmi = this.profileForm.value.weight / (this.profileForm.value.height * this.profileForm.value.height);
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

