import { Component } from '@angular/core';
import { ApiService, ApiKeyResponse } from '../api.service';
import { BehaviorSubject, of, OperatorFunction } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ApiKeyCreateComponent } from './api-key-create.component';
import { ApiKeyUpdateComponent } from './api-key-update.component';
import { ModalDeleteComponent } from '../modal-edit/modal-delete.component';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-api-keys',
  templateUrl: './api-keys.component.html',
})
export class ApiKeysComponent {
  private apiKeys = new BehaviorSubject<ApiKeyResponse[]>([]);

  private modalRef: BsModalRef;

  public apiKeys$ = this.apiKeys.asObservable();

  constructor(
    private api: ApiService,
    private modal: BsModalService
  ) {
    of(null).pipe(this.refresh()).subscribe();
  }

  public create() {
    this.modalRef = this.modal.show(ApiKeyCreateComponent);
    this.modalRef.content.onSave = form => this.api
      .createApiKey({
        owner: form.controls.owner.value,
        roles: form.controls.isRoleAdmin.value ? ['Admin'] : [],
        sharedWith: (form.controls.sharedWith as FormArray).controls
          .map(ctrls => ctrls.value)
      })
      .pipe(this.refresh());
  }

  public edit(apiKey: ApiKeyResponse) {
    this.modalRef = this.modal.show(ApiKeyUpdateComponent, { initialState: { source: apiKey } });
    this.modalRef.content.onSave = form => this.api
      .updateApiKey(apiKey.key, {
        owner: form.controls.owner.value,
        roles: form.controls.isRoleAdmin.value ? ['Admin'] : [],
        sharedWith: (form.controls.sharedWith as FormArray).controls
          .map(ctrls => ctrls.value)
      })
      .pipe(this.refresh());
  }

  public revoke(apiKey: ApiKeyResponse) {
    this.modalRef = this.modal.show(ModalDeleteComponent, { initialState: { type: 'api key', id: apiKey.key } });
    this.modalRef.content.onConfirm = () => this.api
      .deleteApiKey(apiKey.key)
      .pipe(this.refresh());
  }

  private refresh(): OperatorFunction<void, ApiKeyResponse[]> {
    return o => o.pipe(
      switchMap(() => this.api.getAllApiKeys()),
      tap(us => this.apiKeys.next(us))
    );
  }
}
