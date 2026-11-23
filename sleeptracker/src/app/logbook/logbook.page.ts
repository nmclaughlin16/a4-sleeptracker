import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// ionic components imported so that they can be used in the html
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton,
  IonIcon, IonModal, IonDatetime, IonDatetimeButton, IonRange,
  IonList, IonListHeader, IonItem, IonLabel, IonCard, IonCardTitle, IonCardHeader, IonCardContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
// icons for the toolbar buttons (alarm = log sleep, battery-half = log sleepiness) and trash for deleting logs
import { alarm, batteryHalf, trash } from 'ionicons/icons';

// service that stores sleep data, and the data types for overnight sleep and Stanford Sleepiness entries
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
// sleepiness class for scale values and descriptions
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
// parent class for deleting both types of logs from logbook
import { SleepData } from '../data/sleep-data';

// turns date into a string for datetime inputs. local time is used
function toLocalISO(d: Date): string {
  const offsetMs = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offsetMs).toISOString().slice(0, 19);
}

// one day in milliseconds, used for error catching if sleep is longer than one day (assuming that is user error)
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
interface DayGroup {
  key: string;                          // 'YYYY-MM-DD', used for sorting
  heading: string;                      // 'Monday, November 23'
  sleep: OvernightSleepData[];
  sleepiness: StanfordSleepinessData[];
}

@Component({
  selector: 'app-logbook',
  templateUrl: './logbook.page.html',
  styleUrls: ['./logbook.page.scss'],
  // ionic components and modules used in the html
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonModal, 
    IonDatetime, IonDatetimeButton, IonRange, IonList, IonListHeader, IonItem, IonLabel, CommonModule, FormsModule,
    IonCard, IonCardTitle, IonCardHeader, IonCardContent]
})
export class LogbookPage {
  // true while the pop-up log form is showing
  isFormOpen = false;

  // 'sleep' shows the overnight sleep form, 'sleepiness' shows the Stanford Sleepiness form
  formType: 'sleep' | 'sleepiness' = 'sleep';

  // times currently selected in pop-up form. update automatically as user picks times.
  bedtime = '';
  wakeTime = '';

  // sleepiness form values 4 for default (middle)
  sleepinessValue = 4;
  sleepinessTime = '';
  // latest time the pickers allow so can't pick future
  maxTime = '';
  // descriptions from stanford sleepiness scale
  scaleValues = StanfordSleepinessData.ScaleValues;

  // sleepservice is used to save the data when the form is submitted
  constructor(
    private sleepService: SleepService,
    private route: ActivatedRoute,
    private router: Router) {
    // register the alarm, battery-half, and trash icons
    addIcons({ alarm, batteryHalf, trash });
  }

  // all sleep logs for the list
  get overnightLogs() {
    return SleepService.AllOvernightData;
  }

  // all sleepiness logs for the list
  get sleepinessLogs() {
    return SleepService.AllSleepinessData;
  }

  // return length of sleep in milliseconds
  get sleepLengthMs(): number {
    return new Date(this.wakeTime).getTime() - new Date(this.bedtime).getTime();
  }

  // return true if sleep length is realistic
  get sleepIsValid(): boolean {
    return this.sleepLengthMs > 0 && this.sleepLengthMs <= ONE_DAY_MS;
  }

  // message for error or length of sleep
  get sleepMessage(): string {
    if (this.sleepLengthMs <= 0) {
      return 'No time travel! Wake time must be after bedtime';
    }
    if (this.sleepLengthMs > ONE_DAY_MS) {
      return 'Sleeping for over 24 hours? Check your times!';
    }
    const totalMinutes = Math.round(this.sleepLengthMs / 60000);
    return `${Math.floor(totalMinutes / 60)} hr ${totalMinutes % 60} min of sleep`;
  }

  // allows buttons from home-page to access the content of the logbook page
  ionViewDidEnter() {
  const form = this.route.snapshot.queryParamMap.get('form');
  if (form === 'sleep' || form === 'sleepiness') {
    this.openForm(form);
    // remove ?form=... from the URL so going back or refreshing doesn't reopen the form
    this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
  }
}

  // pop-up forms for sleep logging or sleepiness logging
  openForm(type: 'sleep' | 'sleepiness') {
    // starting times for the form: bedtime is 11pm last night, wake time is now. default values are used if no times are picked.
    const now = new Date();
    // error checking for future times
    this.maxTime = toLocalISO(now);
    const lastNight = new Date(now);
    lastNight.setDate(now.getDate() - 1);
    lastNight.setHours(23, 0, 0, 0);

    this.bedtime = toLocalISO(lastNight);
    this.wakeTime = toLocalISO(now);

    // sleepiness default in middle of scale, time is current
    this.sleepinessValue = 4;
    this.sleepinessTime = toLocalISO(now);

    // set the form type and show the form
    this.formType = type;
    this.isFormOpen = true;
  }

  // uh oh design principle. closes the form without saving the data. called when the Cancel button is tapped
  closeForm() {
    this.isFormOpen = false;
  }

  // uh oh design principle. deletes a log when its trash icon is tapped. deleteEntry() also updates storage
  deleteLog(log: SleepData) {
    this.sleepService.deleteEntry(log);
  }

  // closes the form and saves the data. async because save is asynchronous. called when the Save button is tapped.
  async saveForm() {
    if (this.formType === 'sleep') {
      // build a new OvernightSleepData object from the form values, and save it using the sleep service
      await this.sleepService.logOvernightData(
        new OvernightSleepData(new Date(this.bedtime), new Date(this.wakeTime))
      );
    } else {
      // build a new stanford sleepiness object and save it
      await this.sleepService.logSleepinessData(
        new StanfordSleepinessData(this.sleepinessValue, new Date(this.sleepinessTime))
      );
    }
    this.isFormOpen = false;
  }
  get days(): DayGroup[] {
  const groups = new Map<string, DayGroup>();

  // categorizes events by date
  const groupFor = (d: Date): DayGroup => {
    const key = toLocalISO(d).slice(0, 10);   
    let group = groups.get(key);
    if (!group) {
      group = {
        key,
        heading: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
        sleep: [],
        sleepiness: []
      };
      groups.set(key, group);
    }
    return group;
  };

  // sleep goes on the day the person woke up
  for (const s of SleepService.AllOvernightData) {
    groupFor(s.sleepEnd).sleep.push(s);
  }
  for (const s of SleepService.AllSleepinessData) {
    groupFor(s.loggedAt).sleepiness.push(s);
  }

  // newest entries first inside each day
  for (const g of groups.values()) {
    g.sleep.sort((a, b) => b.sleepEnd.getTime() - a.sleepEnd.getTime());
    g.sleepiness.sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
  }

  return [...groups.values()].sort((a, b) => b.key.localeCompare(a.key));
}

timeString(d: Date): string {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

durationString(s: OvernightSleepData): string {
  const totalMinutes = Math.round((s.sleepEnd.getTime() - s.sleepStart.getTime()) / 60000);
  return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
}
}