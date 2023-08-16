import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  md5(str) {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
  }
}
