"use client";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../../context/ShopContext";

export default function UserProfile() {
  const { backendUrl, token } = useContext(ShopContext)!;
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const [dietaryInput, setDietaryInput] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [budget, setBudget] = useState<number>(0);

  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/profile`, { headers: { token } });
        if (res.data.success && res.data.user) {
          setProfile(res.data.user);
          setDietaryRestrictions(res.data.user.preferences?.dietaryRestrictions || []);
          setBudget(res.data.user.preferences?.budget || 0);
        }
      } catch (err) {
        toast.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, backendUrl]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && dietaryInput.trim() !== "") {
      e.preventDefault();
      if (!dietaryRestrictions.includes(dietaryInput.trim())) {
        setDietaryRestrictions([...dietaryRestrictions, dietaryInput.trim()]);
      }
      setDietaryInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setDietaryRestrictions(dietaryRestrictions.filter(t => t !== tag));
  };

  const handleSave = async () => {
    try {
      const preferences = { dietaryRestrictions, budget };
      const res = await axios.put(`${backendUrl}/api/user/profile`, { preferences }, { headers: { token } });
      if (res.data.success) {
        toast.success("Preferences saved successfully!");
        setProfile(res.data.user);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to save preferences");
    }
  };

  if (!token) return <div className="p-10 text-center">Please log in to view your profile.</div>;
  if (loading) return <div className="p-10 text-center">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-500 mb-6">Manage your settings and AI preferences.</p>

        <div className="flex items-center gap-4 mb-8 p-4 bg-orange-50 rounded-2xl border border-orange-100">
          <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center text-orange-700 font-bold text-2xl">
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{profile?.name}</h2>
            <p className="text-sm text-gray-500">{profile?.email}</p>
            <p className="text-sm font-bold text-orange-600 mt-1">⭐ {profile?.points || 0} Reward Points</p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-4">Meal Planning Preferences</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Dietary Restrictions</label>
            <p className="text-xs text-gray-500 mb-2">Type a tag (e.g. Vegan, Nut-Free) and press Enter.</p>
            <div className="border border-gray-300 rounded-xl p-3 flex flex-wrap gap-2 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
              {dietaryRestrictions.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="text-gray-400 hover:text-red-500">×</button>
                </span>
              ))}
              <input
                type="text"
                value={dietaryInput}
                onChange={(e) => setDietaryInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add restriction..."
                className="flex-1 outline-none min-w-[120px] bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Weekly Budget (BDT)</label>
            <p className="text-xs text-gray-500 mb-2">Our AI will prioritize recipes that fit your budget.</p>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              placeholder="e.g. 2000"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-orange-600 text-white font-bold text-lg py-3 rounded-xl shadow-md hover:bg-orange-700 transition"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
