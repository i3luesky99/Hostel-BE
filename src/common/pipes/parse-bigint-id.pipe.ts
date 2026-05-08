import { BadRequestException, PipeTransform } from '@nestjs/common';

/** Validates numeric string id for bigint PK columns. */
export class ParseBigIntIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (value == null || !/^\d+$/.test(value)) {
      throw new BadRequestException('Invalid id');
    }
    return value;
  }
}
