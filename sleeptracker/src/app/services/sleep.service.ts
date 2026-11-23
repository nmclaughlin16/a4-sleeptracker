import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { StorageService } from './storage.service';

interface SavedOvernight {
	id: string;
	loggedAt: string;
	start: string;
	end: string;
}

interface SavedSleepiness {
	id: string;
	loggedAt: string;
	value: number;
}

@Injectable({
  providedIn: 'root'
})
export class SleepService {
	//private static LoadDefaultData:boolean = true;
	public static AllSleepData:SleepData[] = [];
	public static AllOvernightData:OvernightSleepData[] = [];
	public static AllSleepinessData:StanfordSleepinessData[] = [];

	private ready: Promise<void>;

	constructor(private storageService: StorageService) {
		this.ready = this.loadData();
	}

	public whenReady(): Promise<void> {
		return this.ready;
	}

	private async loadData() {
		const overnight: SavedOvernight[] | null = await this.storageService.get('overnightSleep');
		const sleepiness: SavedSleepiness[] | null = await this.storageService.get('sleepiness');

		// Nothing saved yet: first launch, so add the sample data
		if (overnight == null && sleepiness == null) {
			this.addDefaultData();
			return;
		}

		for (const o of overnight ?? []) {
			const entry = new OvernightSleepData(new Date(o.start), new Date(o.end));
			entry.id = o.id;                      // restore the original id
			entry.loggedAt = new Date(o.loggedAt);
			this.addOvernight(entry);
		}
		for (const s of sleepiness ?? []) {
			const entry = new StanfordSleepinessData(s.value, new Date(s.loggedAt));
			entry.id = s.id;
			this.addSleepiness(entry);
		}
	}

	private async saveData() {
		await this.storageService.set('overnightSleep',
			SleepService.AllOvernightData.map(d => ({
				id: d.id,
				loggedAt: d.loggedAt.toISOString(),
				start: d.sleepStart.toISOString(),
				end: d.sleepEnd.toISOString()
			})));
		await this.storageService.set('sleepiness',
			SleepService.AllSleepinessData.map(d => ({
				id: d.id,
				loggedAt: d.loggedAt.toISOString(),
				value: d.loggedValue
			})));
	}

	private addOvernight(d: OvernightSleepData) {
		SleepService.AllSleepData.push(d);
		SleepService.AllOvernightData.push(d);
	}

	private addSleepiness(d: StanfordSleepinessData) {
		SleepService.AllSleepData.push(d);
		SleepService.AllSleepinessData.push(d);
	}

	private addDefaultData() {
		var goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(1, 3, 0); //1:03am
		var wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 8 * 60 * 60 * 1000); //Sleep for exactly eight hours, waking up at 9:03am
		this.logOvernightData(new OvernightSleepData(goToBed, wakeUp)); // add that person was asleep 1am-9am yesterday
		var sleepinessDate = new Date();
		sleepinessDate.setDate(sleepinessDate.getDate() - 1); //set to yesterday
		sleepinessDate.setHours(14, 38, 0); //2:38pm
		this.logSleepinessData(new StanfordSleepinessData(4, sleepinessDate)); // add sleepiness at 2pm
		goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(23, 11, 0); //11:11pm
		wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 9 * 60 * 60 * 1000); //Sleep for exactly nine hours
		this.logOvernightData(new OvernightSleepData(goToBed, wakeUp));
	}

	public logOvernightData(sleepData:OvernightSleepData) {
		this.addOvernight(sleepData);
		this.saveData();
	}

	public logSleepinessData(sleepData:StanfordSleepinessData) {
		this.addSleepiness(sleepData);
		this.saveData();
	}

	public deleteEntry(entry:SleepData) {
		const keep = (d:SleepData) => d.id !== entry.id;
		SleepService.AllSleepData = SleepService.AllSleepData.filter(keep);
		SleepService.AllOvernightData = SleepService.AllOvernightData.filter(keep);
		SleepService.AllSleepinessData = SleepService.AllSleepinessData.filter(keep);
		this.saveData();
	}
}
