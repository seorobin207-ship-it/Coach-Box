// src/data/blog.ts
import { images } from '@/constants'

export type BlogSection = {
  heading: string
  content: string
  photos?: any[] // nếu có ảnh minh họa từng đoạn
}

export type Post = {
  id: string
  title: string
  excerpt: string // đoạn tóm tắt ngắn để hiển thị trong list
  tags: string[] // chủ đề (Biển xanh, Tái chế, Trồng cây...)
  coverStatic?: any // ảnh bìa
  author?: string
  publishedAt?: string // ngày diễn ra hoặc ngày viết
  readMins?: number
  sections: BlogSection[] // nội dung chính chia theo mục
}

export const blogPosts: Post[] = [
  {
    id: '1',
    title: 'Một ngày làm sạch bãi biển Mỹ Khê',
    excerpt:
      'Chuyến đi cuối tuần cùng nhóm bạn nhỏ để nhặt rác trên bãi biển và học cách phân loại rác.',
    tags: ['Biển xanh', 'Cộng đồng', 'Truyền cảm hứng'],
    coverStatic: images.post3,
    author: 'GreenKids Team',
    publishedAt: '25/09/2025',
    readMins: 6,
    sections: [
      {
        heading: 'Bắt đầu hành trình',
        content:
          'Buổi sáng, chúng tôi tập trung ở bãi biển Mỹ Khê. Các bạn nhỏ rất háo hức khi được phát găng tay và túi phân loại rác.',
      },
      {
        heading: 'Những phát hiện thú vị',
        content:
          'Không chỉ nhặt rác, các em còn học cách phân biệt nhựa, giấy, kim loại. Có em còn hào hứng kể cho bạn về cách tái chế chai nhựa thành chậu cây.',
      },
      {
        heading: 'Cảm xúc sau hoạt động',
        content:
          'Khi nhìn lại bãi biển sạch hơn hẳn, ai cũng thấy tự hào. Nhiều em chia sẻ muốn rủ thêm bạn bè cùng tham gia lần sau.',
      },
      {
        heading: 'Bài học rút ra',
        content:
          'Qua hoạt động này, trẻ hiểu rằng hành động nhỏ như nhặt một mẩu rác cũng góp phần bảo vệ môi trường và lan tỏa ý thức sống xanh.',
      },
    ],
  },
  {
    id: '2',
    title: 'Trồng cây xanh ở công viên Hòa Xuân',
    excerpt: 'Một buổi sáng đáng nhớ cùng nhau gieo 1.000 mầm cây để công viên thêm xanh mát.',
    tags: ['Trồng cây', 'Khí hậu'],
    coverStatic: images.post1,

    author: 'City Green Club',
    publishedAt: '24/09/2025',
    readMins: 5,
    sections: [
      {
        heading: 'Không khí nhộn nhịp',
        content:
          'Các gia đình cùng nhau đào hố, tưới nước và gắn thẻ tên cho từng cây. Mỗi bé tự tay trồng một cây mang tên mình.',
      },
      {
        heading: 'Khoảnh khắc ấm áp',
        content:
          'Có bé còn thì thầm “Mau lớn nhé!” với cây vừa trồng. Những giọt mồ hôi xen lẫn tiếng cười khiến công viên trở nên đầy sức sống.',
      },
      {
        heading: 'Ý nghĩa lâu dài',
        content:
          'Những cây xanh này sẽ lớn lên cùng các em, tạo bóng mát và nhắc nhở rằng thiên nhiên cần được chăm sóc mỗi ngày.',
      },
    ],
  },
  {
    id: '3',
    title: 'Đổi rác lấy quà tại Nhà văn hóa thiếu nhi',
    excerpt:
      'Trò chơi vui nhộn giúp các bé hiểu cách phân loại rác và nhận về những phần quà xanh.',
    tags: ['Giáo dục', 'Phân loại rác'],
    coverStatic: images.post2,

    author: 'Recycle4Kids',
    publishedAt: '22/09/2025',
    readMins: 4,
    sections: [
      {
        heading: 'Không gian rộn ràng',
        content:
          'Góc sân nhà văn hóa được trang trí nhiều màu xanh. Trẻ em mang pin cũ, vỏ chai nhựa để đổi lấy sticker môi trường.',
      },
      {
        heading: 'Học mà chơi',
        content:
          'Các trò chơi nhỏ giúp bé hiểu tại sao pin không được bỏ chung với rác thường, hay cách nhựa PET có thể tái chế thành đồ dùng mới.',
      },
      {
        heading: 'Thông điệp gửi gắm',
        content:
          'Mỗi bé ra về không chỉ có phần quà nhỏ mà còn mang theo niềm vui và ý thức phân loại rác ngay trong gia đình.',
      },
    ],
  },
]
