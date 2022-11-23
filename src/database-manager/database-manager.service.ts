import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { DB_OPTIONS } from 'src/constants';

@Injectable()
export class DatabaseManagerService {
  // TODO should not call end on each action
  async query(queryString: string) {
    const client = new Client(DB_OPTIONS);
    client.connect();
    try {
      const result = await client.query(queryString);
      client.end();
      return result;
    } catch (error) {
      console.log('error', error);
      client.end();
    }
  }
}
