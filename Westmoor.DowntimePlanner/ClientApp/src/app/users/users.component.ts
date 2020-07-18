import { Component } from '@angular/core';
import { ApiService, UserResponse } from '../api.service';
import { BehaviorSubject, of, OperatorFunction } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserCreateComponent } from './user-create.component';
import { UserUpdateComponent } from './user-update.component';
import { ModalDeleteComponent } from '../modal-edit/modal-delete.component';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
})
export class UsersComponent {
  private users = new BehaviorSubject<UserResponse[]>([]);

  private modalRef: BsModalRef;

  public users$ = this.users.asObservable();

  constructor(
    private api: ApiService,
    private modal: BsModalService
  ) {
    of(null).pipe(this.refresh()).subscribe();
  }

  public create() {
    this.modalRef = this.modal.show(UserCreateComponent);
    this.modalRef.content.onSave = form => this.api
      .createUser({
        owner: form.controls.owner.value,
        roles: form.controls.isRoleAdmin.value ? ['Admin'] : [],
        sharedWith: (form.controls.sharedWith as FormArray).controls
          .map(ctrls => ctrls.value)
      })
      .pipe(this.refresh());
  }

  public edit(user: UserResponse) {
    this.modalRef = this.modal.show(UserUpdateComponent, { initialState: { source: user } });
    this.modalRef.content.onSave = form => this.api
      .updateUser(user.key, {
        owner: form.controls.owner.value,
        roles: form.controls.isRoleAdmin.value ? ['Admin'] : [],
        sharedWith: (form.controls.sharedWith as FormArray).controls
          .map(ctrls => ctrls.value)
      })
      .pipe(this.refresh());
  }

  public revoke(user: UserResponse) {
    this.modalRef = this.modal.show(ModalDeleteComponent, { initialState: { type: 'user', id: user.key } });
    this.modalRef.content.onConfirm = () => this.api
      .deleteUser(user.key)
      .pipe(this.refresh());
  }

  private refresh(): OperatorFunction<void, UserResponse[]> {
    return o => o.pipe(
      switchMap(() => this.api.getAllUsers()),
      tap(us => this.users.next(us))
    );
  }
}
