import { Component } from '@angular/core';
import { ApiService, ApiKeyResponse } from '../services/business/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ApiKeyCreateComponent } from './api-key-create.component';
import { ApiKeyUpdateComponent } from './api-key-update.component';
import { ModalDeleteComponent } from '../components/modal-edit/modal-delete.component';
import { AuthService } from '../services/business/auth.service';
import { RefreshService } from '../services/business/refresh.service';

@Component({
  selector: 'app-api-keys',
  templateUrl: './api-keys.component.html',
})
export class ApiKeysComponent {
  private modalRef: BsModalRef;

  public user$ = this.auth.user$;
  public apiKeys$ = this.api.getAllApiKeys().pipe(this.refresh.listen());

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private modal: BsModalService,
    private refresh: RefreshService
  ) {
  }

  public create() {
    this.modalRef = this.modal.show(ApiKeyCreateComponent);
    this.modalRef.content.onSave = request => this.api
      .createApiKey(request)
      .pipe(this.refresh.onNext());
  }

  public edit(apiKey: ApiKeyResponse) {
    this.modalRef = this.modal.show(ApiKeyUpdateComponent, { initialState: { source: apiKey } });
    this.modalRef.content.onSave = request => this.api
      .updateApiKey(apiKey.id, request)
      .pipe(this.refresh.onNext());
  }

  public revoke(apiKey: ApiKeyResponse) {
    this.modalRef = this.modal.show(ModalDeleteComponent, { initialState: { type: 'api key', id: apiKey.id } });
    this.modalRef.content.onConfirm = () => this.api
      .deleteApiKey(apiKey.idp, apiKey.id)
      .pipe(this.refresh.onNext());
  }
}
