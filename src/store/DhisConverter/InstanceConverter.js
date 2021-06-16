import axios from 'axios';
import moment from 'moment';

export class InstanceConverter {
  formatProfile(instance, program_id = null) {
    let profile = instance.attributes.reduce((resultObject, attribute) => {
      resultObject[attribute.attribute] = attribute.value;
      return resultObject;
    }, {});
    if (instance.created) {
      profile.created_date = moment(instance.created).format('DD MMM yyyy');
    }
    if (instance.lastUpdated) {
      profile.updated_date = moment(instance.lastUpdated).format('DD MMM yyyy');
    }

    if (program_id != null && instance.enrollments && instance.enrollments.length > 0) {
      let program = instance.enrollments.reduce((result, enrollment) => {
        if (enrollment.program == program_id) return enrollment;
        return result;
      }, null);

      if (program != null) {
        profile.followup = program.followup === true;
      }
    }
    profile.id = instance.trackedEntityInstance;
    profile.petugas = instance.enrollments[0].storedBy;
    profile.relationships = [];
    if (instance.relationships != null && instance.relationships.length > 0) {
      profile.relationships = instance.relationships.reduce((result, relationship) => {
        let newId = relationship.to.trackedEntityInstance.trackedEntityInstance;
        if (newId != profile.id) {
          result.push(newId);
        }
        return result;
      }, []);
    }
    if (
      instance.featureType === 'POINT' &&
      instance.geometry !== null &&
      instance.geometry.type === 'Point' &&
      instance.geometry.coordinates !== null &&
      instance.geometry.coordinates.length > 1 // min 2
    ) {
      profile.longitude = instance.geometry.coordinates[0];
      profile.latitude = instance.geometry.coordinates[1];
    }
    profile.enrollments = instance.enrollments
    return profile;
  }

  formatRelationship(instance_id, relationships, contacts) {
    return relationships.reduce((result, relation) => {
      let id = relation.from.trackedEntityInstance.trackedEntityInstance;
      if (id !== instance_id) {
        let relatedContact = contacts.filter(contact => contact.id === id);
        if (relatedContact != null && relatedContact.length > 0) {
          result.push(relatedContact[0]);
        }
      }
      id = relation.to.trackedEntityInstance.trackedEntityInstance;
      if (id !== instance_id) {
        let relatedContact = contacts.filter(contact => contact.id === id);
        if (relatedContact != null && relatedContact.length > 0) {
          result.push(relatedContact[0]);
        }
      }

      return result;
    }, []);
  }

  convertProfile(instance, newProfile) {
    // Update real object
    let attributes = instance.attributes;
    let newAttributes = [];
    for (let prop_name in newProfile) {
      // Skip this
      if (
        prop_name === 'longitude' ||
        prop_name === 'latitude' ||
        prop_name === 'followup' ||
        prop_name === 'updated_date' ||
        prop_name === 'created_date'
      )
        continue;

      var prop_value = newProfile[prop_name];
      if (prop_value instanceof moment) {
        let new_prop_value = prop_value.format('yyyy-MM-DD');
        prop_value = new_prop_value;
      }

      // Find the attribute
      var existingAttribute = attributes.filter(attribute => attribute.attribute === prop_name);
      if (existingAttribute != null && existingAttribute.length > 0) {
        // Update existing
        var newAttribute = existingAttribute[0];
        newAttribute.value = prop_value;
        newAttributes.push(newAttribute);
      } else {
        // Retain existing
        newAttributes.push({
          attribute: prop_name,
          value: prop_value,
        });
      }
    }

    if (
      newProfile.longitude !== null &&
      newProfile.latitude !== null &&
      newProfile.longitude !== 'undefined' &&
      newProfile.latitude !== 'undefined'
    ) {
      instance.coordinates = `[${newProfile.longitude},${newProfile.latitude}]`;
      instance.featureType = 'POINT';
      instance.geometry = {
        type: 'Point',
        coordinates: [newProfile.longitude, newProfile.latitude],
      };
    }
    instance.attributes = newAttributes;
    return instance;
  }
}
const instanceConverter = new InstanceConverter();
export default instanceConverter;
