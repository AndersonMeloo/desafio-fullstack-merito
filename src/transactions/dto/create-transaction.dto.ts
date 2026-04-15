import { TransactionType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreateTransactionDto {
  @IsUUID('4', { message: 'O identificador do fundo deve ser um UUID válido' })
  fundId!: string;

  @IsEnum(TransactionType, {
    message: 'O tipo da movimentação deve ser um APORTE ou RESGATE',
  })
  type!: TransactionType;

  @Type(() => Number)
  @IsNumber({}, { message: 'O valor da movimentação deve ser um número' })
  @IsPositive({ message: 'O valor da movimentação deve ser maior que zero' })
  amount!: number;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'A data da movimentação deve estar no formato válido' },
  )
  date?: string;
}
