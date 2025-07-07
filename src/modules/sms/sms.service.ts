import { SMS_DB_CONNECTION } from '@/common/providers/sms-db.providers';
import { Inject, Injectable } from '@nestjs/common';
import * as sql from 'mssql';
import { SmsData } from './types/sms-data';
import { EnvService } from '../env/env.service';

@Injectable()
export class MmsService {
  constructor(
    @Inject(SMS_DB_CONNECTION) private pool: sql.ConnectionPool,
    private env: EnvService,
  ) {}

  async sendDetailMessage(data: SmsData): Promise<void> {
    const sqlQuery = `
      INSERT INTO MMS_MSG (
          PHONE, SUBJECT, CALLBACK, STATUS, REQDATE,
          MSG, FILE_CNT, EXPIRETIME, ID, ETC1, TYPE
      ) VALUES (
          @phone, @subject, @callback, @status, GetDate(),
          @msg, @fileCnt, @expireTime, @id, @etc1, @type
      )
    `;

    const request = this.pool.request();

    request.input('phone', sql.NVarChar, data.phoneNumber);
    request.input('subject', sql.NVarChar(20), data.subject);
    request.input('callback', sql.VarChar, data.callback);
    request.input('status', sql.Char(1), data.status);
    request.input('msg', sql.NVarChar(sql.MAX), data.msg);
    request.input('fileCnt', sql.Int, data.fileCnt);
    request.input('expireTime', sql.VarChar(10), data.expireTime);
    request.input('id', sql.VarChar, data.id);
    request.input('etc1', sql.Char(1), data.etc1);
    request.input('type', sql.NVarChar(10), data.type);

    await request.query(sqlQuery);
  }

  async sendMessage({
    phoneNumber,
    message,
  }: {
    phoneNumber: string;
    message: string;
  }): Promise<void> {
    await this.sendDetailMessage({
      subject: 'eClick 부가서비스',
      phoneNumber,
      callback: this.env.SMS_CALLBACK,
      status: '0',
      msg: message,
      fileCnt: 0,
      expireTime: '180',
      id: this.env.SMS_ID,
      etc1: '1',
      type: '',
    });
  }
}
