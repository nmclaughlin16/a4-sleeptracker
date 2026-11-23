import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// added IonButtons, IonBackButton for the back arrow
// added IonButton + IonIcon (the + button) and IonModal (popup form)
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-logbook',
  templateUrl: './logbook.page.html',
  styleUrls: ['./logbook.page.scss'],
  standalone: true,
  //added IonButton, IonIcon, IonModal
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonModal, CommonModule, FormsModule]
})
export class LogbookPage implements OnInit {
  // true while the pop-up log form is showing
  isFormOpen = false;

  // 'sleep' shows the overnight sleep form, 'sleepiness' shows the Stanford Sleepiness form
  formType: 'sleep' | 'sleepiness' = 'sleep';

  constructor() {
    // register the + icon
    addIcons({ add });
  }

  ngOnInit() {
  }

  // opens the pop-up form (called when the + button is tapped)
  openForm() {
    this.isFormOpen = true;
  }

  // closes the form without saving. An escape hatch if it was opened by
  // mistake (the "uh-oh button" design principle)
  closeForm() {
    this.isFormOpen = false;
  }

  // closes the form and saves the data.
  saveForm() {
    this.isFormOpen = false;
  }
}