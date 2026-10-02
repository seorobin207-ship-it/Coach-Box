import { images } from '@/constants'

export const RANK_TIERS = [
  {
    minScore: 0,
    maxScore: 999,
    rank: images.rank1,
    nextRank: images.rank2,
    nextScore: 1000,
    name: 'Lính Mới',
    nameNext: 'Người Thách Đấu',
  },
  {
    minScore: 1000,
    maxScore: 2999,
    rank: images.rank2,
    nextRank: images.rank3,
    nextScore: 3000,
    name: 'Người Thách Đấu',
    nameNext: 'Chiến Binh',
  },
  {
    minScore: 3000,
    maxScore: 4999,
    rank: images.rank3,
    nextRank: images.rank4,
    nextScore: 5000,
    name: 'Chiến Binh',
    nameNext: 'Tinh anh',
  },
  {
    minScore: 5000,
    maxScore: 7999,
    rank: images.rank4,
    nextRank: images.rank5,
    nextScore: 8000,
    name: 'Tinh anh',
    nameNext: 'Nhà Vô Địch',
  },
  {
    minScore: 8000,
    maxScore: 9999,
    rank: images.rank5,
    nextRank: images.rank6,
    nextScore: 10000,
    name: 'Nhà Vô Địch',
    nameNext: 'Huyền thoại',
  },
  {
    minScore: 10000,
    maxScore: 999999,
    rank: images.rank6,
    nextRank: images.rank6,
    nextScore: 999999,
    name: 'Huyền thoại',
    nameNext: 'Huyền thoại',
  },
]

export const listDefaultRank = [
  {
    image: images.rank1,
    name: 'Lính Mới',
    description: 'Biết cách quấn băng đa, đứng đúng tư thế.',
    star: '0',
  },
  {
    image: images.rank2,
    name: 'Người Thách Đấu',
    description: 'Nắm vững kỹ thuật di chuyển và phối hợp.',
    star: '1,000',
  },
  {
    image: images.rank3,
    name: 'Chiến Binh',
    description: 'Thành thạo kỹ năng phòng thủ và bắt đầu biết phản công.',
    star: '3,000',
  },
  {
    image: images.rank4,
    name: 'Tinh anh',
    description: 'Có khả năng kiểm soát nhịp thở, làm chủ khoảng cách.',
    star: '5,000',
  },
  {
    image: images.rank5,
    name: 'Nhà Vô Địch',
    description: 'Phong độ đỉnh cao, trên đường chinh phục mọi thử thách.',
    star: '8,000',
  },
  {
    image: images.rank6,
    name: 'Huyền thoại',
    description: 'Đạt mức độ thượng thừa về kỹ thuật, có khả năng hướng dẫn.',
    star: '10,000',
  },
]
