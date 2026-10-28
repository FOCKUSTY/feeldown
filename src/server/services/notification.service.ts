import type { NotificationType } from '../types';
import { prisma } from '../prisma';

export class NotificationService {
  static async create(data: {
    recipientId: string;
    actorId?: string | null;
    type: NotificationType;
    referenceType: string;
    referenceId: string;
  }) {
    return prisma.notification.create({
      data: {
        recipientId: data.recipientId,
        actorId: data.actorId,
        type: data.type,
        referenceType: data.referenceType,
        referenceId: data.referenceId,
        readed: false,
      },
    });
  }

  static async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, recipientId: userId },
      data: { readed: true },
    });
  }

  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { recipientId: userId, readed: false },
      data: { readed: true },
    });
  }

  static async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { recipientId: userId, readed: false },
    });
  }

  static async getList(
    userId: string,
    { page = 1, limit = 20 }: { page?: number; limit?: number },
  ) {
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { recipientId: userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          actor: {
            select: { id: true, name: true, username: true },
          },
        },
      }),
      prisma.notification.count({ where: { recipientId: userId } }),
    ]);

    return { data: notifications, pagination: { page, limit, total } };
  }
}
