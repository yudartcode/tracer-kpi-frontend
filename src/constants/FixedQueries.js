import { COVID_CONFIRMATION_PROGRAM_CODE } from './DhisVariables';

// https://lacak.surveilans.org/api/trackedEntityInstances.json?ou=IU2HDuYpTnY&fields=orgUnit,trackedEntityInstance,geometry,relationships[relationship,from[trackedEntityInstance[trackedEntityInstance]],to[trackedEntityInstance[trackedEntityInstance]]],attributes[attribute,value]&paging=false
export const ALL_COVID_INSTANCE_QUERY = {
  resource: 'trackedEntityInstances',
  params: {
    //ou: ({ ou }) => ou, //'IU2HDuYpTnY',
    paging: false,
    fields: [
      'created',
      'lastUpdated',
      'orgUnit',
      'trackedEntityInstance',
      'geometry',
      'enrollments',
      'relationships[relationship,from[trackedEntityInstance[trackedEntityInstance]],to[trackedEntityInstance[trackedEntityInstance]]]',
      'attributes[attribute,value]',
    ],
  },
};

// https://lacak.surveilans.org/api/enrollments.json?ou=IU2HDuYpTnY&fields=program,orgUnit,trackedEntityInstance,enrollment,status,enrollmentDate,deleted
export const ALL_COVID_PROGRAM_ENROLLMENT_QUERY = {
  resource: 'enrollments',
  params: {
    //ou: ({ ou }) => ou, //'IU2HDuYpTnY',
    paging: false,
    fields: ['program', 'orgUnit', 'trackedEntityInstance', 'enrollment', 'status', 'enrollmentDate', 'deleted'],
  },
};

// https://lacak.surveilans.org/api/events.json?orgUnit=IU2HDuYpTnY&fields=program,event,programStage,orgUnit,trackedEntityInstance,enrollment,status,eventDate,followup,coordinate,dataValues[dataElement,value]
export const ALL_COVID_EVENT_QUERY = {
  resource: 'events',
  params: {
    //ou: ({ ou }) => ou, //'IU2HDuYpTnY',
    paging: false,
    fields: [
      'program',
      'event',
      'programStage',
      'orgUnit',
      'trackedEntityInstance',
      'enrollment',
      'status',
      'eventDate',
      'followup',
      'coordinate',
      'dataValues[dataElement, value]',
    ],
  },
};

export const ALL_ORGANISATION_UNIT = {
  resource: 'organisationUnits',
  params: {
    paging: false,
    fields: 'displayName,parent,id',
  },
};

export const USER_PROFILE = {
  resource: 'me',
};

//paging=false&fields=displayName,parent,id
export const INITIAL_CONFIG = {
  user: USER_PROFILE,
  ou: ALL_ORGANISATION_UNIT,
};
