import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationDropdown } from '@/app/components/notification-dropdown/notification-dropdown.component';

@Component({
  selector: 'no-layout',
  templateUrl: './nolayout.html',
  imports: [RouterOutlet, NotificationDropdown],
})
export class NoLayout {}
