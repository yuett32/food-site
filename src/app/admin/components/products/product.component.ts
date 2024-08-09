import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{
  productForm: FormGroup;
  selectedFile: File | null = null;
  downloadURL: string | null = null;
  profilePictureUrl : any;
  selectedFileUrl: any;
  formData:any
  @ViewChild('fileInput') fileInput!: ElementRef;
  constructor(private route: Router, private fb: FormBuilder,private storage: AngularFireStorage,public angularFireAuth: AngularFireAuth,
    private toastr: ToastrService,public bsModalRef: BsModalRef, private mainService: MainService,
    private cdr: ChangeDetectorRef) {
    this.productForm = this.fb.group({
      productTitle: ['', Validators.required],
      price: ['', Validators.required],
      calories: ['', Validators.required],
      description: ['', Validators.required],
      available: ['', Validators.required],
      category: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    if (this.formData) {
      this.downloadURL = this.formData.productImage;
      this.productForm.patchValue(this.formData)
    }
  }
  onFileSelected(event: any): void {
    let file = event.target.files[0] as File;
    this.selectedFile = file;
      this.selectedFileUrl = window.URL.createObjectURL(file);
      this.cdr.detectChanges(); // Manually trigger change detection
  }
  onClose() {
    this.bsModalRef.hide()
  }
  updatePicture() {
    this.fileInput.nativeElement.click();
  }
  onSubmit(): void {
    if (this.selectedFile && this.productForm.valid) {
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
      if (this.downloadURL && this.productForm.valid) 
        this.submitForm();
      else
        this.toastr.error(this.productForm.invalid ? 'Please add the data in the field.':'Please select picture of the product first.')
    }
  }

  submitForm(): void {
    const formData = this.productForm.value;
    formData.productImage = this.downloadURL || null;
    this.addProduct(formData)
    // Handle the form submission, e.g., send data to the server
    console.log('Form data:', formData);
  }

  addProduct(formData:any) {
  
  const lesson = {
    productTitle: formData.productTitle,
    price: formData.price,
    description: formData.description,
    calories: formData.calories,
    productImage: formData.productImage,
    date: new Date(),
    available: formData.available,
    category: formData.category
  };
  if (this.formData?.id) {
    this.mainService.updateProduct(this.formData.id,lesson);
    this.toastr.success('Product is updated Successfully.')
  }
  else {
    this.mainService.addProduct(lesson);
    this.toastr.success('Product is added Successfully.')
  }
  this.cancel()
  
}
cancel() {
  this.bsModalRef.hide();
}
}
