export interface NewReleasesType {
  albums: Albums;
}
export interface Albums {
  href: string;
  items: (ItemsEntity)[];
  limit: number;
  next: string;
  offset: number;
  previous?: null;
  total: number;
}
export interface ItemsEntity {
  album_type: string;
  artists: (ArtistsEntity)[];
  available_markets?: (string)[] | null;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: (ImagesEntity)[] ;
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
