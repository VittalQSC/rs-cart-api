import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { DB_OPTIONS } from 'src/constants';

@Injectable()
export class DatabaseManagerService {
  private client: Client|null = null;

  // TODO should not call end on each action
  async query(queryString: string) {
    this.client = this.client ?? new Client(DB_OPTIONS);
    this.client.connect();
    try {
      const result = await this.client.query(queryString);
      this.client.end();
      this.client = null;
      return result;
    } catch (error) {
      this.client.end();
      this.client = null;
    }
  }
}
