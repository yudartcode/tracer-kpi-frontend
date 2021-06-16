import { useState } from 'react';

import UserStore from './UserStore';
import OrganisationUnitStore from './OrganisationUnitStore';
import CaseStore from './CaseStore';

class RootStore {
  engine = null;
  user = null;
  ou = null;
  cases = null;

  constructor(engine, initialData) {
    this.engine = engine;
    this.user = new UserStore(this, engine, initialData.user);
    this.ou = new OrganisationUnitStore(this, engine, initialData.user, initialData.ou);
    this.cases = new CaseStore(this, engine);
  }
}

export default RootStore;
