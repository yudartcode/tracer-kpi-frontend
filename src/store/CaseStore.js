import moment from 'moment';
import { makeObservable, observable, action, computed, toJS } from 'mobx';
//import { persist } from 'mobx-persist';

import { COVID_CONFIRMATION_PROGRAM_CODE, COVID_CONTACT_CASE_PROGRAM_CODE } from './../constants/DhisVariables';
import {
  ALL_COVID_INSTANCE_QUERY,
  ALL_COVID_PROGRAM_ENROLLMENT_QUERY,
  ALL_COVID_EVENT_QUERY,
} from './../constants/FixedQueries';
import _ from 'lodash';
import axios from 'axios';
import InstanceConverter from './DhisConverter/InstanceConverter';

class CaseStore {
  root = null;
  engine = null;

  process = {
    loading: false,
    invalidate: true,
    lastUpdate: moment().toString(),
  };
  searchText = '';
  dateFilter = []
  startDate = moment().startOf('month');
  endDate = moment().endOf('month');
  userGroups = [];
  userGroupFilter = [];
  confirmCases = [];
  confirmCasesUsers = [];
  confirmCasesIndex = {};
  contactCases = [];
  contactCasesIndex = {};

  currentTree = {};

  constructor(root, engine) {
    this.root = root;
    this.engine = engine;
    makeObservable(this, {
      process: observable,
      searchText: observable,
      dateFilter: observable,
      startDate: observable,
      endDate: observable,
      userGroups: observable,
      userGroupFilter: observable,
      confirmCases: observable,
      confirmCasesUsers: observable,
      contactCases: observable,
      currentTree: observable,

      caseList: computed,
      userList: computed,

      filterBy: action,
      selectAsTree: action,
      load: action,
      loadSuccess: action.bound,
      loadError: action.bound,
    });
  }

  isStringIncluded = (search, field, fieldName) => {
    let value = field[fieldName] ? field[fieldName].toLowerCase() : '';
    let searchlower = search ? search.toLowerCase() : null;
    return value.includes(searchlower);
  };

  get caseList() {
    try {
      let casesArray = toJS(this.confirmCases);
      if (this.searchText == null || this.searchText == '') return casesArray;
      casesArray = casesArray.filter(cases => {
        let result = false;
        result |= this.isStringIncluded(this.searchText, cases, 'mHwPpgxFDge');
        result |= this.isStringIncluded(this.searchText, cases, 'GdwLfGObIRT');
        result |= this.isStringIncluded(this.searchText, cases, 'YlOp8W4FYRH');
        return result;
      });
      return casesArray;
    } catch (error) {
      console.log(error);
    }
  }
  get userList() {
    try {
      let users = toJS(this.confirmCasesUsers);
      return users;
    } catch (error) {
      console.log(error);
    }
  }
  get userGroupList() {
    try {
      return toJS(this.userGroups);
    } catch (error) {
      console.log(error);
    }
  }

  get selectedOrganisationUnit() {
    return this.root.ou.selectedOrganisationUnit;
  }

  get instanceQuery() {
    let query = { ...ALL_COVID_INSTANCE_QUERY };
    query.params.ou = this.selectedOrganisationUnit;
    query.params.programStartDate = this.startDate.format("YYYY-MM-DD")
    query.params.programEndDate = this.endDate.format("YYYY-MM-DD")
    return query;
  }

  get confirmInstanceQuery() {
    let query = JSON.parse(JSON.stringify(ALL_COVID_INSTANCE_QUERY));
    query.params.ou = this.selectedOrganisationUnit;
    query.params.ouMode = 'DESCENDANTS';
    query.params.program = COVID_CONFIRMATION_PROGRAM_CODE;
    query.params.programStartDate = this.startDate.format("YYYY-MM-DD")
    query.params.programEndDate = this.endDate.format("YYYY-MM-DD")
    return query;
  }

  get contactInstanceQuery() {
    let query = JSON.parse(JSON.stringify(ALL_COVID_INSTANCE_QUERY));
    query.params.ou = this.selectedOrganisationUnit;
    query.params.ouMode = 'DESCENDANTS';
    query.params.program = COVID_CONTACT_CASE_PROGRAM_CODE;
    query.params.programStartDate = this.startDate.format("YYYY-MM-DD")
    query.params.programEndDate = this.endDate.format("YYYY-MM-DD")
    return query;
  }

  get enrollmentQuery() {
    let query = { ...ALL_COVID_PROGRAM_ENROLLMENT_QUERY };
    query.params.ou = this.selectedOrganisationUnit;
    query.params.ouMode = 'DESCENDANTS';
    query.params.programStartDate = this.startDate.format("YYYY-MM-DD")
    query.params.programEndDate = this.endDate.format("YYYY-MM-DD")
    return query;
  }

  get eventQuery() {
    let query = { ...ALL_COVID_EVENT_QUERY };
    query.params.orgUnit = this.selectedOrganisationUnit;
    query.params.ouMode = 'DESCENDANTS';
    query.params.programStartDate = this.startDate.format("YYYY-MM-DD")
    query.params.programEndDate = this.endDate.format("YYYY-MM-DD")
    return query;
  }

  filterBy(filter) {
    this.searchText = filter.text;
    this.startDate = filter.date[0];
    this.endDate = filter.date[1]
    this.userGroupFilter = filter.userGroups || []
  }

  getChildren(relationships) {
    let results = [];
    if (!relationships) return [];
    // results = relationships.map(relationship => {
    //   let index = this.contactCasesIndex[relationship];
    //   if (index == null) return null;
    //   let contactCase = this.contactCases[index];
    //   return contactCase;
    // });
    relationships.forEach(trackedInstanceId => {
      let index = this.contactCasesIndex[trackedInstanceId];
      if (index) {
        let contactCase = this.contactCases[index];
        results.push(contactCase);
      }
    });
    return results;
  }

  getConfirmedChildren(relationships) {
    let results = [];
    results = relationships.map(relationship => {
      let index = this.confirmCasesIndex[relationship];
      if (index == null) return null;
      let contactCase = this.confirmCases[index];
      return contactCase;
    });
    return results;
  }

  selectAsTree(root) {
    let result = this.getTree(root);
    this.currentTree = result;
  }

  getTree(root) {
    let tree = {
      id: root.GdwLfGObIRT,
    };
    if (root.relationships != null && root.relationships.length > 0) {
      let children = this.getChildren(root.relationships);
      if (children != null && children.length > 0) {
        tree.children = children.map(child => this.getTree(child));
      }
    }
    return tree;
  }

  load() {
    this.process.loading = true;
    try {
      this.engine
        .query({
          confirmInstances: this.confirmInstanceQuery,
          contactInstances: this.contactInstanceQuery,
          //enrollments: this.enrollmentQuery,
          //events: this.eventQuery,
        })
        .then(this.loadSuccess, this.loadError);
      axios.get(`https://silacak.kemkes.go.id/api/userGroups.json?fields=displayName,id&paging=false`)
        .then(r=>{
          if(r.status === 200){
            if(r.data) this.userGroups = r.data.userGroups
          }
        })
        .catch(e =>{
          console.log(e)
        })
    } catch (error) {
      this.process.loading = false;
      console.log('error', error);
    }
  }

  convertCases(trackedEntityInstances) {
    let instances = [];
    let instanceIndex = trackedEntityInstances.reduce((result, instance, index) => {
      let convertedInstance = InstanceConverter.formatProfile(instance);
      if (convertedInstance) {
        instances.push(convertedInstance);
      }
      result[instance.trackedEntityInstance] = index;
      return result;
    }, {});
    return [instances, instanceIndex];
  }
  grouped(data, by) {
    return _.mapValues(_.groupBy(data, by), clist => clist.map(car => _.omit(car, by)));
  }

  loadSuccess(data) {
    try {
      if (data == null) return;
      if (data.confirmInstances) {
        let [instances, instanceIndex] = this.convertCases(data.confirmInstances.trackedEntityInstances);
        this.confirmCases = instances;
        this.confirmCasesIndex = instanceIndex;
        const _cases = toJS(instances)
        const allEnrollments = []
        _cases.map(c => allEnrollments.push(...c.enrollments))
        var groupedByPetugas = this.grouped(allEnrollments, 'storedBy')
        axios.get(`https://silacak.kemkes.go.id/api/users.json?paging=false&fields=id,userCredentials[username],surname,userGroups&filter=userCredentials.username:in:[${Object.keys(groupedByPetugas).join(',')}]`).then(r => {
          if (r.status === 200) {
            // console.log(r)
            this.confirmCasesUsers = r.data.users;
          }
        })
      }
      if (data.contactInstances) {
        let [instances, instanceIndex] = this.convertCases(data.contactInstances.trackedEntityInstances);
        this.contactCases = instances;
        this.contactCasesIndex = instanceIndex;
      }
    } catch (error) {
      console.log('error', error);
    }
    this.process.loading = false;
  }

  loadError(error) {
    this.process.loading = false;
    // console.log(error);
  }
}

export default CaseStore;
