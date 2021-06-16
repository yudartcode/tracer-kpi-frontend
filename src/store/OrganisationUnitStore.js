import moment from 'moment';
import { makeObservable, observable, action, computed, toJS } from 'mobx';
//import { persist } from 'mobx-persist';

class OrganisationUnitStore {
  root = null;
  engine = null;
  user = null;
  ou = null;
  organisationUnits = [];
  selectedOrganisationUnit = null;

  constructor(root, engine, user, ou) {
    this.root = root;
    this.engine = engine;
    this.user = user;
    this.ou = ou;

    makeObservable(this, {
      organisationUnits: observable,
      selectedOrganisationUnit: observable,
      menus: computed,
      load: action,
      select: action,
    });
    this.load();
  }

  get menus() {
    return toJS(this.organisationUnits);
  }

  load() {
    this.organisationUnits = this.user.organisationUnits.reduce((result, organisationUnit) => {
      let foundUnit = this.ou.organisationUnits.reduce((resultOu, unit) => {
        if (unit.id === organisationUnit.id) resultOu = unit;
        return resultOu;
      }, null);
      if (foundUnit != null) {
        foundUnit = this.findChildrens(foundUnit, this.ou);
        foundUnit.title = foundUnit.displayName;
        foundUnit.value = foundUnit.id;
        result.push(foundUnit);
      }
      return result;
    }, []);
    if (this.organisationUnits.length > 0) {
      this.selectedOrganisationUnit = this.organisationUnits[0].value;
    }
  }

  select(ou) {
    this.selectedOrganisationUnit = ou;
  }

  findChildrens = (parent, ou) => {
    if (!parent) return [];
    let children = ou.organisationUnits.reduce((result, unit) => {
      if (unit.parent && unit.parent.id == parent.id) {
        unit.title = unit.displayName;
        unit.value = unit.id;
        result.push(unit);
      }
      return result;
    }, []);
    if (children != null && children.length > 0) {
      children = children.map(child => {
        return this.findChildrens(child, ou);
      });
    }
    if (children.length > 0) {
      parent.children = children;
    }

    return parent;
  };
}

export default OrganisationUnitStore;
