import { autoinject } from "aurelia-framework";
import { format } from "date-fns";
import { ApiClient } from "Helpers/ApiClient";
import { Collection } from "Models/Collection";
import { TKAQDataPoint } from "Models/Device";

export * from "Models/Collection";
export {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "Helpers/ResponseHandler";

export interface CollectionMessage {
  payload: string;
  port: number;
}

@autoinject
export class CollectionService {
  constructor(private apiClient: ApiClient) {}

  fetchAllCollections(): Promise<Collection[]> {
    return this.apiClient.http
      .get("/collections")
      .then((data) => data.content.collections)
      .then((collections) => collections.map(Collection.newFromDto));
  }

  fetchCollectionById(id: string): Promise<Collection> {
    return this.apiClient.http
      .get(`/collections/${id}`)
      .then((data) => data.content)
      .then((collectionDto) => Collection.newFromDto(collectionDto));
  }

  createNewCollection(collection: Collection): Promise<Collection> {
    return this.apiClient.http
      .post("/collections", Collection.toDto(collection))
      .then((data) => data.content)
      .then((collectionDto) => Collection.newFromDto(collectionDto));
  }

  updateCollection(collection: Collection): Promise<Collection> {
    return this.apiClient.http
      .patch(`/collections/${collection.id}`, Collection.toDto(collection))
      .then((data) => data.content)
      .then((collectionDto) => Collection.newFromDto(collectionDto));
  }

  deleteCollection(collection: Collection): Promise<any> {
    return this.apiClient.http.delete(`/collections/${collection.id}`);
  }

  fetchDeviceMessagesByCollectionId(
    collectionId: string,
    { limit = 256, since = null, until = null }: DataSearchParameters = {},
    sort: boolean = false,
  ): Promise<TKAQDataPoint[]> {
    return this.apiClient.http
      .get(
        `/collections/${collectionId}/data?` +
          `${limit ? "limit=" + limit : ""}` +
          `${since ? "&since=" + format(since, "T") : ""}` +
          `${until ? "&until=" + format(until, "T") : ""}`,
      )
      .then((data) => {
        return data.content;
      })
      .then((messages: TKAQDataPoint[] = []) => {
        if (sort) {
          return messages.sort((a, b) => {
            return a.timestamp - b.timestamp;
          });
        } else {
          return messages;
        }
      });
  }
}
