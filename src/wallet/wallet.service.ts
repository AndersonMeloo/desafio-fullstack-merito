import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    try {
      // Busca todos os fundos com as transações
      const funds = await this.prisma.fund.findMany({
        include: {
          transactions: true,
        },
      });

      // Calcula posição de cada fundo SALDO E COTAS
      const positions = funds.map((fund) => {
        const summary = fund.transactions.reduce(
          (acc, transaction) => {
            const signal = transaction.type === TransactionType.APORTE ? 1 : -1;
            acc.amount += signal * transaction.amount;
            acc.shares += signal * transaction.shares;
            return acc;
          },
          { amount: 0, shares: 0 },
        );

        return {
          fundId: fund.id,
          fundName: fund.name,
          ticker: fund.ticker,
          shares: Number(summary.shares.toFixed(6)),
          balance: Number(summary.amount.toFixed(2)),
        };
      });

      // Remove fundos sem posição (ZERADOS OU NEGATIVAS)
      const filterdPositions = positions.filter(
        (position) => position.shares > 0,
      );

      // Soma o valor TOTAL DA CARTEIRA
      const totalBalance = filterdPositions.reduce(
        (acc, position) => acc + position.balance,
        0,
      );

      return {
        message: 'Resumo da carteira retornada com sucesso',
        data: {
          totalBalance: Number(totalBalance.toFixed(2)),
          positions: filterdPositions,
        },
      };
    } catch {
      throw new InternalServerErrorException(
        'Erro ao calcular o resumo da carteira',
      );
    }
  }
}
