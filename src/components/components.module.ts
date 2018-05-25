import { NgModule } from '@angular/core';
import { ToastControllerComponent } from './toast-controller/toast-controller';
import { LoadingControllerComponent } from './loading-controller/loading-controller';
import { NotificationAlertComponent } from './notification-alert/notification-alert';
@NgModule({
	declarations: [ToastControllerComponent,
    LoadingControllerComponent,
    NotificationAlertComponent],
	imports: [],
	exports: [ToastControllerComponent,
    LoadingControllerComponent,
    NotificationAlertComponent]
})
export class ComponentsModule {}
