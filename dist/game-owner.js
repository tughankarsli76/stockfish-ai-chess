// Only the most recently opened game may update the shared autosave.
export class GameOwner {
  static key='chess-preview-active-tab';
  constructor(storage,id=crypto.randomUUID()){this.storage=storage;this.id=id;}
  claim(){this.storage.setItem(GameOwner.key,this.id);}
  owns(){return this.storage.getItem(GameOwner.key)===this.id;}
  save(key,value){if(!this.owns())return false;this.storage.setItem(key,value);return true;}
}
