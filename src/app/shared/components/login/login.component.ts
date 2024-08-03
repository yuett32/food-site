import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  constructor(private fb: FormBuilder,public angularFireAuth: AngularFireAuth,private firestore: AngularFirestore,private route: Router,private toastr: ToastrService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }


  onSubmit() {
    if (this.loginForm.valid) {
    this.errorMessage = '';
    this.angularFireAuth.signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password)
      .then((userCredential:any) => {
        // Access the user's account type from Firestore
        this.firestore.collection('users').doc(userCredential.user.uid).get()
          .subscribe((doc:any) => {
            if (doc.exists) {
              if (doc.data().accountActivated) {
                const accountType = doc.data().accountType;
              localStorage.setItem('authToken', userCredential.user.getIdToken());
              localStorage.setItem('user_id', userCredential.user.uid);
              this.toastr.success('Logged in Successfully.')
              localStorage.setItem('accountType', accountType);
              if (accountType == 1) {
                this.route.navigate(['/admin']);
              } else if (accountType == 2) {
                this.route.navigate(['/employee']);
              }
              else {
                this.route.navigate(['/home']);
              }
              }
              else this.toastr.info('Please contact admin for the Activation')
              
            } else {
              console.log('User document does not exist');
              // Handle error here, e.g., show an error message to the user
            }
          });
      })
      .catch((error) => {
        this.toastr.error('Your Credentials are incorrect!, try again')
        this.errorMessage = 'Your provided Credentials are Wrong or Something went wrong'
        // Handle error here, e.g., show an error message to the user
      });
    }
    else {
      this.toastr.info('Please Enter your crendentials first.')
    }
  }
}
