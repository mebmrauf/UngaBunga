"use client";
import { useState, useEffect, useContext } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { ShopContext } from "../../context/ShopContext";

export default function Bounties() {
  const { token, navigate, recipes } = useContext(ShopContext)!;
  const [bounties, setBounties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createData, setCreateData] = useState({ title: "", description: "", rewardPoints: 10 });
  
  const [showSubmitModal, setShowSubmitModal] = useState<string | null>(null); // holds bountyId
  const [selectedRecipe, setSelectedRecipe] = useState("");

  const fetchBounties = async () => {
    try {
      const res = await axiosInstance.get("/api/bounty");
      if (res.data.success) {
        setBounties(res.data.bounties);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBounties();
  }, []);

  const handleCreate = async () => {
    if (!token) return navigate.push("/login");
    try {
      const res = await axiosInstance.post("/api/bounty/create", createData, { headers: { token } });
      if (res.data.success) {
        toast.success("Bounty posted!");
        setShowCreateModal(false);
        fetchBounties();
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create bounty");
    }
  };

  const handleSubmitRecipe = async () => {
    if (!token) return navigate.push("/login");
    if (!selectedRecipe) return toast.error("Please select a recipe");
    try {
      const res = await axiosInstance.post("/api/bounty/submit", {
        bountyId: showSubmitModal,
        recipeId: selectedRecipe
      }, { headers: { token } });
      if (res.data.success) {
        toast.success("Recipe submitted!");
        setShowSubmitModal(null);
        fetchBounties();
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit recipe");
    }
  };

  const handleAccept = async (bountyId: string, submissionId: string) => {
    if (!token) return navigate.push("/login");
    try {
      const res = await axiosInstance.post("/api/bounty/accept", {
        bountyId, submissionId
      }, { headers: { token } });
      if (res.data.success) {
        toast.success("Submission accepted!");
        fetchBounties();
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to accept submission");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Bounties...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Bounties 🎯</h1>
          <p className="text-gray-500">Fulfill recipe requests from the community to earn Reward Points!</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-700 transition">
          + Post Request
        </button>
      </div>

      <div className="space-y-6">
        {bounties.map(bounty => (
          <div key={bounty._id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{bounty.title}</h3>
                <p className="text-sm text-gray-500 mb-2">Requested by {bounty.requester?.name}</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">{bounty.description}</p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-yellow-100 text-yellow-800 font-black px-4 py-2 rounded-xl text-lg shadow-sm border border-yellow-200">
                  🪙 {bounty.rewardPoints} Pts
                </span>
                <p className={`mt-2 text-sm font-bold ${bounty.status === 'Open' ? 'text-orange-600' : 'text-gray-400'}`}>{bounty.status}</p>
              </div>
            </div>

            {/* Submissions area */}
            <div className="mt-6 border-t border-gray-100 pt-4">
              <h4 className="font-bold text-gray-900 mb-3">Submissions ({bounty.submissions?.length || 0})</h4>
              
              {bounty.submissions?.map((sub: any) => (
                <div key={sub._id} className={`flex justify-between items-center p-3 rounded-xl border ${sub.status === 'Accepted' ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'} mb-2`}>
                  <div className="flex items-center gap-3">
                    <img src={sub.recipe?.image?.[0] || 'https://via.placeholder.com/40'} alt="recipe" className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{sub.recipe?.title}</p>
                      <p className="text-xs text-gray-500">Submitted by {sub.submittedBy?.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {sub.status === 'Accepted' && <span className="text-orange-600 font-bold text-sm bg-orange-100 px-3 py-1 rounded-full">Accepted ✅</span>}
                    {bounty.status === 'Open' && (
                      <button onClick={() => handleAccept(bounty._id, sub._id)} className="text-xs font-bold bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 transition">
                        Accept
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {bounty.status === 'Open' && (
                <button onClick={() => setShowSubmitModal(bounty._id)} className="w-full mt-3 border-2 border-dashed border-gray-200 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-50 hover:text-orange-600 transition">
                  Submit a Recipe
                </button>
              )}
            </div>
          </div>
        ))}

        {bounties.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-3xl border border-gray-200 border-dashed">
            <p className="text-gray-500 font-medium">No bounties posted yet.</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Post a Recipe Request</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                <input type="text" className="w-full border border-gray-300 rounded-xl px-4 py-2" value={createData.title} onChange={e => setCreateData({...createData, title: e.target.value})} placeholder="e.g. 10-minute Keto Lunch" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea className="w-full border border-gray-300 rounded-xl px-4 py-2 h-24" value={createData.description} onChange={e => setCreateData({...createData, description: e.target.value})} placeholder="Describe exactly what you are looking for..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Reward Points</label>
                <input type="number" min="1" className="w-full border border-gray-300 rounded-xl px-4 py-2" value={createData.rewardPoints} onChange={e => setCreateData({...createData, rewardPoints: Number(e.target.value)})} />
                <p className="text-xs text-gray-500 mt-1">These points will be rewarded to the person who fulfills your request.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-500 font-bold">Cancel</button>
              <button onClick={handleCreate} className="px-5 py-2 bg-orange-600 text-white rounded-xl font-bold">Post Bounty</button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Submit a Recipe</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Select your recipe</label>
                <select className="w-full border border-gray-300 rounded-xl px-4 py-2" value={selectedRecipe} onChange={e => setSelectedRecipe(e.target.value)}>
                  <option value="">-- Choose a recipe --</option>
                  {recipes.map(r => (
                    <option key={r._id} value={r._id}>{r.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowSubmitModal(null)} className="px-4 py-2 text-gray-500 font-bold">Cancel</button>
              <button onClick={handleSubmitRecipe} className="px-5 py-2 bg-orange-600 text-white rounded-xl font-bold">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
