export interface AlbumInfo {
  album_type: string;
  artists?: (ArtistsEntity)[] | null;
  available_markets?: (string)[] | null;
  copyrights?: (CopyrightsEntity)[] | null;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  genres?: (null)[] | null;
  href: string;
  id: string;
  images: (ImagesEntity)[];
  label: string;
  name: string;
  popularity: number;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  tracks: Tracks;
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
export interface CopyrightsEntity {
  text: string;
  type: string;
}
export interface ExternalIds {
  upc: string;
}
export interface ImagesEntity {
  height: number;
  url: string;
  width: number;
}
export interface Tracks {
  href: string;
  items?: (ItemsEntity)[] | null;
  limit: number;
  next?: null;
  offset: number;
  previous?: null;
  total: number;
}
export interface ItemsEntity {
  artists?: (ArtistsEntity)[] | null;
  available_markets?: (string)[] | null;
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  preview_url?: null;
  track_number: number;
  type: string;
  uri: string;
}
