import { IEntidadesRepository } from '@/domain/entidades/repositories/IEntidadesRepository';
import { Entidade } from '@/domain/entidades/entities/Entidade';
import { prisma } from '..';
import { logger } from '@/infra/logger';

const log = logger.child('repository:entidades');

export class PrismaEntidadesRepository implements IEntidadesRepository {
  async findById(id: string): Promise<Entidade | null> {
    log.debug('Buscando entidade por ID', { id });

    const entidade = await prisma.entidade.findUnique({
      where: { id },
      include: {
        membros: {
          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
                urlFotoPerfil: true,
                curso: true,
                periodo: true,
                papel: true,
              },
            },
          },
        },
        projetos: true,
        publicacoes: {
          include: {
            autor: true,
          },
        },
      },
    });

    if (!entidade) {
      log.warn('Entidade não encontrada', { id });
      return null;
    }

    return Entidade.create(
      {
        ...entidade,
      },
      entidade.id
    );
  }

  async findMany(): Promise<Entidade[]> {
    log.debug('Listando entidades');

    const entidades = await prisma.entidade.findMany({
      orderBy: {
        nome: 'asc',
      },
    });

    log.info('Entidades carregadas', { quantidade: entidades.length });

    return entidades.map(entidade =>
      Entidade.create(
        {
          nome: entidade.nome,
          descricao: entidade.descricao,
          tipo: entidade.tipo,
          urlFoto: entidade.urlFoto,
          contato: entidade.contato,
          centroId: entidade.centroId,
          criadorId: entidade.criadorId,
        },
        entidade.id
      )
    );
  }
}
