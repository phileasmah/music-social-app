export interface Search {
  albums: Albums;
  artists: Artists;
}
export interface Albums {
  href: string;
  items?: (AlbumItem)[] | null;
  limit: number;
  next: string;
  offset: number;
  previous?: null;
  total: number;
}
export interface AlbumItem {
  album_type: string;
  artists?: (ArtistsEntity)[] | null;
  available_markets?: (string)[] | null;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images?: (ImagesEntity)[] | null;
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}
export interface ArtistsEntity {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}
export interface ExternalUrls {
  spotify: string;
}
export interface ImagesEntity {
  height: number;
  url: string;
  width: number;
}
export interface Artists {
  href: string;
  items?: (ArtistItem)[] | null;
  limit: number;
  next: string;
  offset: number;
  previous?: null;
  total: number;
}
export interface ArtistItem {
  external_urls: ExternalUrls;
  followers: Followers;
  genres?: (string | null)[] | null;
  href: string;
  id: string;
  images?: (ImagesEntity)[] | null;
  name: string;
  popularity: number;
  type: string;
  uri: string;
}
export interface Followers {
  href?: null;
  total: number;
}
