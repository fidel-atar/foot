import { supabase } from './supabaseClient';

// Enhanced data service that uses Supabase
export const supabaseService = {
  // News
  getNews: async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  },

  getFeaturedNews: async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching featured news:', error);
      return [];
    }
  },

  getNewsById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching news by id:', error);
      return null;
    }
  },

  // Teams
  getTeams: async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  },

  getTeamById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching team by id:', error);
      return null;
    }
  },

  getTeamPlayers: async (teamId) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('team_id', teamId)
        .order('jersey_number');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching team players:', error);
      return [];
    }
  },

  // Players
  getPlayers: async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select(`
          *,
          teams (
            name,
            city
          )
        `)
        .order('name');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching players:', error);
      return [];
    }
  },

  getPlayerById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select(`
          *,
          teams (
            name,
            city
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching player by id:', error);
      return null;
    }
  },

  // Matches
  getMatches: async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey (
            name,
            logo_url
          ),
          away_team:teams!matches_away_team_id_fkey (
            name,
            logo_url
          )
        `)
        .order('match_date', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to match expected format
      return data.map(match => ({
        ...match,
        date: match.match_date,
        homeTeam: match.home_team_name,
        awayTeam: match.away_team_name,
        homeScore: match.home_score,
        awayScore: match.away_score
      }));
    } catch (error) {
      console.error('Error fetching matches:', error);
      return [];
    }
  },

  getMatchById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey (
            name,
            logo_url
          ),
          away_team:teams!matches_away_team_id_fkey (
            name,
            logo_url
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching match by id:', error);
      return null;
    }
  },

  // Shop
  getShopItems: async () => {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop_categories (
            name,
            description
          )
        `)
        .eq('is_available', true)
        .order('name');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }
  },

  getShopCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('shop_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching shop categories:', error);
      return [];
    }
  },

  getShopItemById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          shop_categories (
            name,
            description
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching shop item by id:', error);
      return null;
    }
  },

  // Admin functions
  createNews: async (newsData) => {
    try {
      const { data, error } = await supabase
        .from('news')
        .insert([newsData])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating news:', error);
      return { success: false, error: error.message };
    }
  },

  updateNews: async (id, newsData) => {
    try {
      const { data, error } = await supabase
        .from('news')
        .update(newsData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating news:', error);
      return { success: false, error: error.message };
    }
  },

  deleteNews: async (id) => {
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting news:', error);
      return { success: false, error: error.message };
    }
  },

  createTeam: async (teamData) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([teamData])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating team:', error);
      return { success: false, error: error.message };
    }
  },

  updateTeam: async (id, teamData) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .update(teamData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating team:', error);
      return { success: false, error: error.message };
    }
  },

  deleteTeam: async (id) => {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting team:', error);
      return { success: false, error: error.message };
    }
  },

  createPlayer: async (playerData) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .insert([playerData])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating player:', error);
      return { success: false, error: error.message };
    }
  },

  updatePlayer: async (id, playerData) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .update(playerData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating player:', error);
      return { success: false, error: error.message };
    }
  },

  deletePlayer: async (id) => {
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting player:', error);
      return { success: false, error: error.message };
    }
  },

  createMatch: async (matchData) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .insert([matchData])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating match:', error);
      return { success: false, error: error.message };
    }
  },

  updateMatch: async (id, matchData) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .update(matchData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating match:', error);
      return { success: false, error: error.message };
    }
  },

  deleteMatch: async (id) => {
    try {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting match:', error);
      return { success: false, error: error.message };
    }
  },

  createShopItem: async (itemData) => {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .insert([itemData])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating shop item:', error);
      return { success: false, error: error.message };
    }
  },

  updateShopItem: async (id, itemData) => {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .update(itemData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating shop item:', error);
      return { success: false, error: error.message };
    }
  },

  deleteShopItem: async (id) => {
    try {
      const { error } = await supabase
        .from('shop_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting shop item:', error);
      return { success: false, error: error.message };
    }
  },

  // Stats
  getStats: async () => {
    try {
      const [teamsCount, playersCount, matchesCount, itemsCount] = await Promise.all([
        supabase.from('teams').select('id', { count: 'exact', head: true }),
        supabase.from('players').select('id', { count: 'exact', head: true }),
        supabase.from('matches').select('id', { count: 'exact', head: true }),
        supabase.from('shop_items').select('id', { count: 'exact', head: true })
      ]);

      return {
        totalTeams: teamsCount.count || 0,
        totalPlayers: playersCount.count || 0,
        totalMatches: matchesCount.count || 0,
        totalItems: itemsCount.count || 0
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        totalTeams: 0,
        totalPlayers: 0,
        totalMatches: 0,
        totalItems: 0
      };
    }
  }
};

export default supabaseService;