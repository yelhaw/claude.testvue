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

export interface LoginCredentials {
  username: string
  password: string
}

/** Antwort des Login-Endpunkts – an die eigene API anpassen */
export interface LoginResponse {
  id: number
  username: string
  firstName: string
  lastName: string
  accessToken: string
}

export type AuthUser = Pick<LoginResponse, 'id' | 'username' | 'firstName' | 'lastName'>
