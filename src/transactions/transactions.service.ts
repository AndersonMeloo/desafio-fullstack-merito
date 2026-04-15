import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, TransactionType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      const fund = await this.prisma.fund.findUnique({
        where: { id: createTransactionDto.fundId },
      });

      if (!fund) {
        throw new NotFoundException('Fundo não encontrado');
      }

      const shares = this.calculateShares(
        createTransactionDto.amount,
        fund.pricePerShare,
      );

      if (createTransactionDto.type === TransactionType.RESGATE) {
        const walletByFund = await this.calculateFundWallet(
          createTransactionDto.fundId,
        );

        if (
          walletByFund.totalAmount + Number.EPSILON <
          createTransactionDto.amount
        ) {
          throw new BadRequestException('Saldo insuficiente para resgate');
        }

        if (walletByFund.totalShares + Number.EPSILON < shares) {
          throw new BadRequestException(
            'Quantidade de cotas insuficiente para resgate',
          );
        }
      }

      // Cria umna nova Transação (Aporte ou Resgate) E já calcula as cotas e data da Operação
      const transaction = await this.prisma.transaction.create({
        data: {
          fundId: createTransactionDto.fundId,
          type: createTransactionDto.type,
          amount: createTransactionDto.amount,
          shares,
          date: createTransactionDto.date
            ? new Date(createTransactionDto.date)
            : new Date(),
        },
        include: {
          fund: true, // Inclui os dados do fundo relacionado para facilitar a resposta da API
        },
      });

      // Retorna a mensagem de sucesso dinâmica dependendo do tipo da transação e os dados criados
      return {
        message:
          createTransactionDto.type === TransactionType.APORTE
            ? 'Aporte registrado com sucesso'
            : 'Resgate registrado com sucesso',
        data: transaction,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException('Fundo inválido para movimentação');
      }

      throw new InternalServerErrorException('Erro ao criar movimentação');
    }
  }

  async findAll() {
    try {
      // Busca todas as Transações do Sistema, incluindo o fundo relacionadom, ordenadas pela data mais recente
      const transactions = await this.prisma.transaction.findMany({
        include: {
          fund: true,
        },
        orderBy: {
          date: 'desc',
        },
      });

      return {
        message: 'Movimentações listadas com sucesso',
        data: transactions,
      };
    } catch {
      throw new InternalServerErrorException('Erro ao listar movimentações');
    }
  }

  //  Aqui calcula a quantidade de cotas com base no valor investido do usuário
  private calculateShares(amount: number, pricePerShare: number): number {
    return Number((amount / pricePerShare).toFixed(6));
  }

  // Aqui calcula o salkdo total do dinheiro das cotas do fundo, somando aportes e subtraindo resgates
  private async calculateFundWallet(fundId: string) {
    // Agrupa o APORTE e RESGATE somando os VALORES e COTAS
    const grouped = await this.prisma.transaction.groupBy({
      by: ['type'],
      where: { fundId },
      _sum: {
        amount: true,
        shares: true,
      },
    });

    const totals = grouped.reduce(
      (acc, item) => {
        const signal = item.type === TransactionType.APORTE ? 1 : -1;
        acc.totalAmount += signal * (item._sum.amount ?? 0);
        acc.totalShares += signal * (item._sum.shares ?? 0);
        return acc;
      },
      { totalAmount: 0, totalShares: 0 },
    );

    return totals;
  }
}
