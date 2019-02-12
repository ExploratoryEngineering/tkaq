interface ICollectionDto {
  collectionId: string;
  teamId: string;
  tags: { [tagName: string]: string };
}

export class Collection implements TagEntity {
  static newFromDto(collection: ICollectionDto): Collection {
    return new Collection({
      id: collection.collectionId,
      teamId: collection.teamId,
      tags: collection.tags,
    });
  }

  static toDto(collection: Collection): ICollectionDto {
    return {
      collectionId: collection.id,
      teamId: collection.teamId,
      tags: collection.tags,
    };
  }
  id: string;
  teamId: string;
  tags: { [tagName: string]: string };

  constructor({ id = "", teamId = "", tags = {} } = {}) {
    this.id = id;
    this.teamId = teamId;
    this.tags = tags;
  }
}
