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

import { App } from "app";
import { RouterMock, SignalerMock } from "Test/mock/mocks";

jest.useFakeTimers();

describe("the App module", () => {
  let sut;
  let mockedRouter;
  let mockedSignaler;

  beforeEach(() => {
    mockedRouter = new RouterMock();
    mockedSignaler = new SignalerMock();
    sut = new App(mockedSignaler, mockedRouter);
    sut.configureRouter(mockedRouter, mockedRouter);
  });

  describe("Basic functionality", () => {
    it("contains a router property", () => {
      expect(sut.router).toBeDefined();
    });

    it("configures the router title", () => {
      expect(sut.router.title).toBeTruthy();
    });

    it("should signal the signaler with updateTime", () => {
      spyOn(mockedSignaler, "signal");
      expect(mockedSignaler.signal).not.toHaveBeenCalled();
      jest.runTimersToTime(sut.UPDATE_TIME_INTERVAL_MS);
      expect(mockedSignaler.signal).toHaveBeenCalledWith("updateTime");
    });
  });

  describe("Authorize functionality", () => {
    const navInstructionWithoutAuth = {
      getAllInstructions: () => {
        return [
          {
            config: {
              settings: {
                auth: false,
              },
            },
          },
        ];
      },
    };

    const navInstructionWithAuth = {
      getAllInstructions: () => {
        return [
          {
            config: {
              settings: {
                auth: true,
              },
            },
          },
        ];
      },
    };

    it("should call next on nav if a route is not authed and user is not logged in", () => {
      const callback = {
        next: () => {
          return;
        },
      };
      spyOn(callback, "next");

      mockedRouter.authStep.run(navInstructionWithoutAuth, callback.next);
      expect(callback.next).toHaveBeenCalled();
    });

    it("should call next on nav if a route is auth and user is logged in", (done) => {
      const callback = {
        next: function() {
          return;
        },
      };
      spyOn(callback, "next");

      mockedRouter.authStep.run(navInstructionWithAuth, callback.next).then(() => {
        expect(callback.next).toHaveBeenCalled();
        done();
      });
    });
  });
});
