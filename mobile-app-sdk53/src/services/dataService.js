import supabaseService from './supabaseService';

// Data service that uses Supabase backend
export const dataService = {
  // News
  getNews: () => supabaseService.getNews(),
  getFeaturedNews: () => supabaseService.getFeaturedNews(),
  getNewsById: (id) => supabaseService.getNewsById(id),

  // Teams
  getTeams: () => supabaseService.getTeams(),
  getTeamById: (id) => supabaseService.getTeamById(id),
  getTeamPlayers: (teamId) => supabaseService.getTeamPlayers(teamId),

  // Players
  getPlayers: () => supabaseService.getPlayers(),
  getPlayerById: (id) => supabaseService.getPlayerById(id),

  // Matches
  getMatches: () => supabaseService.getMatches(),
  getMatchById: (id) => supabaseService.getMatchById(id),

  // Shop
  getShopItems: () => supabaseService.getShopItems(),
  getShopCategories: () => supabaseService.getShopCategories(),
  getShopItemById: (id) => supabaseService.getShopItemById(id),

  // Stats
  getStats: () => supabaseService.getStats(),

  // Admin functions
  createNews: (data) => supabaseService.createNews(data),
  updateNews: (id, data) => supabaseService.updateNews(id, data),
  deleteNews: (id) => supabaseService.deleteNews(id),
  
  createTeam: (data) => supabaseService.createTeam(data),
  updateTeam: (id, data) => supabaseService.updateTeam(id, data),
  deleteTeam: (id) => supabaseService.deleteTeam(id),
  
  createPlayer: (data) => supabaseService.createPlayer(data),
  updatePlayer: (id, data) => supabaseService.updatePlayer(id, data),
  deletePlayer: (id) => supabaseService.deletePlayer(id),
  
  createMatch: (data) => supabaseService.createMatch(data),
  updateMatch: (id, data) => supabaseService.updateMatch(id, data),
  deleteMatch: (id) => supabaseService.deleteMatch(id),
  
  createShopItem: (data) => supabaseService.createShopItem(data),
  updateShopItem: (id, data) => supabaseService.updateShopItem(id, data),
  deleteShopItem: (id) => supabaseService.deleteShopItem(id),
};

export default dataService; 