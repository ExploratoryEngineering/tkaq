/* Configuration variables */

// Boolean which signalizes production build
declare const PRODUCTION: boolean;

// Horde backend endpoint
declare const TKAQ_ENDPOINT: string;
// Horde websocket backend endpoint
declare const TKAQ_WS_ENDPOINT: string;

/**
 * Input search parameters when getting data for either applications
 * or devices
 */
interface DataSearchParameters {
  limit?: number;
  since?: Date;
  until?: Date;
}

/**
 * Tag implementation for application
 */
interface Tag {
  key: string;
  value: string;
}

/**
 * Tagobject exisisting on TagEntities
 */
interface TagObject {
  [tagName: string]: string;
}

/**
 * An entity which contains a tag field with TagObject
 */
interface TagEntity {
  tags: TagObject;
}
