import { Component, Input } from '@angular/core';
import { DowntimeCostResponse } from '../../services/business/api.service';

@Component({
  selector: 'app-progresses-presenter',
  templateUrl: './progresses-presenter.component.html',
})
export class ProgressesPresenterComponent {
  @Input() public progresses: DowntimeCostResponse[];
  @Input() public animate: boolean;
}
