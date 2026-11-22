import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

//Takes Storage object, and returns value associated with respective key
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private ready: Promise<Storage>;

  //Initializes ionic storage(although not specific here
  // could potentially be used for other dbs)
  constructor(private storage: Storage) {
    this.ready = this.storage.create();
  }

  //Return value associated with key
    public async get(key: string): Promise<void> {
        const store = await this.ready;
        return store.get(key);
    }

  // Set value of key
  public async set(key: string, value: any): Promise<void> {
    const store = await this.ready;
    await store.set(key, value);
  }
}