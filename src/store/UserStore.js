import moment from 'moment';
import { makeObservable, observable, action, computed, toJS } from 'mobx';
//import { persist } from 'mobx-persist';

class UserStore {
  root = null;
  engine = null;
  user = null;

  constructor(root, engine, user) {
    this.root = root;
    this.engine = engine;
    this.user = user;
    makeObservable(this, {
      user: observable,
    });
  }

  load() {}
}

export default UserStore;
