import { prisma } from '../prisma';
import { NotificationService } from './notification.service';
import { FriendshipStatus } from '../types';

export class FriendshipService {
  static async sendRequest(initiatorId: string, receiverId: string) {
    if (initiatorId === receiverId) {
      throw new Error('Нельзя отправить запрос самому себе');
    }

    const existing = await prisma.friendship.findUnique({
      where: {
        initiatorId_receiverId: {
          initiatorId,
          receiverId,
        },
      },
    });

    if (existing) {
      if (existing.status === FriendshipStatus.PENDING) {
        throw new Error('Запрос уже отправлен');
      }

      if (existing.status === FriendshipStatus.ACCEPTED) {
        throw new Error('Вы уже друзья');
      }

      if (existing.status === FriendshipStatus.BLOCKED) {
        throw new Error('Пользователь заблокирован');
      }
    }

    const reverse = await prisma.friendship.findUnique({
      where: {
        initiatorId_receiverId: {
          initiatorId: receiverId,
          receiverId: initiatorId,
        },
      },
    });

    if (reverse) {
      if (reverse.status === FriendshipStatus.PENDING) {
        return this.acceptRequest(reverse.id, receiverId);
      }
      if (reverse.status === FriendshipStatus.ACCEPTED) {
        throw new Error('Вы уже друзья');
      }
      if (reverse.status === FriendshipStatus.BLOCKED) {
        throw new Error('Пользователь заблокирован');
      }
    }

    const friendship = await prisma.friendship.create({
      data: {
        initiatorId,
        receiverId,
        status: FriendshipStatus.PENDING,
      },
    });

    await NotificationService.create({
      recipientId: receiverId,
      actorId: initiatorId,
      type: 'FRIEND_REQUEST',
      referenceType: 'friendship',
      referenceId: friendship.id,
    });

    return friendship;
  }

  static async acceptRequest(friendshipId: string, userId: string) {
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
      include: { initiator: true, receiver: true },
    });

    if (!friendship) {
      throw new Error('Запрос не найден');
    }

    if (friendship.receiverId !== userId) {
      throw new Error('Только получатель может принять запрос');
    }

    if (friendship.status !== FriendshipStatus.PENDING) {
      throw new Error('Запрос уже обработан');
    }

    const updated = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: FriendshipStatus.ACCEPTED },
    });

    await NotificationService.create({
      recipientId: friendship.initiatorId,
      actorId: userId,
      type: 'FRIEND_ACCEPT',
      referenceType: 'friendship',
      referenceId: friendship.id,
    });

    return updated;
  }

  static async rejectRequest(friendshipId: string, userId: string) {
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      throw new Error('Запрос не найден');
    }

    if (friendship.receiverId !== userId) {
      throw new Error('Только получатель может отклонить запрос');
    }

    if (friendship.status !== FriendshipStatus.PENDING) {
      throw new Error('Запрос уже обработан');
    }

    await prisma.friendship.delete({ where: { id: friendshipId } });
  }

  static async removeFriend(friendshipId: string, userId: string) {
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      throw new Error('Дружба не найдена');
    }

    if (friendship.initiatorId !== userId && friendship.receiverId !== userId) {
      throw new Error('Вы не участник этой дружбы');
    }

    if (friendship.status !== FriendshipStatus.ACCEPTED) {
      throw new Error('Вы не друзья');
    }

    await prisma.friendship.delete({ where: { id: friendshipId } });
  }

  static async getFriends(userId: string) {
    const friendships = await prisma.friendship.findMany({
      where: {
        status: FriendshipStatus.ACCEPTED,
        OR: [{ initiatorId: userId }, { receiverId: userId }],
      },
      include: {
        initiator: true,
        receiver: true,
      },
    });

    return friendships.map((f) =>
      f.initiatorId === userId ? f.receiver : f.initiator,
    );
  }

  static async getStatus(userId: string, otherUserId: string) {
    if (userId === otherUserId) {
      return 'self';
    }

    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { initiatorId: userId, receiverId: otherUserId },
          { initiatorId: otherUserId, receiverId: userId },
        ],
      },
    });

    if (!friendship) {
      return 'none';
    }

    if (friendship.status === FriendshipStatus.PENDING) {
      return friendship.initiatorId === userId
        ? 'pending_sent'
        : 'pending_received';
    }

    if (friendship.status === FriendshipStatus.ACCEPTED) {
      return 'friends';
    }

    return 'none';
  }

  static async getIncomingRequests(userId: string) {
    return prisma.friendship.findMany({
      where: {
        receiverId: userId,
        status: FriendshipStatus.PENDING,
      },
      include: {
        initiator: true,
        receiver: true,
      },
    });
  }

  static async getOutgoingRequests(userId: string) {
    return prisma.friendship.findMany({
      where: {
        initiatorId: userId,
        status: FriendshipStatus.PENDING,
      },
      include: {
        initiator: true,
        receiver: true,
      },
    });
  }
}
