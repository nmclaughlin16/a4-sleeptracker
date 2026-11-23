import { Component } from '@angular/core';
// added IonButtons, IonButton, IonIcon
// added IonCard, IonCardContent (the cards on Home)
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonCard, IonCardContent, IonFooter } from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

// RouterLink lets the book button navigate to the Logbook page
import { RouterLink } from '@angular/router';
// addIcons + book icon
import { addIcons } from 'ionicons';
import { book, alarm, batteryHalf } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  // added IonButtons, IonButton, IonIcon, RouterLink
  // added IonCard, IonCardContent (the cards on Home)
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonCard, IonCardContent, RouterLink, IonFooter],
})
export class HomePage {
  // greeting "Good morning" / "Good afternoon" / "Good evening" and the time shown at the top of home page
  greeting = '';
  currentTime = '';

  // sleepService is needed so saved data loads on refresh
  constructor(private sleepService: SleepService) {
    // register the book icon used by the Logbook button
    addIcons({ book, alarm, batteryHalf });
	}

	// waits for saved data to load so it shows on refresh
	async ngOnInit() {
		await this.sleepService.whenReady();
	}

	// run every time the Home page is about to be displayed, so the greeting and time are always up to date
	ionViewWillEnter() {
		const now = new Date();
		const hour = now.getHours();
		if (hour < 5) {
			this.greeting = 'Good Evening!';
		} else if (hour < 12) {
			this.greeting = 'Good Morning!';
		} else if (hour < 17) {
			this.greeting = 'Good Afternoon!';
		} else {
			this.greeting = 'Good Evening!';
		}
		// time format as 12 hour clock with ampm
		this.currentTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
	}

	// most recent overnight sleep log, or undefined if none are logged
	get lastSleep(): OvernightSleepData | undefined {
		let latest: OvernightSleepData | undefined = undefined;
		// go through every sleep log and keep whichever one has the latest wake-up time
		for (const log of SleepService.AllOvernightData) {
			if (latest === undefined || log.sleepEnd > latest.sleepEnd) {
				latest = log;
			}
		}
		return latest;
	}

	// most recent sleepiness log, or undefined if none are logged
	get lastSleepiness(): StanfordSleepinessData | undefined {
		let latest: StanfordSleepinessData | undefined = undefined;
		// go through every sleepiness log and keep whichever one was logged recently
		for (const log of SleepService.AllSleepinessData) {
			if (latest === undefined || log.loggedAt > latest.loggedAt) {
				latest = log;
			}
		}
		return latest;
	}

	// average hours and minutes of sleep over the last 7 days
	get avgSleepThisWeek(): string {
		const weekAgo = new Date();
		weekAgo.setDate(weekAgo.getDate() - 7);
		const recent = SleepService.AllOvernightData.filter(d => d.sleepEnd >= weekAgo);
		if (recent.length === 0) {
			return '–';
		}
		const totalMs = recent.reduce((sum, d) => sum + (d.sleepEnd.getTime() - d.sleepStart.getTime()), 0);
		const avgMinutes = Math.round(totalMs / recent.length / 60000);
		return `${Math.floor(avgMinutes / 60)}h ${avgMinutes % 60}m`;
	}

	// average sleepiness over the last 7 days
	get avgSleepinessThisWeek(): string {
		const weekAgo = new Date();
		weekAgo.setDate(weekAgo.getDate() - 7);
		const recent = SleepService.AllSleepinessData.filter(d => d.loggedAt >= weekAgo);
		if (recent.length === 0) {
			return '–';
		}
		const total = recent.reduce((sum, d) => sum + d.loggedValue, 0);
		return (total / recent.length).toFixed(1);
	}
}