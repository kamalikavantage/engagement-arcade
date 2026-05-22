import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../Common/Card';
import { Button } from '../Common/Button';
import { useConfig } from '../../context/ConfigContext';
import { Settings, ToggleRight, ToggleLeft, Save } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { config, updateModules, updateProbabilities, updatePointsConfig } = useConfig();
  const [savedMsg, setSavedMsg] = useState(false);
  const [localModules, setLocalModules] = useState(config.modules);
  const [localProbs, setLocalProbs] = useState(config.probabilities);
  const [localPoints, setLocalPoints] = useState(config.pointsConfig);

  const handleSaveAll = () => {
    updateModules(localModules);
    updateProbabilities(localProbs);
    updatePointsConfig(localPoints);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const toggleModule = (key: keyof typeof config.modules) => {
    setLocalModules((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card gradient>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings size={32} className="text-primary-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Configuration</h1>
              <p className="text-slate-300">Manage game settings and rewards</p>
            </div>
          </div>
          <motion.div animate={savedMsg ? { scale: 1.1 } : { scale: 1 }}>
            {savedMsg && <span className="text-green-400 font-bold">✓ Saved!</span>}
          </motion.div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Module Toggle */}
        <Card gradient>
          <h2 className="text-2xl font-bold text-white mb-4">Enable/Disable Modules</h2>
          <div className="space-y-3">
            {Object.entries(localModules).map(([key, enabled]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div>
                  <p className="font-semibold text-white capitalize">
                    {key
                      .replace(/([A-Z])/g, ' $1')
                      .trim()
                      .replace(/^./, (str) => str.toUpperCase())}
                  </p>
                  <p className="text-xs text-slate-400">
                    {enabled ? 'Active' : 'Disabled'}
                  </p>
                </div>
                <button
                  onClick={() => toggleModule(key as keyof typeof config.modules)}
                  className="text-2xl transition-transform"
                >
                  {enabled ? (
                    <ToggleRight size={28} className="text-primary-500" />
                  ) : (
                    <ToggleLeft size={28} className="text-slate-500" />
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Points Configuration */}
        <Card gradient>
          <h2 className="text-2xl font-bold text-white mb-4">Points Configuration</h2>
          <div className="space-y-4">
            {Object.entries(localPoints).map(([key, value]) => (
              <div key={key}>
                <label className="text-white font-semibold capitalize block mb-2">
                  {key
                    .replace(/([A-Z])/g, ' $1')
                    .trim()
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) =>
                    setLocalPoints({
                      ...localPoints,
                      [key]: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-white/10 border border-primary-500/30 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Reward Probabilities */}
      <Card gradient>
        <h2 className="text-2xl font-bold text-white mb-4">Reward Probabilities</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(localProbs).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between mb-2">
                <label className="text-white font-semibold capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <span className="text-primary-400 font-bold">{(value * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={value}
                onChange={(e) =>
                  setLocalProbs({
                    ...localProbs,
                    [key]: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-primary-500"
              />
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={value}
                onChange={(e) =>
                  setLocalProbs({
                    ...localProbs,
                    [key]: parseFloat(e.target.value),
                  })
                }
                className="w-full mt-2 px-3 py-1 bg-white/10 border border-primary-500/30 rounded text-white text-sm"
              />
            </div>
          ))}
        </div>

        {/* Probability Warning */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg"
        >
          <p className="text-yellow-200 text-sm">
            💡 Total probability: {(Object.values(localProbs).reduce((a, b) => a + b, 0) * 100).toFixed(1)}% (should be 100%)
          </p>
        </motion.div>
      </Card>

      {/* Campaign Info */}
      <Card>
        <h2 className="text-2xl font-bold text-white mb-4">Current Campaign</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="text-slate-400 text-sm mb-1">Campaign Name</p>
            <p className="text-lg font-bold text-white">{config.campaigns.name}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="text-slate-400 text-sm mb-1">Campaign Period</p>
            <p className="text-lg font-bold text-white">
              {new Date(config.campaigns.startDate).toLocaleDateString()} -{' '}
              {new Date(config.campaigns.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="md:col-span-2 p-4 bg-white/5 rounded-lg">
            <p className="text-slate-400 text-sm mb-1">Description</p>
            <p className="text-white">{config.campaigns.description}</p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={handleSaveAll} size="lg" icon={<Save size={20} />} className="flex-1">
          Save All Changes
        </Button>
      </div>

      {/* Info Box */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-2">📊 Configuration Tips</h3>
        <ul className="text-slate-300 text-sm space-y-2">
          <li>• Toggle modules to enable/disable games for all users</li>
          <li>• Adjust reward probabilities to control difficulty</li>
          <li>• Modify point values to control inflation/deflation</li>
          <li>• All changes are saved immediately to localStorage</li>
          <li>• Changes take effect for new sessions</li>
        </ul>
      </Card>
    </div>
  );
};
