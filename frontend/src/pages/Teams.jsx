import { useState, useEffect } from 'react';
import { teamService } from '../services';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const result = await teamService.getAll();
      setTeams(result.data.teams);
    } catch (err) {
      console.error('Failed to load teams:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="large" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Teams</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card key={team.id}>
            <h3 className="text-xl font-bold mb-2">{team.teamName}</h3>
            <p className="text-gray-600 mb-4">Members: {team.memberCount}</p>
            <p className="text-2xl font-semibold text-primary-600">${team.totalBalance.toLocaleString()}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
