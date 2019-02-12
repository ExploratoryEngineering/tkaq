/*
	Copyright 2019 Telenor Digital AS

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

export class CollectionServiceMock {
  fetchAllCollections() {
    return Promise.resolve([]);
  }
  fetchCollectionById() {
    return Promise.resolve({});
  }

  addTagToCollection() {
    return Promise.resolve({});
  }

  removeTagFromCollection() {
    return Promise.resolve({});
  }

  createNewCollection() {
    return Promise.resolve({});
  }
  updateCollection() {
    return Promise.resolve({});
  }
  deleteCollection() {
    return Promise.resolve();
  }

  fetchCollectionOutputs() {
    return Promise.resolve([]);
  }
  updateCollectionOutput() {
    return Promise.resolve({});
  }
  deleteCollectionOutput() {
    return Promise.resolve();
  }

  getCollectionOutputStatus() {
    return Promise.resolve({});
  }
  getCollectionOutputLogs() {
    return Promise.resolve({});
  }
  sendMessageToCollection() {
    return Promise.resolve();
  }
}
