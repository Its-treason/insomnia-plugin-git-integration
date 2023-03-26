import Nedb from 'nedb';
import fsPath from 'node:path';
import { BaseModel } from '../insomniaDbTypes';

type DbTargets = 'Request' | 'RequestMeta' | 'RequestGroup' | 'RequestGroupMeta' | 'Workspace' | 'WorkspaceMeta' | 'Project' | 'Environment';

export default class BaseDb<T extends BaseModel> {
  private neDb: Nedb;

  constructor(target: DbTargets) {
    // @ts-ignore
    const filename = fsPath.join(window.app.getPath('userData'), `insomnia.${target}.db`);

    this.neDb = new Nedb({
      autoload: true,
      filename,
      corruptAlertThreshold: 0.9,
    });
  }

  public create(doc: T) {
    this.neDb.insert(doc);
  }

  public update(doc: T) {
    this.neDb.update(
      { _id: doc._id },
      doc,
    );
  }

  public async upsert(doc: T) {
    if (!await this.findById(doc._id)) {
      this.create(doc);
      return;
    }
    this.update(doc);
  }

  public async findById(id: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      this.neDb.findOne({ _id: id }, (err, doc) => {
        if (err) {
          reject(err)
        }

        resolve(doc);
      });
    });
  }

  public async findBy(field: keyof T, query: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.neDb.find({ [field]: query }, (err, docs) => {
        if (err) {
          reject(err)
        }

        resolve(docs);
      });
    });
  }

  public async findAll(): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.neDb.find({}, (err, docs) => {
        if (err) {
          reject(err)
        }

        resolve(docs);
      });
    });
  }

  public deleteBy(field: keyof T, query: string): void {
    this.neDb.remove({ [field]: query });
  }
}
