import { schema } from 'normalizr';

const userSchema = new schema.Entity('user');
const serviceSchema = new schema.Entity('services', {
  owner: userSchema,
  manager: [ userSchema ]
});
const buildingSchema = new schema.Entity('buildings', {
  wner: userSchema,
  manager: [ userSchema ],
  services: [ serviceSchema ]
});
const claimSchema = new schema.Entity('claims', {
  by: userSchema,
  service: serviceSchema
});
const incidentReportSchema = new schema.Entity('incidentReports', {
  building: buildingSchema,
  reportedBy: userSchema
});
const etaSchema = new schema.Entity('etas');

const Schemas = {
  USER: userSchema,
  USER_ARRAY: [ userSchema ],
  BUILDING: buildingSchema,
  BUILDING_ARRAY: [ buildingSchema ],
  SERVICE: serviceSchema,
  SERVICE_ARRAY: [ serviceSchema ],
  CLAIM: claimSchema,
  CLAIM_ARRAY: [ claimSchema ],
  INCIDENTREPORT: incidentReportSchema,
  INCIDENTREPORT_ARRAY: [ incidentReportSchema ],
  ETA: etaSchema
};

export default Schemas;
