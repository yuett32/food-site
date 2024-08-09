import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, from, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private firestore: AngularFirestore,
    private storage: AngularFireStorage,private toastr: ToastrService) { }

    addProduct(addData: any) {
      return this.firestore.collection('products').add(addData)
      .then(() => {
        console.log('Product added successfully');
        return true
      })
      .catch((error) => {
        console.error('Error adding product: ', error);
        return false;
      });
  }

  updateProduct(productId: string, updatedData: any) {
    return this.firestore.collection('products').doc(productId).update(updatedData)
      .then(() => {
        console.log('Product updated successfully');
      })
      .catch((error) => {
        console.error('Error updating Product: ', error);
      });
  }
  deleteProduct(productId: string) {
    return this.firestore.collection('products').doc(productId).delete()
      .then(() => {
        console.log('product deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting product: ', error);
      });
  }

  getAllProducts(): Observable<any[]> {
    return this.firestore.collection('products').snapshotChanges().pipe(
      map(actions => actions.map(action => {
        const data = action.payload.doc.data() as any; // Ensure data is cast as 'any'
        const id = action.payload.doc.id;
        return { id, ...data }; // Combine id with document data
      }))
    );
  }

  getAllOrders(): Observable<any[]> {
    return this.firestore.collection('orders', ref => ref.orderBy('date', 'desc')).snapshotChanges().pipe(
      map(actions => actions.map(action => {
        const data = action.payload.doc.data() as any; // Ensure data is cast as 'any'
        const id = action.payload.doc.id;
        return { id, ...data }; // Combine id with document data
      }))
    );
  }
  
getAllCartItems(userId: string): Observable<any[]> {
    return this.firestore.collection('cart', ref => ref.where('userId', '==', userId)).snapshotChanges().pipe(
      map(actions => actions.map(action => {
        const data = action.payload.doc.data() as any; // Ensure data is cast as 'any'
        const docId = action.payload.doc.id;
        return { docId, ...data }; // Combine id with document data
      }))
    );
  }

  getUserInfo(userId: string): Observable<any> {
    return this.firestore.collection('users').doc(userId).snapshotChanges().pipe(
      map(doc => {
        const data = doc.payload.data();
        return data ? { id : doc.payload.id, ...data } : { id : doc.payload.id };
      })
    );
  }

  getAllCartItemsWithName(userId: string): Observable<any[]> {
    return this.firestore.collection('cart', ref => ref.where('userId', '==', userId)).snapshotChanges().pipe(
      map(actions => actions.map(action => {
        const data = action.payload.doc.data() as any;
        const docId = action.payload.doc.id;
        return { docId, ...data };
      })),
      switchMap((cartItems:any) => {
        if (cartItems.length === 0) {
          return [cartItems];
        }

        return forkJoin(
          cartItems.map((item:any) => 
            this.firestore.collection('users').doc(userId).valueChanges().pipe(
              map(user => {
                item.displayName = (user as any).displayName;
                return item;
              })
            )
          )
        );
      })
    );
  }

getAllItems(userId: string,addData?:any):any {

  this.firestore.collection('cart', ref => ref.where('userId', '==', userId))
  .get()
  .subscribe((snapshot: any) => {
    let data  = snapshot.docs.map((doc: any) => {
      return {
        id: doc.id, // Document ID
        ...doc.data() // Document data
      };
    });
    let item = data ? data.find((item:any)=> item.id == addData.id): null
    if (item) {
      this.toastr.info('Item already in cart');
    }
    else {
      this.firestore.collection('cart').add(addData)
    .then(() => {
      console.log('cart added successfully');
      this.toastr.success('Item added in the cart');
    })
    .catch((error) => {
      console.error('Error adding cart: ', error);
      this.toastr.error('Something went wrong.');
    });
    }
    return true
    console.log(data);
  });
}
deleteItem(itemId: string) {
  return this.firestore.collection('cart').doc(itemId).delete()
    .then(() => {
      console.log('cart deleted successfully');
    })
    .catch((error) => {
      console.error('cart deleting product: ', error);
    });
}
placeOrder(addData: any) {
  return this.firestore.collection('orders').add(addData)
  .then(() => {
    console.log('Order added successfully');
    return true
  })
  .catch((error) => {
    console.error('Error adding Order: ', error);
    return false;
  });
}

deleteAllCartItems(userId: string) {
  return this.firestore.collection('cart', ref => ref.where('userId', '==', userId))
    .get()
    .pipe(
      switchMap(snapshot => {
        const batch = this.firestore.firestore.batch();
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        return from(batch.commit()); // Convert promise to observable
      })
    );
}
updateProfile(userId: string, updatedData: any) {
  return this.firestore.collection('users').doc(userId).update(updatedData)
    .then(() => {
      console.log('Profile updated successfully');
    })
    .catch((error) => {
      console.error('Error updating Profile: ', error);
    });
}
getUsersWithAccountType(accountType: number): Observable<any[]> {
  return this.firestore
    .collection('users', ref => ref.where('accountType', '==', accountType))
    .snapshotChanges()
    .pipe(
      map(actions => 
        actions.map(action => {
          const data = action.payload.doc.data() as any;
          const id = action.payload.doc.id;
          return { id, ...data };
        })
      )
    );
}

deleteUser(userId: string): void {
  this.firestore.doc(`users/${userId}`).delete();
}
approveUser(userId: string,action:boolean): void {
  this.firestore.doc(`users/${userId}`).update({ accountActivated: action });
}
updateStatus(userId: string,action:string): void {
  this.firestore.doc(`orders/${userId}`).update({ status: action });
}
getOrdersByUserId(userId: string): Observable<any[]> {
  return this.firestore.collection('orders', ref => ref.where('userId', '==', userId)).valueChanges();
}

}
