import { useState, useEffect } from 'react'
import './MealTracker.css'
import { db } from './firebase'
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore'

function App() {
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load meals from Firebase on component mount
  useEffect(() => {
    const loadMeals = async () => {
      const mealsCollection = collection(db, 'meals');
      const q = query(mealsCollection, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const mealList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date // Firebase stores the date as a timestamp
      }));
      setMeals(mealList);
    };

    loadMeals();
  }, []);

  const uniqueMealNames = [...new Set(meals.map(meal => meal.name))];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMeal(value);

    if (value.trim()) {
      const filtered = uniqueMealNames.filter(
        name => name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const addMeal = async (mealName = newMeal) => {
    if (mealName.trim()) {
      const newMealData = {
        name: mealName.trim(),
        date: new Date().toISOString()
      };

      // Add to Firebase
      const docRef = await addDoc(collection(db, 'meals'), newMealData);
      
      // Update local state
      setMeals(prev => [
        {
          ...newMealData,
          id: docRef.id
        },
        ...prev
      ]);
      
      setNewMeal('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const getDaysSince = (dateString) => {
    const mealDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - mealDate);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDaysAgo = (days) => {
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    return `${days} days ago`;
  };

  return (
    <div className="meal-tracker">
      <h1>Meal History Tracker</h1>
      
      <div className="input-container">
        <div className="input-row">
          <input
            type="text"
            className="meal-input"
            value={newMeal}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addMeal();
            }}
            placeholder="Enter meal name"
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200);
            }}
          />
          <button className="add-button" onClick={() => addMeal()}>
            Add Meal
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => {
                  addMeal(suggestion);
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="meal-list">
        {meals.map((meal) => {
          const daysSince = getDaysSince(meal.date);
          return (
            <div key={meal.id} className="meal-item">
              <span>{meal.name}</span>
              <span className="days-ago">
                {formatDaysAgo(daysSince)}
              </span>
            </div>
          );
        })}
        
        {meals.length === 0 && (
          <div className="empty-state">
            No meals logged yet. Add your first meal above!
          </div>
        )}
      </div>
    </div>
  );
}

export default App