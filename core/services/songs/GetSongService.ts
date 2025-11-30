/**
 * @deprecated This file is deprecated. Use the following services instead:
 * - SongQueryService for search/read operations: import { songQueryService } from '@/core/services/songs/SongQueryService'
 * - SongCommandService for create/update/delete operations: import { songCommandService } from '@/core/services/songs/SongCommandService'
 */

import { songQueryService } from './SongQueryService';
import { songCommandService } from './SongCommandService';
import { CreateSongDTO } from '@/core/models/data/Song';

// Re-export from new services for backwards compatibility
export { Song, CreateSongDTO } from '@/core/models/data/Song';
export { ApiEnvelope, songQueryService } from './SongQueryService';
export { songCommandService } from './SongCommandService';

// Legacy alias - will be removed in future version
export const songsService = {
  // Query operations (from SongQueryService)
  search: (query: string) => songQueryService.search(query),
  searchDebounced: (query: string) => songQueryService.searchDebounced(query),
  getById: (id: string) => songQueryService.getById(id),
  listMine: (page?: number, limit?: number) => songQueryService.listUserSongs(page, limit),
  listAll: (page?: number, limit?: number) => songQueryService.listAll(page, limit),
  clearMyListCache: () => songQueryService.clearUserSongsCache(),
  getSongStreamUrl: (blobName: string) => songQueryService.getStreamUrl(blobName),
  
  // Command operations (from SongCommandService)
  create: (dto: CreateSongDTO) => songCommandService.create(dto),
  updateSong: (id: string, updates: Partial<CreateSongDTO>) => songCommandService.update(id, updates),
  deleteSong: (id: string) => songCommandService.delete(id),
};
