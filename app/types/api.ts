/** Generische, paginierte Antwort der DummyJSON-API */
export interface Paginated {
  total: number
  skip: number
  limit: number
}

export interface Post {
  id: number
  title: string
  body: string
  tags: string[]
  reactions: { likes: number, dislikes: number }
  views: number
  userId: number
}

export interface PostList extends Paginated {
  posts: Post[]
}

export type NewPost = Pick<Post, 'title' | 'body' | 'userId'>
