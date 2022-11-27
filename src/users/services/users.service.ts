import { Injectable } from '@nestjs/common';
import { DatabaseManagerService } from 'src/database-manager/database-manager.service';

import { v4 } from 'uuid';

import { User } from '../models';

@Injectable()
export class UsersService {
  constructor(private databaseManagerService: DatabaseManagerService) {}

  async findOne(userId: string): Promise<User | null> {
    const result = await this.databaseManagerService.query(`
      select id, name, password from users where name = '${userId}';
    `);
    return this._getUsersFromSelect(result)[0];
  }

  async createOne({ name, password }: User): Promise<User> {
    const id = v4(v4());

    // TODO db passwords should be stored encryped
    const result = await this.databaseManagerService.query(`
      insert into users(id, name, password) values('${id}', '${name}', '${password}');
      select id, name, password from users where name = '${name}';
    `);
    return this._getUsersFromSelect(result)[0];
  }

  _getUsersFromSelect(result): User | null {
    const results = Array.isArray(result) ? result : [result];
    const selectResult = results.find(r => !r || r.command === 'SELECT');
    if (!selectResult) {
      return null;
    }

    return selectResult.rows;
  }
}
