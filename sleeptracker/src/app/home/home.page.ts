import { Component } from '@angular/core';
//added IonButtons, IonButton, IonIcon
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

//RouterLink lets a button navigate to go to logbook
import { RouterLink } from '@angular/router';
// addIcons + book icon
import { addIcons } from 'ionicons';
import { book } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  //added IonButtons, IonButton, IonIcon, RouterLink
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, RouterLink],
})
export class HomePage {
  constructor(public sleepService:SleepService) {
    //register the book icon used by the Logbook button
    addIcons({ book });
	}

	ngOnInit() {
		console.log(this.allSleepData);
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}
}