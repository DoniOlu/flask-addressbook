import mockHomeAPI from "./mockHomeAPI";

const setupMockServer = function setupMockServer(app: any): void {
  mockHomeAPI(app);
};
export default setupMockServer;
